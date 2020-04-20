package com.dnastack.ddap.common;

import com.dnastack.ddap.common.page.AnyDdapPage;
import com.dnastack.ddap.common.util.DdapLoginUtil;
import com.dnastack.ddap.common.util.WebDriverCookieHelper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.HttpResponse;
import org.apache.http.client.CookieStore;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.CookieSpecs;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.openqa.selenium.WebDriver;

import java.io.IOException;
import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.dnastack.ddap.common.AbstractBaseE2eTest.*;
import static java.lang.String.format;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;

@Slf4j
@AllArgsConstructor
public class WalletLoginStrategy implements LoginStrategy {

    private static final Pattern STATE_PATTERN = Pattern.compile("\\s*var\\s+state\\s*=\\s*\'([^\']+)\'");
    private static final Pattern PATH_PATTERN = Pattern.compile("\\s*var\\s+path\\s*=\\s*\'([^\']+)\'");
    private static final String[] DEFAULT_SCOPES = new String[] {"openid",  "ga4gh_passport_v1", "account_admin", "identities", "offline_access"};

    private Map<String, LoginInfo> personalAccessTokens;
    private String walletUrl;
    private String icUrl;

    @Override
    public CookieStore performPersonaLogin(String personaName, String realmName, String... scopes) throws IOException {
        final LoginInfo loginInfo = personalAccessTokens.get(personaName);
        org.apache.http.cookie.Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        final CookieStore cookieStore = setupCookieStore(session);
        final HttpClient httpclient = setupHttpClient(cookieStore);

        {
            final String scopeString = (scopes.length == 0) ? "" : "&scope=" + String.join("+", scopes);
            HttpGet request = new HttpGet(format("%s/api/v1alpha/realm/%s/identity/login?loginHint=wallet:%s%s",
                DDAP_BASE_URL, realmName, loginInfo.getEmail(), scopeString)
            );
            log.info("Sending login request: {}", request);

            final HttpClientContext context = new HttpClientContext();
            final HttpResponse response = httpclient.execute(request, context);
            String responseBody = EntityUtils.toString(response.getEntity());
            context.getRedirectLocations()
                   .forEach(uri -> log.info("Redirect uri {}", uri.toString()));
            assertThat("Response body: " + responseBody, response.getStatusLine().getStatusCode(), is(200));
        }

        walletLogin(httpclient, loginInfo);

        return cookieStore;
    }

    @Override
    public <T extends AnyDdapPage> T performPersonaLogin(WebDriver driver, TestingPersona persona, String realmName, Function<WebDriver, T> pageFactory) throws IOException {
        final CookieStore cookieStore = performPersonaLogin(persona.getId(), realmName, DEFAULT_SCOPES);

        // Need to navigate to site before setting cookie
        driver.get(URI.create(DDAP_BASE_URL).resolve(format("/%s", realmName)).toString());
        {
            // Need to add session cookie separately
            org.apache.http.cookie.Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
            WebDriverCookieHelper.addBrowserCookie(driver, session);
        }
        addCookiesFromStoreToSelenium(cookieStore, driver);
        // Visit again with session cookie
        driver.get(URI.create(DDAP_BASE_URL).resolve(format("/%s", realmName)).toString());

        return pageFactory.apply(driver);
    }

    private URI walletLogin(HttpClient httpClient, LoginInfo loginInfo) throws IOException {
        final HttpGet request = new HttpGet(format("%s/login/token?token=%s", walletUrl, loginInfo.getPersonalAccessToken()));

        final HttpClientContext context = new HttpClientContext();
        final HttpResponse response = httpClient.execute(request, context);
        String responseBody = EntityUtils.toString(response.getEntity());
        final List<URI> redirectLocations = context.getRedirectLocations();
        final String responseMessage = format("Redirects:\n%s\n\nHeaders: %s\nResponse body: %s",
                                              redirectLocations
                                                     .stream()
                                                     .map(uri -> "\t" + uri)
                                                     .collect(Collectors.joining("\n")),
                                              Arrays.toString(response.getAllHeaders()),
                                              responseBody);
        assertThat(responseMessage, response.getStatusLine().getStatusCode(), is(200));

        return redirectLocations.get(redirectLocations.size()-1);
    }

    private URI acceptPermissions(HttpClient httpClient, CsrfToken csrfToken) throws IOException {
        final HttpGet request = new HttpGet(format("%s%s?state=%s&agree=y", icUrl, csrfToken.getPath(), csrfToken.getState()));

        HttpClientContext context = HttpClientContext.create();
        final HttpResponse response = httpClient.execute(request, context);

        URI finalLocation = null;
        List<URI> locations = context.getRedirectLocations();
        if (locations != null) {
            finalLocation = locations.get(locations.size() - 1);
            log.info("Final location after permission acknowledgment: {}", finalLocation);
        }

        String responseBody = EntityUtils.toString(response.getEntity());
        final String responseMessage = "Headers: " + Arrays.toString(response.getAllHeaders()) + "\nResponse body: " + responseBody;

        if (response.getStatusLine().getStatusCode() != 200) {
            if (responseMessage.contains("policy requirements failed")) {
                throw new PolicyRequirementFailedException(responseMessage);
            }
            throw new IllegalStateException(responseMessage);
        }

        return finalLocation;
    }

    private CookieStore setupCookieStore(org.apache.http.cookie.Cookie sessionCookie) {
        final CookieStore cookieStore = new BasicCookieStore();
        cookieStore.addCookie(sessionCookie);
        return cookieStore;
    }

    private HttpClient setupHttpClient(CookieStore cookieStore) {
        return HttpClientBuilder.create()
                                .setDefaultCookieStore(cookieStore)
                                .setDefaultRequestConfig(RequestConfig.custom()
                                                                      .setCookieSpec(CookieSpecs.STANDARD)
                                                                      .build())
                                .build();
    }

    private void addCookiesFromStoreToSelenium(CookieStore cookieStore, WebDriver driver) {
        cookieStore.getCookies()
            .forEach(cookie -> {
                System.out.printf("Adding cookie to selenium: Cookie(name=%s, domain=%s, path=%s, expiry=%s, secure=%b" + System.lineSeparator(), cookie.getName(), cookie.getDomain(), cookie.getPath(), cookie.getExpiryDate(), cookie.isSecure());
                WebDriverCookieHelper.addBrowserCookie(driver, cookie);
            });
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class CsrfToken {
        private String path;
        private String state;
    }

    @Value
    static class LoginInfo {
        String email;
        String personalAccessToken;
    }
}
