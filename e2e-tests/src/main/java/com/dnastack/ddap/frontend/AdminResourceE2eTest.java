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
        String resourceId = "resource-" + System.currentTimeMillis();

        waitForAccessTablesToLoad();
        adminListPage.assertListItemDoNotExist(resourceId);

        AdminManagePage adminManagePage = adminListPage.clickManage();
        adminManagePage.fillField(DdapBy.se("inp-id"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-label"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-description"), "This is description");
        adminManagePage.fillField(DdapBy.se("inp-owner"), "E2E test");
        adminManagePage.fillField(DdapBy.se("inp-max-ttl"), "7d");
        adminManagePage.fillField(DdapBy.se("inp-access"), "controlled");
        adminManagePage.fillField(DdapBy.se("inp-year"), "2019");
        adminManagePage.fillField(DdapBy.se("inp-size"), "120 GB");
        adminManagePage.fillField(DdapBy.se("inp-tags"), "test, e2e, resource");
        adminManagePage.fillField(DdapBy.se("inp-image-url"), "http://test-image-url.com");
        adminManagePage.fillField(DdapBy.se("inp-info-url"), "http://test-info-url.com");
        adminManagePage.fillField(DdapBy.se("inp-apply-url"), "http://test-apply-url.com");
        adminManagePage.fillField(DdapBy.se("inp-troubleshoot-url"), "http://test-troubleshoot-url.com");
        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists(resourceId);
    }

    @Test
    public void addResourceAndSingleView() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                                              .goToAdmin(damResourceLink());
        String resourceId = "resource-" + System.currentTimeMillis();
        String viewId = "view-" + System.currentTimeMillis();
        String role = "discovery";

        waitForAccessTablesToLoad();
        adminListPage.assertListItemDoNotExist(resourceId);

        AdminManagePage adminManagePage = adminListPage.clickManage();
        adminManagePage.fillField(DdapBy.se("inp-id"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-label"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-description"), "This is description");
        adminManagePage.fillField(DdapBy.se("inp-owner"), "E2E test");
        adminManagePage.fillField(DdapBy.se("inp-max-ttl"), "7d");

        adminManagePage.enterButton(DdapBy.se("btn-add-view"));
        adminManagePage.fillField(DdapBy.se("inp-view-id"), viewId);
        adminManagePage.fillField(DdapBy.se("inp-view-label"), viewId);
        adminManagePage.fillField(DdapBy.se("inp-view-description"), "View Description");
        adminManagePage.fillField(DdapBy.se("inp-view-version"), "Phase 3");
        adminManagePage.fillField(DdapBy.se("inp-view-aud"), "http://audience-test.com");
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-view-service-template"), "Beacon Discovery Search");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-aud"), "http://beacon-aud.com");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-url"), "http://beacon-test.com");
        adminManagePage.fillTagField(DdapBy.se("view-role-policies-" + role), "test_whitelist");
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
        String resourceId = "resource-" + System.currentTimeMillis();
        String view1Id = "view1-" + System.currentTimeMillis();
        String view1Role = "viewer";
        String view2Id = "view2-" + System.currentTimeMillis();
        String view2Role = "discovery";

        waitForAccessTablesToLoad();
        adminListPage.assertListItemDoNotExist(resourceId);

        AdminManagePage adminManagePage = adminListPage.clickManage();
        adminManagePage.fillField(DdapBy.se("inp-id"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-label"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-description"), "This is description");
        adminManagePage.fillField(DdapBy.se("inp-owner"), "E2E test");
        adminManagePage.fillField(DdapBy.se("inp-max-ttl"), "7d");

        adminManagePage.enterButton(DdapBy.se("btn-add-view"));
        adminManagePage.fillField(DdapBy.se("inp-view-id"), view1Id);
        adminManagePage.fillField(DdapBy.se("inp-view-label"), view1Id);
        adminManagePage.fillField(DdapBy.se("inp-view-description"), "View 1 Description");
        adminManagePage.fillField(DdapBy.se("inp-view-version"), "Phase 3");
        adminManagePage.fillField(DdapBy.se("inp-view-aud"), "http://audience-test.com");
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-view-service-template"), "Google Cloud Storage");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-bucket"), "ga4gh-apis-controlled-access");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-project"), "ga4gh-apis");
        adminManagePage.fillTagField(DdapBy.se("view-role-policies-" + view1Role), "test_whitelist");
        adminManagePage.enterButton(DdapBy.se("btn-make-default-role-" + view1Role));

        adminManagePage.clickButton(DdapBy.se("btn-add-view"));
        adminManagePage.fillField(DdapBy.se("inp-view-id"), view2Id);
        adminManagePage.fillField(DdapBy.se("inp-view-label"), view2Id);
        adminManagePage.fillField(DdapBy.se("inp-view-description"), "View 2 Description");
        adminManagePage.fillField(DdapBy.se("inp-view-version"), "Version 2");
        adminManagePage.fillField(DdapBy.se("inp-view-aud"), "http://audience-test.com");
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-view-service-template"), "Beacon Discovery Search");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-aud"), "http://beacon-aud.com");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-url"), "http://beacon-test.com");
        adminManagePage.fillTagField(DdapBy.se("view-role-policies-" + view2Role), "test_whitelist");
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
        addPolicyWithVariables();
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damResourceLink());
        String resourceId = "resource-" + System.currentTimeMillis();
        String viewId = "view-" + System.currentTimeMillis();
        String role = "discovery";

        waitForAccessTablesToLoad();
        adminListPage.assertListItemDoNotExist(resourceId);

        AdminManagePage adminManagePage = adminListPage.clickManage();
        adminManagePage.fillField(DdapBy.se("inp-id"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-label"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-description"), "This is description");
        adminManagePage.fillField(DdapBy.se("inp-owner"), "E2E test");
        adminManagePage.fillField(DdapBy.se("inp-max-ttl"), "7d");

        adminManagePage.enterButton(DdapBy.se("btn-add-view"));
        adminManagePage.fillField(DdapBy.se("inp-view-id"), viewId);
        adminManagePage.fillField(DdapBy.se("inp-view-label"), viewId);
        adminManagePage.fillField(DdapBy.se("inp-view-description"), "View Description");
        adminManagePage.fillField(DdapBy.se("inp-view-version"), "Phase 3");
        adminManagePage.fillField(DdapBy.se("inp-view-aud"), "http://audience-test.com");
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-view-service-template"), "Beacon Discovery Search");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-aud"), "http://beacon-aud.com");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-url"), "http://beacon-test.com");
        adminManagePage.fillTagField(DdapBy.se("view-role-policies-" + role), "policy-with-variables");
        adminManagePage.fillField(DdapBy.se("var-TEST_VARIABLE_DATASET"), "beacon");
        adminManagePage.clickButton(DdapBy.se("btn-save-variable-data"));
        adminManagePage.enterButton(DdapBy.se("btn-make-default-role-" + role));
        adminListPage = adminManagePage.saveEntity();
        adminListPage.assertListItemExists(resourceId);
    }

    private void addPolicyWithVariables() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damPoliciesLink());

        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("inp-id"), "policy-with-variables");
        adminManagePage.fillField(DdapBy.se("inp-label"), "policy-with-variables-name");
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
        adminManagePage.clickButtonToggle(DdapBy.se("inp-condition-0-value-prefix-const"));
        adminManagePage.fillTagField(DdapBy.se("inp-condition-0-value-value"), "${TEST_VARIABLE_DATASET}");

        adminListPage = adminManagePage.saveEntity();
        adminManagePage.waitForInflightRequests();

        adminListPage.assertListItemExists("policy-with-variables");
    }

    @Test
    public void createInvalidResourceShowsServerSideError() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                                              .goToAdmin(damResourceLink());
        String resourceId = "resource-" + System.currentTimeMillis();
        String viewId = "view-" + System.currentTimeMillis();
        String role = "discovery";

        waitForAccessTablesToLoad();
        adminListPage.assertListItemDoNotExist(resourceId);

        AdminManagePage adminManagePage = adminListPage.clickManage();
        adminManagePage.fillField(DdapBy.se("inp-id"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-label"), resourceId);
        adminManagePage.fillField(DdapBy.se("inp-description"), "This is description");
        adminManagePage.fillField(DdapBy.se("inp-owner"), "E2E test");
        adminManagePage.fillField(DdapBy.se("inp-max-ttl"), "7d");

        adminManagePage.enterButton(DdapBy.se("btn-add-view"));
        adminManagePage.fillField(DdapBy.se("inp-view-id"), viewId);
        adminManagePage.fillField(DdapBy.se("inp-view-label"), viewId);
        adminManagePage.fillField(DdapBy.se("inp-view-description"), "View Description");
        adminManagePage.fillField(DdapBy.se("inp-view-version"), "Phase 3");
        adminManagePage.fillField(DdapBy.se("inp-view-aud"), "http://audience-test.com");
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-view-service-template"), "Beacon Discovery Search");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-aud"), "http://beacon-aud.com");
        adminManagePage.fillField(DdapBy.se("inp-view-target-adapter-variable-url"), "http://beacon-test.com");
        // This is the invalid part
        adminManagePage.fillTagField(DdapBy.se("view-role-policies-" + role), "NONEXISTENT_POLICY");
        adminManagePage.enterButton(DdapBy.se("btn-make-default-role-" + role));

        adminManagePage.clickSave();
        adminListPage.waitForInflightRequests();
        final WebElement errorField = new WebDriverWait(driver, 5)
                .until(ExpectedConditions.visibilityOfElementLocated(DdapBy.se("resources-policy-error")));
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
        adminManagePage.toggleExpansionPanel("view-discovery-access");

        // Invalid part
        adminManagePage.fillTagField(DdapBy.se("view-role-policies-" + newDefaultRole), "NONEXISTENT_POLICY");
        adminManagePage.enterButton(DdapBy.se("btn-make-default-role-" + newDefaultRole));

        adminManagePage.clickUpdate();
        adminManagePage.waitForInflightRequests();
        final WebElement errorField = new WebDriverWait(driver, 5)
                .until(ExpectedConditions.visibilityOfElementLocated(DdapBy.se("resources-policy-error")));
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
        new WebDriverWait(driver, 10).until(d -> userWithAccessCheckbox.getAttribute("class").contains("ng-invalid"));
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
        adminManagePage.toggleExpansionPanel("view-discovery-access");

        adminManagePage.findCheckedCheckbox("discovery-access/discovery/test_user_with_access");

        adminManagePage.fillTagField(DdapBy.se("view-role-policies-" + newDefaultRole), "test_whitelist");
        adminManagePage.enterButton(DdapBy.se("btn-make-default-role-" + newDefaultRole));

        adminManagePage.waitForInflightRequests();
        adminManagePage.clickCheckbox(By.id("discovery-access/" + newDefaultRole + "/test_user_with_access"));
        adminManagePage.waitForInflightRequests();
        adminManagePage.findCheckedCheckbox("discovery-access/discovery/test_user_with_access");
        adminManagePage.findCheckedCheckbox("gcs-file-access/viewer/test_user_with_access");

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
