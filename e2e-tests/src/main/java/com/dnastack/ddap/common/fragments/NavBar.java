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

    public static NavLink damPanelAdvancedSelectorLink() {
        return new NavLink(null, By.xpath(format("//*[@data-se = 'nav-group-advanced']")), null);
    }

    public static NavLink damPanelIdentitySelectorLink() {
        return new NavLink(null, By.xpath(format("//*[@data-se='nav-group-identity']")), null);
    }

    public static NavLink damOptionsLink() {
        return new NavLink("Options", DdapBy.se("nav-advanced-options"), damPanelAdvancedSelectorLink());
    }

    public static NavLink damResourceLink() {
        return new NavLink("Resource", DdapBy.se("nav-advanced-resources"), damPanelAdvancedSelectorLink());
    }

    public static NavLink damTestPersonaLink() {
        return new NavLink("Test Personas", DdapBy.se("nav-advanced-test-personas"), damPanelAdvancedSelectorLink());
    }

    public static NavLink damClientLink() {
        return new NavLink("Client Applications", DdapBy.se("nav-advanced-client-applications"), damPanelAdvancedSelectorLink());
    }

    public static NavLink damTrustedSourcesLink() {
        return new NavLink("Trusted Sources", DdapBy.se("nav-advanced-trusted-sources"), damPanelAdvancedSelectorLink());
    }

    public static NavLink damClaimDefinitionLink() {
        return new NavLink("Claim Definitions", DdapBy.se("nav-advanced-claim-definitions"), damPanelAdvancedSelectorLink());
    }

    public static NavLink damServiceDefinitionLink() {
        return new NavLink("Service Definitions", DdapBy.se("nav-advanced-service-definitions"), damPanelAdvancedSelectorLink());
    }

    public static NavLink damPoliciesLink() {
        return new NavLink("Access Policies", DdapBy.se("nav-advanced-access-policies"), damPanelAdvancedSelectorLink());
    }

    public static NavLink damPassportsLink() {
        return new NavLink("Passport Issuers", DdapBy.se("nav-advanced-passport-issuers"), damPanelAdvancedSelectorLink());
    }

    public static NavLink tokensLink() {
        return new NavLink("Sessions", DdapBy.se("nav-identity-tokens"), damPanelIdentitySelectorLink());
    }

    public static NavLink auditlogsLink() {
        return new NavLink("Auditlogs", DdapBy.se("nav-identity-auditlogs"), damPanelIdentitySelectorLink());
    }

    public static NavLink consentsLink() {
        return new NavLink("Consents", DdapBy.se("nav-identity-consents"), damPanelIdentitySelectorLink());
    }

    public static NavLink simplifiedAdminPanelToggle() {
        return new NavLink(null, By.xpath(format("//*[@data-se = 'nav-simplified-toggle']")), null);
    }

    public static NavLink advancedAdminPanelToggle() {
        return new NavLink(null, By.xpath(format("//*[@data-se = 'nav-advanced-toggle']")), null);
    }

    public static NavLink simplifiedAdminQuickstartLink() {
        return new NavLink("Quickstart", DdapBy.se("nav-simplified-admin-quickstart"), null);
    }

    public static NavLink userAdministrationPanelSelectorLink() {
        return new NavLink("User Administration", DdapBy.se("nav-group-user-admin"), null);
    }

    public static NavLink usersLink() {
        return new NavLink("Users", DdapBy.se("nav-admin-users"), userAdministrationPanelSelectorLink());
    }

    public NavBar(WebDriver driver) {
        this.driver = driver;
    }

    public void assertAdminNavBar() {
        Stream.of(damPanelAdvancedSelectorLink().getSelector())
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

    public <T> T goToSimplifiedAdmin(NavLink navItem, Function<WebDriver, T> pageFactory) {
        try {
            new WebDriverWait(driver, 1)
                .until(ExpectedConditions.visibilityOfElementLocated(navItem.selector));
        } catch (TimeoutException te) {
            toggleSimplifiedAdminPanel();
        }
        return goTo(navItem, pageFactory);
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

    public void toggleSimplifiedAdminPanel() {
        if (existsInNavBar(simplifiedAdminPanelToggle())) {
            driver.findElement(simplifiedAdminPanelToggle().selector).click();
        }
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
