package com.dnastack.ddap.common.page;

import com.dnastack.ddap.common.util.DdapBy;
import com.dnastack.ddap.common.util.WebPageScroller;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

@Slf4j
public class UserAdminManagePage extends AnyDdapPage {

    public UserAdminManagePage(WebDriver driver) {
        super(driver);
    }

    public UserAdminListPage updateEntity() {
        clickUpdate();

        return new UserAdminListPage(driver);
    }

    public void clickUpdate() {
        this.clickButton(DdapBy.se("btn-update"));
    }

    public void clickButton(By selector) {
        WebElement button = driver.findElement(selector);
        new WebDriverWait(driver, 5).until(ExpectedConditions.elementToBeClickable(button));
        WebPageScroller.scrollTo(driver, button);
        button.click();
    }

    public void fillField(By fieldSelector, String fieldValue) {
        WebElement formInput = new WebDriverWait(driver, 10)
            .until(ExpectedConditions.elementToBeClickable(fieldSelector));
        formInput.sendKeys(fieldValue);
    }

    public void replaceField(By fieldSelector, String fieldValue) {
        WebElement formInput = new WebDriverWait(driver, 10)
                .until(ExpectedConditions.elementToBeClickable(fieldSelector));
        formInput.clear();
        formInput.sendKeys(fieldValue);
    }

    public void toggleExpansionPanel(String panelId) {
        WebElement panel = driver.findElement(DdapBy.se(panelId));
        new WebDriverWait(driver, 5).until(ExpectedConditions.elementToBeClickable(panel));
        WebPageScroller.scrollTo(driver, panel);
        panel.click();
    }

}
