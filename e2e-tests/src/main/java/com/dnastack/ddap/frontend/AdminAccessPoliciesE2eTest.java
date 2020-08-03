package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminManagePage;
import com.dnastack.ddap.common.util.DdapBy;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.damPoliciesLink;

@SuppressWarnings("Duplicates")
public class AdminAccessPoliciesE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void addSimplePolicy() {
        AdminListPage adminListPage = ddapPage.getNavBar()
            .goToAdmin(damPoliciesLink());

        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("inp-label"), "test-simple-policy-name");
        adminManagePage.fillField(DdapBy.se("inp-description"), "test-policy-description");
        adminManagePage.fillField(DdapBy.se("inp-infoUrl"), "http://info-url.com");

        adminManagePage.clickButton(DdapBy.se("btn-add-condition"));
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-condition-0-type"), "AffiliationAndRole");
        adminManagePage.waitForInflightRequests();
        adminManagePage.fillTagField(DdapBy.se("inp-condition-0-value-value"), "faculty@uni-heidelberg.de");

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists("test-simple-policy");
    }

    @Test
    public void addComplexPolicy() {
        AdminListPage adminListPage = ddapPage.getNavBar()
            .goToAdmin(damPoliciesLink());

        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("inp-label"), "test-complex-policy-name");
        adminManagePage.fillField(DdapBy.se("inp-description"), "test-policy-description");
        adminManagePage.fillField(DdapBy.se("inp-infoUrl"), "http://info-url.com");

        adminManagePage.clickButton(DdapBy.se("btn-add-variable"));
        adminManagePage.clearField(DdapBy.se("inp-variable-UNDEFINED_VARIABLE_1-name"));
        adminManagePage.fillField(DdapBy.se("inp-variable-UNDEFINED_VARIABLE_1-name"), "TEST_VARIABLE_DATASET");
        adminManagePage.fillField(DdapBy.se("inp-variable-UNDEFINED_VARIABLE_1-description"), "description");
        adminManagePage.fillField(DdapBy.se("inp-variable-UNDEFINED_VARIABLE_1-regexp"), "^phs\\d{6}$");

        adminManagePage.clickButton(DdapBy.se("btn-add-condition"));
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-condition-0-type"), "AffiliationAndRole");
        adminManagePage.waitForInflightRequests();
        adminManagePage.fillTagField(DdapBy.se("inp-condition-0-value-value"), "faculty@uni-heidelberg.de");

        adminManagePage.clickButton(DdapBy.se("btn-add-clause-condition"));
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-condition-1-type"), "AffiliationAndRole");
        adminManagePage.waitForInflightRequests();
        adminManagePage.fillTagField(DdapBy.se("inp-condition-1-value-value"), "https://dac.nih.gov/datasets/${TEST_VARIABLE_DATASET}");

        adminManagePage.clickButton(DdapBy.se("btn-add-condition"));
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-condition-0-type"), "ResearcherStatus");
        adminManagePage.waitForInflightRequests();
        adminManagePage.fillTagField(DdapBy.se("inp-condition-0-source-value"), TRUSTED_SOURCE);

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists("test-complex-policy");
    }

    @Test
    public void editPolicy() {
        AdminListPage adminListPage = ddapPage.getNavBar()
            .goToAdmin(damPoliciesLink());

        adminListPage.assertListItemExists("Edit Me Policy");
        adminListPage.assertListItemDoNotExist("Cooler Policy");

        AdminManagePage adminManagePage = adminListPage.clickView("Edit Me Policy");

        adminManagePage.clearField(DdapBy.se("inp-label"));
        adminManagePage.fillField(DdapBy.se("inp-label"), "Cooler Policy");

        adminListPage = adminManagePage.updateEntity();

        adminListPage.assertListItemDoNotExist("Edit Me Policy");
        adminListPage.assertListItemExists("Cooler Policy");
    }

    @Test
    public void deletePolicy() {
        AdminListPage adminListPage = ddapPage.getNavBar()
            .goToAdmin(damPoliciesLink());
        String entityToBeDeleted = "Delete Me Policy";

        adminListPage.assertListItemExists(entityToBeDeleted);

        AdminManagePage adminManagePage = adminListPage.clickView(entityToBeDeleted);

        adminListPage = adminManagePage.deleteEntity();

        adminListPage.assertListItemDoNotExist(entityToBeDeleted);
    }

    @Test
    public void deleteFromListPolicy() {
        AdminListPage adminListPage = ddapPage.getNavBar()
            .goToAdmin(damPoliciesLink());
        String entityToBeDeleted = "Delete Me List Policy";

        adminListPage.assertListItemExists(entityToBeDeleted);

        adminListPage = adminListPage.clickDelete(entityToBeDeleted);

        adminListPage.assertListItemDoNotExist(entityToBeDeleted);
    }

}
