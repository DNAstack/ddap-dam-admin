package com.dnastack.ddap.common.page;

import com.dnastack.ddap.common.util.DdapBy;
import com.dnastack.ddap.common.util.WebPageScroller;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.Optional;

import static java.lang.String.format;
import static org.junit.Assert.assertTrue;

public class AdminListPage extends AdminDdapPage {

    public AdminListPage(WebDriver driver) {
        super(driver);
    }

    public AdminManagePage clickManage() {
        driver.findElement(DdapBy.se("btn-manage"))
                .click();
        return new AdminManagePage(driver);
    }

    public AdminManagePage clickView(String label) {
        driver.findElement(DdapBy.seAndText("entity-title", label))
            .click();
        return new AdminManagePage(driver);
    }

    public AdminListPage clickDelete(String label) {
        Optional<WebElement> tableRow = getTableRow(label);
        assertTrue(format("Entity '%s' with given label could not be found", label), tableRow.isPresent());
        WebElement moreActionsBtn = new WebDriverWait(driver, 5)
            .until(ExpectedConditions.elementToBeClickable(tableRow.get().findElement(DdapBy.se("btn-more-actions"))));
        moreActionsBtn.click();
        WebElement deleteBtn = new WebDriverWait(driver, 5)
            .until(ExpectedConditions.elementToBeClickable(DdapBy.se("btn-delete")));
        deleteBtn.click();

        WebElement confirmationDialog = new WebDriverWait(driver, 5)
            .until(ExpectedConditions.visibilityOfElementLocated(By.tagName("mat-dialog-container")));
        WebElement confirmBtn = new WebDriverWait(driver, 5)
            .until(ExpectedConditions.elementToBeClickable(confirmationDialog.findElement(DdapBy.se("accept-btn"))));
        confirmBtn.click();
        this.waitForInflightRequests();

        return new AdminListPage(driver);
    }

    private Optional<WebElement> getTableRow(String entityLabel) {
        new WebDriverWait(driver, 5)
            .until(ExpectedConditions.numberOfElementsToBeMoreThan(By.tagName("tr"), 1));
        return driver.findElements(By.tagName("tr"))
            .stream()
            .filter((row) -> {
                try {
                    row.findElement(DdapBy.seAndText("entity-title", entityLabel));
                } catch (NoSuchElementException nsee) {
                    return false;
                }
                return true;
            })
            .findFirst();
    }

    public AdminListPage clickDescriptionLink() {
        WebElement descriptionLink = driver.findElement(By.tagName("ddaplib-entity-description-link"));
        WebPageScroller.scrollTo(driver, descriptionLink);
        descriptionLink.click();
        return new AdminListPage(driver);
    }

    public void assertListItemExists(String title) {
        new WebDriverWait(driver, 2)
                .until(ExpectedConditions.visibilityOfAllElementsLocatedBy(DdapBy.seAndText("entity-title", title)));
    }

    public void assertListItemDoNotExist(String title) {
        new WebDriverWait(driver, 2)
                .until(ExpectedConditions.invisibilityOfElementLocated(DdapBy.seAndText("entity-title", title)));
    }

    public void assertTableNotEmpty() {
        new WebDriverWait(driver, 5)
            .until(ExpectedConditions.numberOfElementsToBeMoreThan(By.cssSelector(".mat-row"), 0));
    }

    public void assertElementVisible(String selector) {
        new WebDriverWait(driver, 2)
                .until(ExpectedConditions.visibilityOfElementLocated(DdapBy.se(selector)));
    }
}
