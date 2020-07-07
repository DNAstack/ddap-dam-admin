package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminDdapPage;
import com.dnastack.ddap.common.page.UserAdminListPage;
import com.dnastack.ddap.common.page.UserAdminManagePage;
import com.dnastack.ddap.common.util.DdapBy;
import lombok.extern.slf4j.Slf4j;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.Optional;

import static com.dnastack.ddap.common.TestingPersona.ADMINISTRATOR;
import static com.dnastack.ddap.common.fragments.NavBar.usersLink;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;

@Slf4j
@SuppressWarnings("Duplicates")
public class AdminUsersE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void updateAccountInformation() {
        ddapPage = doBrowserLogin(getRealm(), ADMINISTRATOR, AdminDdapPage::new);

        UserAdminListPage adminListPage = ddapPage.getNavBar()
            .goTo(usersLink(), UserAdminListPage::new);

        String user = optionalEnv("E2E_ADMIN_USER_NAME", "Monica Valluri");
        // There might be multiple users with same name (from previous test runs),
        // want to close the only active user which is the logged in user. Closing already inactive account
        // would not do anything.
        adminListPage.setActiveUsersOnly();
        Optional<WebElement> activeUser = adminListPage.getFirstUserByNameAndActivity(user, true);

        assertTrue("No active user present", activeUser.isPresent());

        UserAdminManagePage adminManagePage = adminListPage.editAccount(activeUser.get());
        // Don't change name, because it will affect future runs of test
        adminManagePage.replaceField(DdapBy.se("inp-displayName"), user);
        adminManagePage.replaceField(DdapBy.se("inp-locale"), "en_US");
        adminManagePage.replaceField(DdapBy.se("inp-timezone"), "Europe/Bratislava");
        adminManagePage.toggleExpansionPanel("email-0");
        try {
            // Try to make email primary. There won't be this button if email is already primary
            adminManagePage.clickButton(DdapBy.se("btn-make-primary-email-0"));
        } catch (NoSuchElementException nsee) {
            // If there is no button for making mail primary check if the email is primary
            driver.findElement(DdapBy.se("primary-email-0"));
        }
        adminListPage = adminManagePage.updateEntity();

        adminListPage.setActiveUsersOnly();
        assertTrue(adminListPage.getFirstUserByNameAndActivity(user, true).isPresent());
    }

    @Test
    public void viewUserAuditlogs() {
        ddapPage = doBrowserLogin(getRealm(), ADMINISTRATOR, AdminDdapPage::new);

        UserAdminListPage adminListPage = ddapPage.getNavBar()
                .goTo(usersLink(), UserAdminListPage::new);

        String user = optionalEnv("E2E_ADMIN_USER_NAME", "Monica Valluri");
        adminListPage.setActiveUsersOnly();

        Optional<WebElement> activeUser = adminListPage.getFirstUserByNameAndActivity(user, true);

        assertTrue("No active user present", activeUser.isPresent());

        String userId = activeUser.get().findElement(DdapBy.se("user-id")).getText();
        WebElement moreActionsButton = activeUser.get().findElement(DdapBy.se("btn-more-actions"));
        new WebDriverWait(driver, 5).until(d -> moreActionsButton.isDisplayed());
        moreActionsButton.click();

        WebElement auditlogsButton = driver.findElement(By.className("mat-menu-panel"))
                .findElement(DdapBy.se("btn-auditlog"));
        new WebDriverWait(driver, 5).until(d -> auditlogsButton.isDisplayed());
        auditlogsButton.click();
        adminListPage.waitForInflightRequests();
        driver.navigate().refresh();
        new WebDriverWait(driver, 20)
                .until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector(".mat-row"), 0));
        WebElement auditlogsTable = driver.findElement(DdapBy.se("auditlog-result"));
        WebElement auditlog = auditlogsTable.findElements(DdapBy.se("auditlog-id")).get(0);
        auditlog.click();
        adminListPage.waitForInflightRequests();
        assertThat("Auditlogs detail page", driver.findElement(DdapBy.se("name")).getText(),
                containsString(userId));
    }

}
