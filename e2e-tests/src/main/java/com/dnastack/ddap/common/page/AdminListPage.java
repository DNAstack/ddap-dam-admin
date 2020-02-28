package com.dnastack.ddap.common.page;

import com.dnastack.ddap.common.util.DdapBy;
import com.dnastack.ddap.common.util.WebPageScroller;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static java.lang.String.format;

public class AdminListPage extends AdminDdapPage {

    public AdminListPage(WebDriver driver) {
        super(driver);
    }

    public AdminManagePage clickManage() {
        driver.findElement(DdapBy.se("btn-manage"))
                .click();
        return new AdminManagePage(driver);
    }

    public AdminManagePage clickView(String resourceName) {
        driver.findElement(DdapBy.seAndText("entity-title", resourceName))
                .click();
        return new AdminManagePage(driver);
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

    private By getLine(String resourceName) {
        return By.xpath(format("//td[descendant::*[contains(text(), '%s') and @data-se='entity-title']]",
                resourceName
        ));
    }
}
