package com.dnastack.ddap.common.page;

import com.dnastack.ddap.common.util.DdapBy;
import org.apache.commons.lang3.StringUtils;
import org.hamcrest.Matcher;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.isEmptyOrNullString;

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

        String selectAll = Keys.chord(Keys.CONTROL, "a");
        input.sendKeys(selectAll);
        input.sendKeys(Keys.DELETE);
        input.sendKeys(optionValue);
        final WebElement updateButton = row.findElement(DdapBy.se("btn-save"));
        updateButton.click();

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

    private By getError(String optionName) {
        return By.xpath(format("//mat-expansion-panel[descendant::*[contains(text(), '%s')]]//*[@data-se='option-error']",
            optionName
        ));
    }

    public void assertNoError(String optionName, int timeoutInSeconds) {
        try {
            final String errorMsg = new WebDriverWait(driver, timeoutInSeconds).until(d -> {
                final List<WebElement> errorElements = d.findElements(getError(optionName));

                return errorElements.stream()
                    .filter(e -> e.isDisplayed() && !StringUtils.isEmpty(e.getText()))
                    .map(WebElement::getText)
                    .findFirst()
                    .orElse(null);
            });

            assertThat(String.format("Should not have error but this error observed: %s", errorMsg),
                errorMsg,
                isEmptyOrNullString());
        } catch (TimeoutException e) {
            // This means there was no error.
        }
    }

    public void assertError(String optionName, int timeoutInSeconds, Matcher<String> matcher) {
        try {
            final String errorMsg = new WebDriverWait(driver, timeoutInSeconds).until(d -> {
                final List<WebElement> errorElements = d.findElements(By.tagName("mat-error"));

                return errorElements.stream()
                    .filter(e -> e.isDisplayed() && !StringUtils.isEmpty(e.getText()))
                    .map(WebElement::getText)
                    .findFirst()
                    .orElse(null);
            });

            assertThat(String.format("Should not have error but this error observed: %s", errorMsg),
                errorMsg,
                matcher);
        } catch (TimeoutException e) {
            // This means there was no error.
            throw new AssertionError("Expected error but none observed.", e);
        }
    }
}
