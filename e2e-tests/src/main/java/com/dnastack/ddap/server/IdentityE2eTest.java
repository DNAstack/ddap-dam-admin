package com.dnastack.ddap.server;

import com.dnastack.ddap.common.AbstractBaseE2eTest;
import com.dnastack.ddap.common.TestingPersona;
import com.dnastack.ddap.common.util.DdapLoginUtil;
import dam.v1.DamService;
import org.apache.http.cookie.Cookie;
import org.json.JSONObject;
import org.junit.Assume;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.IOException;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import static com.dnastack.ddap.common.util.WebDriverCookieHelper.SESSION_COOKIE_NAME;
import static java.lang.String.format;
import static org.hamcrest.Matchers.*;

@SuppressWarnings("Duplicates")
public class IdentityE2eTest extends AbstractBaseE2eTest {

    private static final String REALM = generateRealmName(IdentityE2eTest.class.getSimpleName());

    @BeforeClass
    public static void oneTimeSetup() throws IOException {
        final String damConfig = loadTemplate("/com/dnastack/ddap/adminConfig.json");
        validateProtoBuf(damConfig, DamService.DamConfig.newBuilder());
        setupRealmConfig(TestingPersona.ADMINISTRATOR, damConfig, REALM);
    }

    private String ddap(String path) {
        return format("/api/v1alpha/realm/%s%s", REALM, path);
    }

    @Test
    public void testScopes() throws Exception {
        // FIXME: questionable if necessary at all. Currently userinfo returns only: `sub` and `sid`
        Assume.assumeTrue(ZonedDateTime.now().isAfter(ZonedDateTime.of(
            2020, 2, 29, 12, 0, 0,0,
            ZoneId.of("America/Toronto"))
        ));
        String requestedScope = "link";
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String damToken = fetchRealPersonaDamToken(TestingPersona.USER_WITH_ACCESS, REALM);
        String refreshToken = fetchRealPersonaRefreshToken(TestingPersona.USER_WITH_ACCESS, REALM);

        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("dam_access", damToken)
                .cookie("dam_refresh", refreshToken)
                .redirects().follow(false)
                .when()
                .get(ddap("/identity"))
                .then()
                .log().body()
                .log().ifValidationFails()
                .statusCode(200)
                .assertThat()
                .body("scopes", not(empty()))
                .body("scopes", not(contains("link")));
        // @formatter:on

        damToken = fetchRealPersonaDamToken(TestingPersona.USER_WITH_ACCESS, REALM, "openid", requestedScope);

        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("dam_access", damToken)
                .cookie("dam_refresh", refreshToken)
                .redirects().follow(false)
                .when()
                .get(ddap("/identity"))
                .then()
                .log().body()
                .log().ifValidationFails()
                .statusCode(200)
                .assertThat()
                .body("scopes", not(empty()))
                .body("scopes", hasItem(requestedScope));
        // @formatter:on
    }

    @Test
    public void testAccount() throws Exception {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String danToken = fetchRealPersonaDamToken(TestingPersona.USER_WITH_ACCESS, REALM);
        String refreshToken = fetchRealPersonaRefreshToken(TestingPersona.USER_WITH_ACCESS, REALM);

        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("dam_access", danToken)
                .cookie("dam_refresh", refreshToken)
                .redirects().follow(false)
                .when()
                .get(ddap("/identity"))
                .then()
                .log().body()
                .log().ifValidationFails()
                .statusCode(200)
                .assertThat()
                .body("scopes", not(empty()))
                .body("accesses", not(empty()))
                .body("account", not(empty()));
                // We can't assert much here right now because hydra change has broken account info for DAM UI
        // @formatter:on
    }

    @Test
    public void testDamUserAccessAsAdmin() throws Exception {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String icToken = fetchRealPersonaIcToken(TestingPersona.ADMINISTRATOR, REALM, "");
        String danToken = fetchRealPersonaDamToken(TestingPersona.ADMINISTRATOR, REALM);
        String refreshToken = fetchRealPersonaRefreshToken(TestingPersona.ADMINISTRATOR, REALM);

        JSONObject expectedDamAccess = new JSONObject();
        expectedDamAccess.put("accessible", true);
        expectedDamAccess.put("ui", new JSONObject()
            .put("label", "Test Genome Repository A")
            .put("description", "Test Genome Repository A"));

        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("ic_access", icToken)
                .cookie("dam_access", danToken)
                .cookie("dam_refresh", refreshToken)
                .redirects().follow(false)
                .when()
                .get(ddap("/dam/info"))
                .then()
                .log().body()
                .log().ifValidationFails()
                .statusCode(200)
                .assertThat()
                .body(".", equalTo(expectedDamAccess.toMap()));
        // @formatter:on
    }

    @Test
    public void testDamUserAccessAsNonAdmin() throws Exception {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String icToken = fetchRealPersonaIcToken(TestingPersona.USER_WITH_ACCESS, REALM, "");
        String danToken = fetchRealPersonaDamToken(TestingPersona.USER_WITH_ACCESS, REALM);
        String refreshToken = fetchRealPersonaRefreshToken(TestingPersona.USER_WITH_ACCESS, REALM);

        JSONObject expectedDamAccess = new JSONObject();
        expectedDamAccess.put("accessible", false);

        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().cookies()
                .log().uri()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("ic_access", icToken)
                .cookie("dam_access", danToken)
                .cookie("dam_refresh", refreshToken)
                .redirects().follow(false)
                .when()
                .get(ddap("/dam/info"))
                .then()
                .log().body()
                .log().ifValidationFails()
                .statusCode(200)
                .assertThat()
                .body(".", equalTo(expectedDamAccess.toMap()));
        // @formatter:on
    }

}
