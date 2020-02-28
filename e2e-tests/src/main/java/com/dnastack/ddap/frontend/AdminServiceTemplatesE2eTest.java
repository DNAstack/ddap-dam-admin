package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminManagePage;
import com.dnastack.ddap.common.util.DdapBy;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.damServiceDefinitionLink;

@SuppressWarnings("Duplicates")
public class AdminServiceTemplatesE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void addServiceTemplate(){
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damServiceDefinitionLink());

        String serviceTemplateLabel = "Beacon Discovery Search CUSTOM-1";
        adminListPage.assertListItemDoNotExist(serviceTemplateLabel);
        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("id-field"), "discovery_test_1");
        adminManagePage.fillField(DdapBy.se("inp-label"), serviceTemplateLabel);
        adminManagePage.fillField(DdapBy.se("inp-description"), "Copy of Beacon Discovery");
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-target-adapter"),
                "Gatekeeper Token");
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-item-format"), "Proxy URL");

        // Add interface
        adminManagePage.enterButton(DdapBy.se("btn-add-interface"));
        adminManagePage.clearField(DdapBy.se("inp-interface-UNDEFINED_INTERFACE_1-name"));
        adminManagePage.fillField(DdapBy.se("inp-interface-UNDEFINED_INTERFACE_1-name"), "http:beacon");
        adminManagePage.enterButton(DdapBy.se("inp-interface-UNDEFINED_INTERFACE_1-insert-variable"));
        adminManagePage.clickCheckbox(DdapBy.se("var-url"));
        adminManagePage.enterButton(DdapBy.se("select-variable-btn"));

        // Add role
        adminManagePage.enterButton(DdapBy.se("btn-add-role"));
        adminManagePage.clearField(DdapBy.se("inp-role-UNDEFINED_ROLE_1-name"));
        adminManagePage.fillField(DdapBy.se("inp-role-UNDEFINED_ROLE_1-name"), "basic_discovery");
        adminManagePage.fillField(DdapBy.se("inp-role-UNDEFINED_ROLE_1-label"), "Discovery Beacon Search without Metadata");
        adminManagePage.fillField(DdapBy.se("inp-role-UNDEFINED_ROLE_1-description"), "Query genome data and return 'found' or 'not found' status");
        adminManagePage.fillTagField(DdapBy.se("inp-role-UNDEFINED_ROLE_1-scope"), "registered");
        adminManagePage.fillTagField(DdapBy.se("inp-role-UNDEFINED_ROLE_1-dam-category"), "exists");

        // Add role
        adminManagePage.enterButton(DdapBy.se("btn-add-role"));
        adminManagePage.clearField(DdapBy.se("inp-role-UNDEFINED_ROLE_2-name"));
        adminManagePage.fillField(DdapBy.se("inp-role-UNDEFINED_ROLE_2-name"), "discovery");
        adminManagePage.fillField(DdapBy.se("inp-role-UNDEFINED_ROLE_2-label"), "Discovery Beacon Search with Metadata");
        adminManagePage.fillField(DdapBy.se("inp-role-UNDEFINED_ROLE_2-description"), "Query genome data and receive metadata results");
        adminManagePage.fillTagField(DdapBy.se("inp-role-UNDEFINED_ROLE_2-scope"), "registered");
        adminManagePage.fillTagField(DdapBy.se("inp-role-UNDEFINED_ROLE_2-scope"), "controlled");
        adminManagePage.fillTagField(DdapBy.se("inp-role-UNDEFINED_ROLE_2-dam-category"), "metadata");

        adminListPage = adminManagePage.saveEntity();
        adminListPage.assertListItemExists(serviceTemplateLabel);
    }

    @Test
    public void editServiceTemplate() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damServiceDefinitionLink());

        adminListPage.assertListItemExists("Edit Me");
        adminListPage.assertListItemDoNotExist("Cooler Service Definition");

        AdminManagePage adminManagePage = adminListPage.clickView("Edit Me");

        adminManagePage.clearField(DdapBy.se("inp-label"));
        adminManagePage.fillField(DdapBy.se("inp-label"), "Cooler Service Definition");

        adminListPage = adminManagePage.updateEntity();

        adminListPage.assertListItemDoNotExist("Edit Me");
        adminListPage.assertListItemExists("Cooler Service Definition");
    }

    @Test
    public void deleteServiceTemplate() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damServiceDefinitionLink());

        adminListPage.assertListItemExists("Delete Me");

        AdminManagePage adminManagePage = adminListPage.clickView("Delete Me");

        adminListPage = adminManagePage.deleteEntity();

        adminListPage.assertListItemDoNotExist("Delete Me");
    }

}
