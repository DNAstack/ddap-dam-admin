package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.util.DdapBy;
import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminManagePage;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.damClientLink;

@SuppressWarnings("Duplicates")
public class AdminClientApplicationE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void addClientApplication() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damClientLink());

        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("inp-id"), "test-client-app");
        adminManagePage.fillField(DdapBy.se("inp-label"), "test-client-app-name");
        adminManagePage.fillField(DdapBy.se("inp-description"), "This is description");

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists("test-client-app-name");
    }

    @Test
    public void editClientApplication() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damClientLink());

        adminListPage.assertListItemExists("edit-me");
        adminListPage.assertListItemDoNotExist("dnstck edit-me");

        AdminManagePage adminManagePage = adminListPage.clickView("edit-me", "Edit");

        adminManagePage.clearField(DdapBy.se("inp-label"));
        adminManagePage.fillField(DdapBy.se("inp-label"), "dnstck edit-me");

        adminListPage = adminManagePage.updateEntity();

        adminListPage.assertListItemDoNotExist("edit-me");
        adminListPage.assertListItemExists("dnstck edit-me");
    }

    @Test
    public void deleteClientApplication() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damClientLink());

        adminListPage.assertListItemExists("delete-me");

        AdminManagePage adminManagePage = adminListPage.clickView("delete-me", "Edit");

        adminListPage = adminManagePage.deleteEntity();

        adminListPage.assertListItemDoNotExist("delete-me");
    }
}
