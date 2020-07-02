package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.TestingPersona;
import com.dnastack.ddap.common.page.AdminDdapPage;
import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AnyDdapPage;
import com.dnastack.ddap.common.util.DdapBy;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.IOException;

import static com.dnastack.ddap.common.TestingPersona.ADMINISTRATOR;
import static com.dnastack.ddap.common.TestingPersona.USER_WITHOUT_ACCESS;
import static com.dnastack.ddap.common.fragments.NavBar.damResourceLink;
import static java.lang.String.format;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertEquals;

@SuppressWarnings("Duplicates")
public class NavbarE2eTest extends AbstractFrontendE2eTest {

    private static final String REALM = generateRealmName(NavbarE2eTest.class.getSimpleName());

    @BeforeClass
    public static void oneTimeSetup() throws IOException {
        final String damConfig = loadTemplate("/com/dnastack/ddap/adminConfig.json");
        setupRealmConfig(TestingPersona.ADMINISTRATOR, damConfig, REALM);
    }

    @Test
    public void verifyAdminAccess() {
        ddapPage = doBrowserLogin(REALM, ADMINISTRATOR, AdminDdapPage::new);

        ddapPage.getNavBar()
                .assertAdminNavBar();

        ddapPage.getNavBar().logOut();
        ddapPage = doBrowserLogin(REALM, USER_WITHOUT_ACCESS, AdminDdapPage::new);

        assertThat(ddapPage.getNavBar().existsInNavBar(damResourceLink()), is(false));
    }

    @Test
    public void logoutShouldGoToIcLoginForCurrentRealmAndRemoveCookies() {
        ddapPage = doBrowserLogin(REALM, ADMINISTRATOR, AdminDdapPage::new);

        // check if cookies are present on landing page
        assertThat(driver.manage().getCookieNamed("dam_identity"), notNullValue());
        assertThat(driver.manage().getCookieNamed("dam_access"), notNullValue());
        assertThat(driver.manage().getCookieNamed("dam_refresh"), notNullValue());

        AnyDdapPage landingPage = ddapPage.getNavBar().logOut();
        ddapPage.waitForInflightRequests();

        // check if cookies are not present on landing page without logging in
        assertThat(driver.manage().getCookieNamed("dam_identity"), nullValue());
        assertThat(driver.manage().getCookieNamed("dam_access"), nullValue());
        assertThat(driver.manage().getCookieNamed("dam_refresh"), nullValue());
    }

    @Test
    public void testProfileName() {
        ddapPage = doBrowserLogin(REALM, ADMINISTRATOR, AdminDdapPage::new);

        // check profile name
        final String displayedName = ddapPage.getNavBar().getLoggedInUsername();
        assertThat(displayedName, not(isEmptyOrNullString()));

        /*
        We can't assert that the name is "Administrator" because if the tests are run with the WalletLoginStrategy,
        we want anyone's admin account to work. This is a low-quality check that the string here is probably a name.
         */
        final String firstLetter = displayedName.trim().substring(0, 1);
        assertEquals(format("Expected name [%s] to start with capital. Might not be a name?", displayedName), firstLetter.toUpperCase(), firstLetter);
    }

    @Test
    public void testDescriptionLink() {
        ddapPage = doBrowserLogin(REALM, ADMINISTRATOR, AdminDdapPage::new);

        AdminListPage adminListPage = ddapPage.getNavBar()
            .goToAdmin(damResourceLink());
        adminListPage.clickDescriptionLink();
        new WebDriverWait(driver, 3)
            .until(ExpectedConditions.textToBe(DdapBy.se("page-title"), "Access Policies"));
    }

}
