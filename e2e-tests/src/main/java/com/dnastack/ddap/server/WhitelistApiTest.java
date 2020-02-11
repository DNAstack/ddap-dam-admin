package com.dnastack.ddap.server;

import com.dnastack.ddap.common.AbstractBaseE2eTest;
import com.dnastack.ddap.common.TestingPersona;
import com.dnastack.ddap.common.util.DdapLoginUtil;
import dam.v1.DamService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.http.cookie.Cookie;
import org.junit.BeforeClass;
import org.junit.Test;

import java.io.IOException;
import java.util.List;

import static com.dnastack.ddap.common.util.WebDriverCookieHelper.SESSION_COOKIE_NAME;
import static io.restassured.http.ContentType.JSON;
import static java.lang.String.format;
import static java.util.Arrays.asList;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.Matchers.hasSize;


public class WhitelistApiTest extends AbstractBaseE2eTest {

    private static final String REALM = generateRealmName(WhitelistApiTest.class.getSimpleName());

    @BeforeClass
    public static void oneTimeSetup() throws IOException {
        final String damConfig = loadTemplate("/com/dnastack/ddap/adminConfig.json");
        validateProtoBuf(damConfig, DamService.DamConfig.newBuilder());
        setupRealmConfig(TestingPersona.ADMINISTRATOR, damConfig, REALM);
    }

    @Test
    public void shouldListAllWhitelists() throws IOException {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);

        // @formatter:off
        getRequestSpecification()
            .log().method()
            .log().uri()
            .when()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
            .get(format("/api/v1alpha/realm/%s/whitelists", REALM))
            .then()
            .log().ifValidationFails()
            .contentType(JSON)
            .statusCode(200)
            .body(".", hasSize(2))
            .body("name[0]", equalTo("whitelist-1"))
            .body("users[0]", hasSize(3))
            .body("name[1]", equalTo("whitelist-2"))
            .body("users[1]", hasSize(5));
        // @formatter:on
    }

    @Test
    public void shouldGetSingleWhitelist() throws IOException {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String whitelistId = "whitelist-1";

        // @formatter:off
        getRequestSpecification()
            .log().method()
            .log().uri()
            .when()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
            .get(format("/api/v1alpha/realm/%s/whitelists/%s", REALM, whitelistId))
            .then()
            .log().ifValidationFails()
            .contentType(JSON)
            .statusCode(200)
            .body("name", equalTo("whitelist-1"))
            .body("users", hasSize(3));
        // @formatter:on
    }

    @Test
    public void shouldGetNotFoundForNonExistingWhitelist() throws IOException {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        String whitelistId = "whitelist-lala-123456";

        // @formatter:off
        getRequestSpecification()
            .log().method()
            .log().uri()
            .when()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
            .get(format("/api/v1alpha/realm/%s/whitelists/%s", REALM, whitelistId))
            .then()
            .log().ifValidationFails()
            .statusCode(404);
        // @formatter:on
    }

    @Test
    public void shouldAddAndDeleteSingleWhitelist() throws IOException {
        Cookie session = DdapLoginUtil.loginToDdap(DDAP_USERNAME, DDAP_PASSWORD);
        UserWhitelist whitelist = new UserWhitelist("whitelist-3", asList(new User("test@test.com")));

        // @formatter:off
        getRequestSpecification()
            .log().method()
            .log().uri()
            .log().everything()
            .when()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
            .accept(JSON)
            .contentType("application/json")
            .body(whitelist)
            .post(format("/api/v1alpha/realm/%s/whitelists", REALM))
            .then()
            .log().ifValidationFails()
            .contentType(JSON)
            .statusCode(201)
            .body("name", equalTo(whitelist.getName()))
            .body("users", hasSize(1));
        // @formatter:on

        // @formatter:off
        getRequestSpecification()
            .log().method()
            .log().uri()
            .when()
            .cookie(SESSION_COOKIE_NAME, session.getValue())
            .delete(format("/api/v1alpha/realm/%s/whitelists/%s", REALM, whitelist.getName()))
            .then()
            .log().ifValidationFails()
            .statusCode(204);
        // @formatter:on
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserWhitelist {
        private String name;
        private List<User> users;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class User {
        private String email;
    }

}
