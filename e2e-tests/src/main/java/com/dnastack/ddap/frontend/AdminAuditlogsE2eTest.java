package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.util.DdapBy;
import org.junit.Ignore;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;

import static com.dnastack.ddap.common.fragments.NavBar.damAuditlogsLink;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;

@SuppressWarnings("Duplicates")
public class AdminAuditlogsE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void verifyAuditlogs() {
        AdminListPage adminListPage = ddapPage.getNavBar().goToAdmin(damAuditlogsLink());
        adminListPage.waitForInflightRequests();
        String pageSize = driver.findElement(DdapBy.se("page-size")).getText();
        WebElement auditlogsTable = driver.findElement(DdapBy.se("auditlog-result"));
        assertThat("Auditlogs size", auditlogsTable.findElements(By.tagName("tr")).size(),
                allOf(greaterThan(1), lessThanOrEqualTo(Integer.parseInt(pageSize) + 1)));

        WebElement auditlog = auditlogsTable.findElements(By.tagName("tr")).get(2);
        String auditlogId = auditlog.findElements(By.tagName("td")).get(0).getText();
        auditlog.click();
        adminListPage.waitForInflightRequests();

        assertThat("Auditlogs detail page", driver.findElement(DdapBy.se("name")).getText(),
                containsString(auditlogId));
    }

    @Test
    public void filterAuditlogs() {
        AdminListPage adminListPage = ddapPage.getNavBar().goToAdmin(damAuditlogsLink());
        adminListPage.waitForInflightRequests();
        String pageSize = driver.findElement(DdapBy.se("page-size")).getText();
        WebElement auditlogsTable = driver.findElement(DdapBy.se("auditlog-result"));
        assertThat("Auditlogs size", auditlogsTable.findElements(By.tagName("tr")).size(),
                allOf(greaterThan(1), lessThanOrEqualTo(Integer.parseInt(pageSize) + 1)));

        fillFieldFromDropdown(DdapBy.se("log-type"), "REQUEST");
        adminListPage.waitForInflightRequests();
        String logType = driver.findElements(DdapBy.se("log-type-cell")).get(0).getText();
        assertThat("Filtered log type is REQUEST", logType, equalToIgnoringCase("REQUEST"));
    }

    public void fillFieldFromDropdown(By fieldSelector, String fieldValue) {
        WebElement field = driver.findElement(fieldSelector);

        new WebDriverWait(driver, 5)
                .until(ExpectedConditions.elementToBeClickable(field));
        // This dismisses any previous auto-complete suggestions in other fields.
        field.sendKeys(Keys.ENTER);

        List<WebElement> options = driver.findElements(By.tagName("mat-option"));

        if (fieldValue != null) {
            WebElement option =
                    new WebDriverWait(driver, 5)
                            .until(ExpectedConditions.visibilityOfElementLocated(By.xpath(
                                    "//mat-option/span[contains(text(), '" + fieldValue + "')]")));

            option.click();
        } else {
            options.get(0).click();
        }
    }
}
