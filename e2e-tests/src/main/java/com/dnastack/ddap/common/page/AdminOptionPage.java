package com.dnastack.ddap.common.page;

import com.dnastack.ddap.common.util.DdapBy;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;
import java.util.stream.Collectors;

public class AdminOptionPage extends AdminDdapPage {

    public AdminOptionPage(WebDriver driver) {
        super(driver);
    }

    public AdminOptionPage submitOption(String optionName, String optionId, String optionValue) {
        WebElement row = getOptionRow(optionName);

        WebElement moreActionsButton = row.findElement(DdapBy.se("btn-more-actions"));
        new WebDriverWait(driver, 5).until(d -> moreActionsButton.isDisplayed());
        moreActionsButton.click();

        WebElement editButton = driver.findElement(By.className("mat-menu-panel"))
            .findElement(DdapBy.se("btn-edit"));
        new WebDriverWait(driver, 5).until(d -> editButton.isDisplayed());
        editButton.click();

        final WebElement input = row.findElement(DdapBy.se("inp-" + optionId));
        new WebDriverWait(driver, 5).until(d -> input.isDisplayed());

        input.clear();
        String selectAll = Keys.chord(Keys.CONTROL, "a");
        input.sendKeys(selectAll);
        input.sendKeys(Keys.DELETE);
        input.sendKeys(optionValue);
        final WebElement updateButton = row.findElement(DdapBy.se("btn-done"));
        updateButton.click();
        waitForInflightRequests();

        return this;
    }

    public WebElement getOptionRow(String optionName) {
        return driver.findElements(By.tagName("tr"))
            .stream()
            .filter((row) -> row.getText().contains(optionName))
            .findFirst()
            .get();
    }

    public String getOptionValue(String optionName) {
        return getOptionRow(optionName).findElement(DdapBy.se("option-value")).getText();
    }

    public List<String> getOptionNames() {
        new WebDriverWait(driver, 5).until(d -> driver.findElement(DdapBy.se("entity-title")).isDisplayed());

        return driver.findElements(DdapBy.se("entity-title")).stream()
            .map(WebElement::getText)
            .collect(Collectors.toList());
    }

    public void assertNoError(int timeoutInSeconds) {
        new WebDriverWait(driver, timeoutInSeconds)
            .until(ExpectedConditions.invisibilityOfElementLocated(By.className("alert-danger")));
    }

    public void assertHasError(int timeoutInSeconds) {
        new WebDriverWait(driver, timeoutInSeconds)
            .until(ExpectedConditions.visibilityOfElementLocated(By.className("alert-danger")));
    }

}
