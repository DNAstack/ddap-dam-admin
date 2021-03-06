package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminManagePage;
import com.dnastack.ddap.common.util.DdapBy;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import static com.dnastack.ddap.common.fragments.NavBar.damPoliciesLink;
import static com.dnastack.ddap.common.fragments.NavBar.damResourceLink;
import static java.lang.String.format;
import static org.hamcrest.Matchers.containsString;
import static org.junit.Assert.assertThat;

@SuppressWarnings("Duplicates")
public class AdminResourceE2eTest extends AbstractAdminFrontendE2eTest {

    private void waitForAccessTablesToLoad() {
        new WebDriverWait(driver, 15)
                .until(ExpectedConditions.numberOfElementsToBeMoreThan(By.tagName("mat-table"), 1));
    }

    @Test
    public void addResourceWithNoViews() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                                              .goToAdmin(damResourceLink());
        String resourceId = getInternalName("r");

        waitForAccessTablesToLoad();
        adminListPage.assertListItemDoNotExist(resourceId);

        AdminManagePage adminManagePage = adminListPage.clickManage();
        adminManagePage.fillField(DdapBy.se("inp-label"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-description"), "This is description");

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists(resourceId);
    }

    @Test
    public void addResourceAndSingleView() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                                              .goToAdmin(damResourceLink());
        String resourceId = getInternalName("r");
        String viewId = getInternalName("v");
        String role = "discovery";

        waitForAccessTablesToLoad();
        adminListPage.assertListItemDoNotExist(resourceId);

        AdminManagePage adminManagePage = adminListPage.clickManage();
        adminManagePage.fillField(DdapBy.se("inp-label"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-description"), "This is description");

        adminManagePage.enterButton(DdapBy.se("btn-add-view"));
        adminManagePage.fillField(DdapBy.se("inp-view-label"), viewId);
        adminManagePage.fillField(DdapBy.se("inp-view-description"), "View Description");
        adminManagePage.fillField(DdapBy.se("inp-view-version"), "Phase 3");

        adminManagePage.switchToTab("tab-service-definition");
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-view-service-template"), "Beacon Discovery Search");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-aud"), "http://beacon-aud.com");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-url"), "http://beacon-test.com");
        adminManagePage.enterButton(DdapBy.se(format("btn-add-%s-policy", role)));
        adminManagePage.fillField(DdapBy.se(format("inp-%s-policy", role)), "test_whitelist");
        adminManagePage.enterButton(DdapBy.se("btn-make-default-role-" + role));

        adminManagePage.clickCheckbox(By.id(viewId + "/" + role + "/test_user_with_access"));
        adminManagePage.waitForInflightRequests();

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists(resourceId);
    }

    @Test
    public void addResourceAndMultipleViews() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                                              .goToAdmin(damResourceLink());
        String resourceId = getInternalName("r");
        String view1Id = getInternalName("v-1");
        String view1Role = "viewer";
        String view2Id = getInternalName("v-2");
        String view2Role = "discovery";

        waitForAccessTablesToLoad();
        adminListPage.assertListItemDoNotExist(resourceId);

        AdminManagePage adminManagePage = adminListPage.clickManage();
        adminManagePage.fillField(DdapBy.se("inp-label"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-description"), "This is description");

        adminManagePage.enterButton(DdapBy.se("btn-add-view"));
        adminManagePage.fillField(DdapBy.se("inp-view-label"), view1Id);
        adminManagePage.fillField(DdapBy.se("inp-view-description"), "View 1 Description");
        adminManagePage.fillField(DdapBy.se("inp-view-version"), "Phase 3");

        adminManagePage.switchToTab("tab-service-definition");
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-view-service-template"), "Google BigQuery");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-project"), "ga4gh-apis");
        adminManagePage.enterButton(DdapBy.se(format("btn-add-%s-policy", view1Role)));
        adminManagePage.fillField(DdapBy.se(format("inp-%s-policy", view1Role)), "test_whitelist");
        adminManagePage.enterButton(DdapBy.se("btn-make-default-role-" + view1Role));

        adminManagePage.clickButton(DdapBy.se("btn-add-view"));
        adminManagePage.fillField(DdapBy.se("inp-view-label"), view2Id);
        adminManagePage.fillField(DdapBy.se("inp-view-description"), "View 2 Description");
        adminManagePage.fillField(DdapBy.se("inp-view-version"), "Version 2");

