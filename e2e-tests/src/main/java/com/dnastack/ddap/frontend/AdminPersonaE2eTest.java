package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminManagePage;
import com.dnastack.ddap.common.util.DdapBy;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.damTestPersonaLink;
import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.Matchers.containsString;

@SuppressWarnings("Duplicates")
public class AdminPersonaE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void addPersona() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damTestPersonaLink());

        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("inp-label"), "test-persona-name");
        adminManagePage.fillFieldWithFirstValueFromDropdown(DdapBy.se("inp-iss"));
        adminManagePage.fillField(DdapBy.se("inp-email"), "test-subject@test-ddap.com");
        adminManagePage.fillField(DdapBy.se("inp-picture"), "https://pbs.twimg.com/profile_images/3443048571/ef5062acfce64a7aef1d75b4934fbee6_400x400.png");

        adminManagePage.clickButton(DdapBy.se("btn-add-passport"));
        adminManagePage.fillField(DdapBy.se("inp-passport-type"), "ControlledAccessGrants");
        adminManagePage.fillField(DdapBy.se("inp-passport-source"), "https://institute1.test");
        adminManagePage.closeAutocompletes();
        adminManagePage.fillFieldWithFirstValueFromDropdown(DdapBy.se("inp-passport-value"));
        adminManagePage.fillField(DdapBy.se("inp-passport-asserted"), "1d");
        adminManagePage.fillField(DdapBy.se("inp-passport-expired"), "30d");
        adminManagePage.closeAutocompletes();
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-passport-by"), "peer");

        adminManagePage.clickButton(DdapBy.se("btn-add-condition"));
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-condition-0-type"), "AffiliationAndRole");

        adminManagePage.clickButtonToggle(DdapBy.se("inp-condition-0-value-prefix-const"));
        adminManagePage.fillTagField(DdapBy.se("inp-condition-0-value-value"), "faculty@uni-heidelberg.de");

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists("test-persona-name");
    }

    @Test
    public void editPersona() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damTestPersonaLink());

        adminListPage.assertListItemExists("John Persona");
        adminListPage.assertListItemDoNotExist("Cooler John");

        AdminManagePage adminManagePage = adminListPage.clickView("John Persona");

        adminManagePage.clearField(DdapBy.se("inp-label"));
        adminManagePage.fillField(DdapBy.se("inp-label"), "Cooler John");
        adminManagePage.clearField(DdapBy.se("inp-iss"));
        adminManagePage.fillField(DdapBy.se("inp-iss"), "test-issuer");
        adminManagePage.clearField(DdapBy.se("inp-email"));
        adminManagePage.fillField(DdapBy.se("inp-email"), "test-subject@test-ddap.com");

        adminManagePage.clickButton(DdapBy.se("btn-add-passport"));
        adminManagePage.fillField(DdapBy.se("inp-passport-type"), "test-claimName");
        adminManagePage.fillField(DdapBy.se("inp-passport-source"), "https://institute1.test");
        adminManagePage.fillField(DdapBy.se("inp-passport-value"), "test-value");
        adminManagePage.fillField(DdapBy.se("inp-passport-asserted"), "1d");
        adminManagePage.fillField(DdapBy.se("inp-passport-expired"), "30d");
        adminManagePage.closeAutocompletes();
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-passport-by"), "so");

        adminListPage = adminManagePage.updateEntity();

        adminListPage.assertListItemDoNotExist("John Persona");
        adminListPage.assertListItemExists("Cooler John");
    }

    @Test
    public void deletePersona() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damTestPersonaLink());

        adminListPage.assertListItemExists("Undergrad Candice");

        AdminManagePage adminManagePage = adminListPage.clickView("Undergrad Candice");

        adminListPage = adminManagePage.deleteEntity();

        adminListPage.assertListItemDoNotExist("Undergrad Candice");
    }

    @Test
    public void verifyFormErrorsWithInvalidIdentifier() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damTestPersonaLink());

        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("inp-label"), "test-persona-name");
        adminManagePage.fillField(DdapBy.se("inp-id"), "123 invalid name");
        adminManagePage.fillField(DdapBy.se("inp-iss"), "test-issuer");
        adminManagePage.fillField(DdapBy.se("inp-email"), "test-subject@test-ddap.com");

        assertTrue(adminManagePage.hasErrors());
    }

    @Test
    public void verifyAutocompleteClaimValuesChangeOnClaimNameChange() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damTestPersonaLink());

        AdminManagePage adminManagePage = adminListPage.clickManage();
        adminManagePage.clickButton(DdapBy.se("btn-add-passport"));

        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-passport-type"), "ControlledAccessGrants");
        adminManagePage.waitForInflightRequests();
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-passport-value"), "${DATASET}");

        adminManagePage.clearField(DdapBy.se("inp-passport-type"));
        adminManagePage.clearField(DdapBy.se("inp-passport-value"));

        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-passport-type"), "ResearcherStatus");
        adminManagePage.waitForInflightRequests();
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-passport-value"), "https://www.nature.com/articles/s99999-999-9999-z");
    }

    @Test
    public void editInvalidPersonaAccessShowsValidationMessage() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                                              .goToAdmin(damTestPersonaLink());

        adminListPage.assertListItemExists("Dr. Joe (Elixir)");

        AdminManagePage adminManagePage = adminListPage.clickView("Dr. Joe (Elixir)");

        adminManagePage.clearField(DdapBy.se("inp-label"));

        adminManagePage.clickUpdate();
        adminManagePage.assertError(containsString("Please fix invalid fields"));
    }

}
