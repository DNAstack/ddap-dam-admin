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
import static org.hamcrest.CoreMatchers.notNullValue;


public class VariableSuggestionApiTest extends AbstractBaseE2eTest {

    private static final String REALM = generateRealmName(VariableSuggestionApiTest.class.getSimpleName());

    @BeforeClass
    public static void oneTimeSetup() throws IOException {
        final String damConfig = loadTemplate("/com/dnastack/ddap/adminConfig.json");
        validateProtoBuf(damConfig, DamService.DamConfig.newBuilder());
        setupRealmConfig(TestingPersona.ADMINISTRATOR, damConfig, REALM);
    }

    @Test
    public void shouldFindBigQueryVariables() throws IOException {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String damToken = fetchRealPersonaDamToken(TestingPersona.ADMINISTRATOR, REALM);
        String refreshToken = fetchRealPersonaRefreshToken(TestingPersona.ADMINISTRATOR, REALM);

        /* Run the aggregate search query on the realm */
        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().uri()
                .when()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("dam_token", damToken)
                .cookie("refresh_token", refreshToken)
                .pathParam("realm", REALM)
                .get("/api/v1alpha/realm/{realm}/dam/service-templates/bigquery/variables")
                .then()
                .log().ifValidationFails()
                .contentType(JSON)
                .statusCode(200)
                .body("project", notNullValue())
                .body("project.regexp", notNullValue(String.class))
                .body("dataset", notNullValue())
                .body("dataset.regexp", notNullValue(String.class));
        // @formatter:on
    }

    @Test
    public void shouldFindGCSVariables() throws IOException {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String damToken = fetchRealPersonaDamToken(TestingPersona.ADMINISTRATOR, REALM);
        String refreshToken = fetchRealPersonaRefreshToken(TestingPersona.ADMINISTRATOR, REALM);

        /* Run the aggregate search query on the realm */
        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().uri()
                .when()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("dam_token", damToken)
                .cookie("refresh_token", refreshToken)
                .pathParam("realm", REALM)
                .get("/api/v1alpha/realm/{realm}/dam/service-templates/gcs/variables")
                .then()
                .log().ifValidationFails()
                .contentType(JSON)
                .statusCode(200)
                .body("project", notNullValue())
                .body("project.regexp", notNullValue(String.class))
                .body("bucket", notNullValue())
                .body("bucket.regexp", notNullValue(String.class));
        // @formatter:on
    }

    @Test
    public void shouldGetBadRequest() throws IOException {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String damToken = fetchRealPersonaDamToken(TestingPersona.ADMINISTRATOR, REALM);
        String refreshToken = fetchRealPersonaRefreshToken(TestingPersona.ADMINISTRATOR, REALM);

        /* Run the aggregate search query on the realm */
        // @formatter:off
        getRequestSpecification()
                .log().method()
                .log().uri()
                .when()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
                .cookie("dam_token", damToken)
                .cookie("refresh_token", refreshToken)
                .pathParam("realm", REALM)
                .get("/api/v1alpha/realm/{realm}/dam/service-templates/invalid/variables")
                .then()
                .log().ifValidationFails()
                .contentType(JSON)
                .statusCode(400);
        // @formatter:on
    }
}
