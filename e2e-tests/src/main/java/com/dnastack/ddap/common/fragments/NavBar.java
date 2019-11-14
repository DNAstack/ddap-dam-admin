package com.dnastack.ddap.common.fragments;

import com.dnastack.ddap.common.util.DdapBy;
import com.dnastack.ddap.common.page.*;
import lombok.Value;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Stream;

import static java.lang.String.format;

public class NavBar {

    private WebDriver driver;

    @Value
    public static class NavLink {
        private String title;
        private By selector;

        public Optional<String> getTitle() {
            return Optional.ofNullable(title);
        }
    }

    public static NavLink damOptionsLink() {
        return new NavLink("Options", DdapBy.se("nav-options"));
    }

    public static NavLink damResourceLink() {
        return new NavLink("Resource", DdapBy.se("nav-resources"));
    }

    public static NavLink damTestPersonaLink() {
        return new NavLink("Test Personas", DdapBy.se("nav-test-personas"));
    }

    public static NavLink damClientLink() {
        return new NavLink("Client Applications", DdapBy.se("nav-client-applications"));
    }

    public static NavLink damTrustedSourcesLink() {
        return new NavLink("Trusted Sources", DdapBy.se("nav-trusted-sources"));
    }

    public static NavLink damClaimDefinitionLink() {
        return new NavLink("Claim Definitions", DdapBy.se("nav-claim-definitions"));
    }

    public static NavLink damServiceDefinitionLink() {
        return new NavLink("Service Definitions", DdapBy.se("nav-service-definitions"));
    }

    public static NavLink damPoliciesLink() {
        return new NavLink("Access Policies", DdapBy.se("nav-access-policies"));
    }

    public static NavLink damPassportsLink() {
        return new NavLink("Passport Issuers", DdapBy.se("nav-passport-issuers"));
    }

    public NavBar(WebDriver driver) {
        this.driver = driver;
    }

    public void assertAdminNavBar() {
        // TODO: do we need to check this now as the modules are separated?
//        Stream.of(damPanelSelectorLink().getSelector())
//            .forEach(this.driver::findElement);
    }

    public boolean existsInNavBar(NavLink item) {
        return driver.findElements(item.getSelector()).size() > 0;
    }

    public NavBar goTo(NavLink navItem) {
        return goTo(navItem, NavBar::new);
    }

    public <T> T goTo(NavLink navItem, Function<WebDriver, T> pageFactory) {
        final WebElement clickableNavLink = driver.findElement(navItem.getSelector());
        clickableNavLink.click();

        return pageFactory.apply(driver);
    }

    private WebElement getChildLink(NavLink navItem, NavLink parent) {
        new WebDriverWait(driver, 5)
                .until(ExpectedConditions.elementToBeClickable(parent.getSelector()));
        final WebElement parentElement = driver.findElement(parent.getSelector());
        parentElement.click();
        new WebDriverWait(driver, 5)
                .until(ExpectedConditions.elementToBeClickable(parentElement.findElement(navItem.getSelector())));

        return parentElement.findElement(navItem.getSelector());
    }

    public AdminListPage goToAdmin(NavLink navItem) {
        return goTo(navItem, AdminListPage::new);
    }

    public AdminOptionPage goToAdminOptionPage(NavLink navItem) {
        return goTo(navItem, AdminOptionPage::new);
    }

    private WebElement getRealmInput() {
        return driver.findElement(DdapBy.se("realm-input"));
    }

    public ConfirmationRealmChangeDialog setRealm(String targetRealm) {
        WebElement realmInput = getRealmInput();

        realmInput.sendKeys(Keys.chord(Keys.CONTROL, "a"), Keys.BACK_SPACE);
        realmInput.sendKeys(targetRealm, Keys.RETURN);

        return new ConfirmationRealmChangeDialog(driver);
    }

    public String getRealm() {
        WebElement realmInput = getRealmInput();
        return realmInput.getAttribute("value");
    }

    public ICLoginPage logOut() {
        driver.findElement(DdapBy.se("nav-logout")).click();
        return new ICLoginPage(driver);
    }

}