        adminManagePage.switchToTab("tab-service-definition");
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-view-service-template"), "Beacon Discovery Search");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-aud"), "http://beacon-aud.com");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-url"), "http://beacon-test.com");
        adminManagePage.enterButton(DdapBy.se(format("btn-add-%s-policy", view2Role)));
        adminManagePage.fillField(DdapBy.se(format("inp-%s-policy", view2Role)), "test_whitelist");
        adminManagePage.enterButton(DdapBy.se("btn-make-default-role-" + view2Role));

        adminManagePage.waitForInflightRequests();
        adminManagePage.clickCheckbox(By.id(view1Id + "/" + view1Role + "/test_user_with_access"));
        adminManagePage.waitForInflightRequests();
        adminManagePage.clickCheckbox(By.id(view2Id + "/" + view2Role + "/test_user_with_access"));
        adminManagePage.waitForInflightRequests();

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists(resourceId);
    }

    @Test
    public void addResourceSingleViewPolicyVariables() {
        String policyInternalName = "policy-with-vars";
        addPolicyWithVariables(policyInternalName);
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damResourceLink());
        String resourceId = getInternalName("r");
        String viewId = getInternalName("v");
        String role = "discovery";

        waitForAccessTablesToLoad();
        adminListPage.assertListItemDoNotExist(resourceId);

        AdminManagePage adminManagePage = adminListPage.clickManage();
        adminManagePage.fillField(DdapBy.se("inp-label"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-description"), "This is description");

        adminManagePage.enterButton(DdapBy.se("btn-add-view"));
        adminManagePage.fillField(DdapBy.se("inp-view-label"), viewId);
        adminManagePage.fillField(DdapBy.se("inp-view-description"), "View Description");
        adminManagePage.fillField(DdapBy.se("inp-view-version"), "Phase 3");

        adminManagePage.switchToTab("tab-service-definition");
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-view-service-template"), "Beacon Discovery Search");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-aud"), "http://beacon-aud.com");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-url"), "http://beacon-test.com");
        adminManagePage.enterButton(DdapBy.se(format("btn-add-%s-policy", role)));
        adminManagePage.fillFieldFromDropdown(DdapBy.se(format("inp-%s-policy", role)), policyInternalName);
        adminManagePage.fillField(DdapBy.se(format("inp-%s-policy-%s-variable-%s", role, policyInternalName, "TEST_VARIABLE_DATASET")), "beacon");
        adminManagePage.enterButton(DdapBy.se("btn-make-default-role-" + role));
        adminListPage = adminManagePage.saveEntity();
        adminListPage.assertListItemExists(resourceId);
    }

    private void addPolicyWithVariables(String policyInternalName) {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damPoliciesLink());

        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("inp-label"), policyInternalName);
        adminManagePage.fillField(DdapBy.se("inp-description"), "policy-with-variables-description");
        adminManagePage.fillField(DdapBy.se("inp-infoUrl"), "http://info-url.com");

        adminManagePage.clickButton(DdapBy.se("btn-add-variable"));
        adminManagePage.clearField(DdapBy.se("inp-variable-UNDEFINED_VARIABLE_1-name"));
        adminManagePage.fillField(DdapBy.se("inp-variable-UNDEFINED_VARIABLE_1-name"), "TEST_VARIABLE_DATASET");
        adminManagePage.fillField(DdapBy.se("inp-variable-UNDEFINED_VARIABLE_1-description"), "description");
        adminManagePage.fillField(DdapBy.se("inp-variable-UNDEFINED_VARIABLE_1-regexp"), "\\w+");

        adminManagePage.clickButton(DdapBy.se("btn-add-condition"));
        adminManagePage.toggleExpansionPanel("condition-0");
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-condition-0-type"), "AffiliationAndRole");
        adminManagePage.waitForInflightRequests();
        adminManagePage.fillTagField(DdapBy.se("inp-condition-0-value-value"), "${TEST_VARIABLE_DATASET}");

        adminListPage = adminManagePage.saveEntity();
        adminManagePage.waitForInflightRequests();

        adminListPage.assertListItemExists(policyInternalName);
    }

    @Test
    public void createInvalidResourceShowsServerSideError() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                                              .goToAdmin(damResourceLink());
        String resourceId = getInternalName("r");
        String viewId = getInternalName("v");
        String role = "discovery";

        waitForAccessTablesToLoad();
        adminListPage.assertListItemDoNotExist(resourceId);

        AdminManagePage adminManagePage = adminListPage.clickManage();
        adminManagePage.fillField(DdapBy.se("inp-label"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-description"), "This is description");

        adminManagePage.enterButton(DdapBy.se("btn-add-view"));
        adminManagePage.fillField(DdapBy.se("inp-view-label"), viewId);
        adminManagePage.fillField(DdapBy.se("inp-view-description"), "View Description");
        adminManagePage.fillField(DdapBy.se("inp-view-version"), "Phase 3");

        adminManagePage.switchToTab("tab-service-definition");
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-view-service-template"), "Beacon Discovery Search");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-aud"), "http://beacon-aud.com");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-url"), "http://beacon-test.com");
        // This is the invalid part
        adminManagePage.enterButton(DdapBy.se(format("btn-add-%s-policy", role)));
        adminManagePage.fillField(DdapBy.se(format("inp-%s-policy", role)), "NONEXISTENT_POLICY");
        adminManagePage.enterButton(DdapBy.se("btn-make-default-role-" + role));

        adminManagePage.clickSave();
        adminListPage.waitForInflightRequests();
        final WebElement errorField = new WebDriverWait(driver, 5)
                .until(ExpectedConditions.visibilityOfElementLocated(DdapBy.se("resources-role-policy-error")));
        assertThat(errorField.getText(), containsString("NONEXISTENT_POLICY"));
        assertThat(errorField.getText(), containsString("is not defined"));
    }

    @Test
    public void editInvalidResourceShowsServerSideError() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                                              .goToAdmin(damResourceLink());
        String resourceToEdit = "1000 Genomes";
        String newDefaultRole = "basic_discovery";

        waitForAccessTablesToLoad();
        adminListPage.assertListItemExists(resourceToEdit);

        AdminManagePage adminManagePage = adminListPage.clickView(resourceToEdit);
        WebElement view = adminManagePage.toggleExpansionPanel("view-discovery-access");

        // Invalid part
        adminManagePage.switchToTab(view, "tab-service-definition");
        adminManagePage.enterButton(DdapBy.se(format("btn-add-%s-policy", newDefaultRole)));
        adminManagePage.fillField(DdapBy.se(format("inp-%s-policy", newDefaultRole)), "NONEXISTENT_POLICY");
        adminManagePage.enterButton(DdapBy.se("btn-make-default-role-" + newDefaultRole));

        adminManagePage.clickUpdate();
        adminManagePage.waitForInflightRequests();
        final WebElement errorField = new WebDriverWait(driver, 5)
                .until(ExpectedConditions.visibilityOfElementLocated(DdapBy.se("resources-role-policy-error")));
        assertThat(errorField.getText(), containsString("NONEXISTENT_POLICY"));
        assertThat(errorField.getText(), containsString("is not defined"));
    }

    @Test
    public void editInvalidPersonaAccessShowsValidationMessage() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                                              .goToAdmin(damResourceLink());
        String resourceToEdit = "1000 Genomes";

        waitForAccessTablesToLoad();
        adminListPage.assertListItemExists(resourceToEdit);

        AdminManagePage adminManagePage = adminListPage.clickView(resourceToEdit);
        WebElement userWithAccessCheckbox = adminManagePage.findCheckedCheckbox("discovery-access/discovery/test_user_with_access");

        userWithAccessCheckbox.click();
        // If we don't wait, submitting the form will happen before validation can occur.
        new WebDriverWait(driver, 10)
            .until(d -> userWithAccessCheckbox.getAttribute("class").contains("ng-invalid"));
        adminManagePage.clickUpdate();
        adminManagePage.assertError(containsString("Please fix invalid fields"));
    }

    @Test
    public void editResourceEditViewMakeNewDefaultRole() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                                              .goToAdmin(damResourceLink());
        String resourceToEdit = "1000 Genomes";
        String newDefaultRole = "basic_discovery";

        waitForAccessTablesToLoad();
        adminListPage.assertListItemExists(resourceToEdit);

        AdminManagePage adminManagePage = adminListPage.clickView(resourceToEdit);
        WebElement view = adminManagePage.toggleExpansionPanel("view-discovery-access");

        adminManagePage.findCheckedCheckbox("discovery-access/discovery/test_user_with_access");

        adminManagePage.switchToTab(view, "tab-service-definition");
        adminManagePage.enterButton(DdapBy.se(format("btn-add-%s-policy", newDefaultRole)));
        adminManagePage.fillField(DdapBy.se(format("inp-%s-policy", newDefaultRole)), "test_whitelist");
        adminManagePage.enterButton(DdapBy.se("btn-make-default-role-" + newDefaultRole));

        adminManagePage.waitForInflightRequests();
        adminManagePage.clickCheckbox(By.id("discovery-access/" + newDefaultRole + "/test_user_with_access"));
        adminManagePage.waitForInflightRequests();
        adminManagePage.findCheckedCheckbox("discovery-access/discovery/test_user_with_access");
        adminManagePage.findCheckedCheckbox("bigquery-access/viewer/test_user_with_access");

        adminListPage = adminManagePage.updateEntity();

        adminListPage.assertListItemExists(resourceToEdit);
    }

    @Test
    public void editResourceRemoveView() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                                              .goToAdmin(damResourceLink());
        String resourceToEdit = "Edit Me";

        waitForAccessTablesToLoad();
        adminListPage.assertListItemExists(resourceToEdit);

        AdminManagePage adminManagePage = adminListPage.clickView(resourceToEdit);
        adminManagePage.toggleExpansionPanel("view-gcs-file-access");

        adminManagePage.findCheckedCheckbox("discovery-access/discovery/test_user_with_access");
        adminManagePage.findCheckedCheckbox("gcs-file-access/viewer/test_user_with_access");

        adminManagePage.enterButton(DdapBy.se("btn-remove-view-gcs-file-access"));

        adminManagePage.waitForInflightRequests();
        adminManagePage.findCheckedCheckbox("discovery-access/discovery/test_user_with_access");

        adminListPage = adminManagePage.updateEntity();

        adminListPage.assertListItemExists(resourceToEdit);
    }

    @Test
    public void deleteResource() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                                              .goToAdmin(damResourceLink());
        String resourceToDelete = "Delete Me";

        waitForAccessTablesToLoad();
        adminListPage.assertListItemExists(resourceToDelete);

        AdminManagePage adminManagePage = adminListPage.clickView(resourceToDelete);

        adminListPage = adminManagePage.deleteEntity();

        adminListPage.assertListItemDoNotExist(resourceToDelete);
    }
}
