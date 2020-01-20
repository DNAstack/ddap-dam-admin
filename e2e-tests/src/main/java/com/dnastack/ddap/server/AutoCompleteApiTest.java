package com.dnastack.ddap.server;

import com.dnastack.ddap.common.AbstractBaseE2eTest;
import com.dnastack.ddap.common.TestingPersona;
import com.dnastack.ddap.common.util.DdapLoginUtil;
import dam.v1.DamService;
import org.apache.http.cookie.Cookie;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.IOException;

import static com.dnastack.ddap.common.util.WebDriverCookieHelper.SESSION_COOKIE_NAME;
import static io.restassured.http.ContentType.JSON;
import static org.hamcrest.CoreMatchers.equalTo;


public class AutoCompleteApiTest extends AbstractBaseE2eTest {

    private static final String REALM = generateRealmName(AutoCompleteApiTest.class.getSimpleName());

    @BeforeClass
    public static void oneTimeSetup() throws IOException {
        final String damConfig = loadTemplate("/com/dnastack/ddap/adminConfig.json");
        validateProtoBuf(damConfig, DamService.DamConfig.newBuilder());
        setupRealmConfig(TestingPersona.ADMINISTRATOR, damConfig, REALM);
    }

    @Test
    public void shouldFindSuggestionsForMatchingClaim() throws IOException {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String validPersonaToken = fetchRealPersonaDamToken(TestingPersona.ADMINISTRATOR, REALM);
        String refreshToken = fetchRealPersonaRefreshToken(TestingPersona.ADMINISTRATOR, REALM);

        /* Run the aggregate search query on the realm */
        // @formatter:off
        getRequestSpecification()
                    .log().method()
                    .log().uri()
                    .when()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                    .cookie("ic_identity", validPersonaToken)
                    .cookie("ic_refresh", refreshToken)
                    .get("/api/v1alpha/realm/" + REALM + "/dam/autocomplete/claim-value?claimName=com.dnastack.test.claim")
                    .then()
                    .log().ifValidationFails()
                    .contentType(JSON)
                    .statusCode(200)
                    .body("[0]", equalTo("^.$"))
                    .body("[1]", equalTo("foobar"))
                    .body("[2]", equalTo("foobar2"))
                    .body("[3]", equalTo("foobar3"))
                    .body("[4]", equalTo("foobar4"));
        // @formatter:on
    }

    @Test
    public void shouldFindSuggestionsForVariableValues() throws IOException {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String validPersonaToken = fetchRealPersonaDamToken(TestingPersona.ADMINISTRATOR, REALM);
        String refreshToken = fetchRealPersonaRefreshToken(TestingPersona.ADMINISTRATOR, REALM);

        /* Run the aggregate search query on the realm */
        // @formatter:off
        getRequestSpecification()
                    .log().method()
                    .log().uri()
                    .when()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                    .cookie("ic_identity", validPersonaToken)
                    .cookie("ic_refresh", refreshToken)
                    .get("/api/v1alpha/realm/" + REALM + "/dam/autocomplete/claim-value?claimName=ControlledAccessGrants")
                    .then()
                    .log().ifValidationFails()
                    .contentType(JSON)
                    .statusCode(200)
                    .body("[0]", equalTo("${DATASET}"));
        // @formatter:on
    }


}
