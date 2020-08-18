package com.dnastack.ddap.common.fragments;

import com.dnastack.ddap.common.util.DdapBy;
import com.dnastack.ddap.common.page.*;
import lombok.Value;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.*;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Stream;

import static java.lang.String.format;

@Slf4j
public class NavBar {

    private WebDriver driver;

    @Value
    public static class NavLink {
        private String title;
        private By selector;
        private NavLink parentSelector;

        public Optional<NavLink> getParentSelector() {
            return Optional.ofNullable(parentSelector);
        }
        public Optional<String> getTitle() {
            return Optional.ofNullable(title);
        }
    }

    public static NavLink simplifiedAdminQuickstartLink() {
        return new NavLink("Add Data Quickstart", DdapBy.se("nav-simplified-admin-quickstart"), null);
    }

    public static NavLink myProfilePanelSelectorLink() {
        return new NavLink("My Profile & Activity", DdapBy.se("nav-group-identity"), null);
    }

    public static NavLink tokensLink() {
        return new NavLink("Sessions", DdapBy.se("nav-identity-tokens"), myProfilePanelSelectorLink());
    }

    public static NavLink auditlogsLink() {
        return new NavLink("Audit Logs", DdapBy.se("nav-identity-auditlogs"), myProfilePanelSelectorLink());
    }

    public static NavLink consentsLink() {
        return new NavLink("Remembered Consents", DdapBy.se("nav-identity-consents"), myProfilePanelSelectorLink());
    }

    public static NavLink userAdministrationPanelSelectorLink() {
        return new NavLink("Users and Groups", DdapBy.se("nav-group-user-admin"), null);
    }

    public static NavLink usersLink() {
        return new NavLink("Users", DdapBy.se("nav-admin-users"), userAdministrationPanelSelectorLink());
    }

    public static NavLink groupsLink() {
        return new NavLink("Groups", DdapBy.se("nav-admin-groups"), userAdministrationPanelSelectorLink());
    }

    public static NavLink resourceSettingsPanelSelectorLink() {
        return new NavLink("Resource Settings", DdapBy.se("nav-group-resource-settings"), null);
    }

    public static NavLink damResourceLink() {
        return new NavLink("Data Resources", DdapBy.se("nav-resource-settings-data"), resourceSettingsPanelSelectorLink());
    }

    public static NavLink damPoliciesLink() {
        return new NavLink("Data Access Policies", DdapBy.se("nav-resource-settings-policies"), resourceSettingsPanelSelectorLink());
    }

    public static NavLink damTestPersonaLink() {
        return new NavLink("Test Personas", DdapBy.se("nav-resource-settings-personas"), resourceSettingsPanelSelectorLink());
    }

    public static NavLink trustConfigPanelSelectorLink() {
        return new NavLink("Trust Config", DdapBy.se("nav-group-trust-config"), null);
    }

    public static NavLink damClientLink() {
        return new NavLink("Client Applications", DdapBy.se("nav-trust-config-clients"), trustConfigPanelSelectorLink());
    }

    public static NavLink damTrustedSourcesLink() {
        return new NavLink("Visa Sources", DdapBy.se("nav-trust-config-sources"), trustConfigPanelSelectorLink());
    }

    public static NavLink damPassportsLink() {
        return new NavLink("Passport & Visa Issuers", DdapBy.se("nav-trust-config-issuers"), trustConfigPanelSelectorLink());
    }

    public static NavLink advancedSettingsPanelSelectorLink() {
        return new NavLink("Advanced Settings", DdapBy.se("nav-group-advanced"), null);
    }

    public static NavLink damOptionsLink() {
        return new NavLink("Options", DdapBy.se("nav-advanced-options"), advancedSettingsPanelSelectorLink());
    }

    public static NavLink damVisaTypesLink() {
        return new NavLink("Visa Types", DdapBy.se("nav-advanced-visa-types"), advancedSettingsPanelSelectorLink());
    }

    public static NavLink damServiceDefinitionLink() {
        return new NavLink("Service Definitions", DdapBy.se("nav-advanced-service-definitions"), advancedSettingsPanelSelectorLink());
    }

    public NavBar(WebDriver driver) {
        this.driver = driver;
    }

    public void assertAdminNavBar() {
        Stream.of(advancedSettingsPanelSelectorLink().getSelector())
            .forEach(this.driver::findElement);
    }

    public boolean existsInNavBar(NavLink item) {
        return driver.findElements(item.getSelector()).size() > 0;
    }

    public NavBar goTo(NavLink navItem) {
        return goTo(navItem, NavBar::new);
    }

    public <T> T goTo(NavLink navItem, Function<WebDriver, T> pageFactory) {
        final WebElement clickableNavLink = navItem.getParentSelector()
                                                   .map(parent -> getChildLink(navItem, parent))
                                                   .orElseGet(() -> driver.findElement(navItem.getSelector()));
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

    public void setRealmAndCancel(String targetRealm) {
        new WebDriverWait(driver, 5)
                .until(ExpectedConditions.elementToBeClickable(driver.findElement(DdapBy.se("realm-menu"))));
        driver.findElement(DdapBy.se("realm-menu")).click();
        new WebDriverWait(driver, 5)
                .until(ExpectedConditions.elementToBeClickable(driver.findElement(DdapBy.se("edit-realm"))));
        driver.findElement(DdapBy.se("edit-realm")).click();
        WebElement realmInput = getRealmInput();
        realmInput.clear();
        realmInput.sendKeys(targetRealm);
        driver.findElement(DdapBy.se("cancel-realm-change")).click();
    }

    public String getRealm() {
        return driver.findElement(DdapBy.se("realm-name")).getText();
    }

    public AnyDdapPage logOut() {
        new WebDriverWait(driver, 5)
                .until(ExpectedConditions.elementToBeClickable(DdapBy.se("menu-profile-btn")));
        driver.findElement(DdapBy.se("menu-profile-btn")).click();
        new WebDriverWait(driver, 5)
                .until(ExpectedConditions.elementToBeClickable(DdapBy.se("nav-logout")));
        driver.findElement(DdapBy.se("nav-logout")).click();
        return new AnyDdapPage(driver);
    }

    public String getLoggedInUsername() {
        new WebDriverWait(driver, 5)
            .until(ExpectedConditions.elementToBeClickable(DdapBy.se("menu-profile-btn")))
        .click();
        WebElement menuContent = new WebDriverWait(driver, 5)
            .until(ExpectedConditions.elementToBeClickable(By.className("mat-menu-content")));
        return menuContent.findElement(By.className("account-info-label"))
            .getText();
    }

}
