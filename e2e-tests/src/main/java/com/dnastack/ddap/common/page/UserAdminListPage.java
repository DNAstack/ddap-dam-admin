package com.dnastack.ddap.common.page;

import com.dnastack.ddap.common.util.DdapBy;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;
import java.util.Optional;

@Slf4j
public class UserAdminListPage extends AnyDdapPage {

    public UserAdminListPage(WebDriver driver) {
        super(driver);
    }

    public void setActiveUsersOnly() {
        WebElement radioActiveOnly = driver.findElement(DdapBy.se("radio-active-users-only"));
        new WebDriverWait(driver, 2)
            .until(ExpectedConditions.elementToBeClickable(radioActiveOnly));
        radioActiveOnly.click();
        waitForInflightRequests();
    }

    public Optional<WebElement> getFirstUserByNameAndActivity(String title, boolean enabled) {
        new WebDriverWait(driver, 5)
            .until(ExpectedConditions.visibilityOfAllElementsLocatedBy(DdapBy.seAndText("entity-title", title)));
        List<WebElement> userRows = driver.findElements(By.tagName("tr"));
        return userRows.stream()
            .filter((element) -> {
                List<WebElement> cells = element.findElements(By.tagName("td"));
                return cells.stream()
                    .anyMatch((cell) -> cell.getText().equalsIgnoreCase(enabled ? "active" : "inactive"));
            })
            .findFirst();
    }

    public AnyDdapPage closeAccount(WebElement userRow) {
        WebElement moreActionsButton = userRow.findElement(DdapBy.se("btn-more-actions"));
        new WebDriverWait(driver, 5).until(d -> moreActionsButton.isDisplayed());
        moreActionsButton.click();

        WebElement closeAccountButton = driver.findElement(By.className("mat-menu-panel"))
            .findElement(DdapBy.se("btn-close-user-account"));
        new WebDriverWait(driver, 5).until(d -> closeAccountButton.isDisplayed());
        closeAccountButton.click();

        WebElement closeAccountDialogConfirmationButton = driver.findElement(DdapBy.se("accept-btn"));
        new WebDriverWait(driver, 5).until(d -> closeAccountDialogConfirmationButton.isDisplayed());
        closeAccountDialogConfirmationButton.click();

        this.waitForInflightRequests();
        return new AnyDdapPage(driver);
    }

    public UserAdminManagePage editAccount(WebElement userRow) {
        WebElement moreActionsButton = userRow.findElement(DdapBy.se("btn-more-actions"));
        new WebDriverWait(driver, 5).until(d -> moreActionsButton.isDisplayed());
        moreActionsButton.click();

        WebElement closeAccountButton = driver.findElement(By.className("mat-menu-panel"))
            .findElement(DdapBy.se("btn-edit"));
        new WebDriverWait(driver, 5).until(d -> closeAccountButton.isDisplayed());
        closeAccountButton.click();

        this.waitForInflightRequests();
        return new UserAdminManagePage(driver);
    }

}
