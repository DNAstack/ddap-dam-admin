package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.util.DdapBy;
import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminManagePage;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.damTrustedSourcesLink;

@SuppressWarnings("Duplicates")
public class AdminTrustedSourcesE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void addTrustedSource() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damTrustedSourcesLink());

        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("inp-label"), "test-source-name");
        adminManagePage.fillField(DdapBy.se("inp-description"), "test-source-desc");

        adminManagePage.fillField(DdapBy.se("inp-sources"), "https://test-source.com");

        adminManagePage.fillField(DdapBy.se("inp-visaTypes"), "ResearcherStatus");

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists("test-source-name");
    }

    @Test
    public void editTrustedSource() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damTrustedSourcesLink());

        adminListPage.assertListItemExists("edit-me-source");
        adminListPage.assertListItemDoNotExist("edited-me-source");

        AdminManagePage adminManagePage = adminListPage.clickView("edit-me-source");

        adminManagePage.clearField(DdapBy.se("inp-label"));
        adminManagePage.fillField(DdapBy.se("inp-label"), "edited-me-source");

        adminListPage = adminManagePage.updateEntity();

        adminListPage.assertListItemDoNotExist("edit-me-source");
        adminListPage.assertListItemExists("edited-me-source");
    }

    @Test
    public void deleteTrustedSource() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damTrustedSourcesLink());

        adminListPage.assertListItemExists("delete_me");

        AdminManagePage adminManagePage = adminListPage.clickView("delete_me");

        adminListPage = adminManagePage.deleteEntity();

        adminListPage.assertListItemDoNotExist("delete_me");
    }
}
