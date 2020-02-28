package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.util.DdapBy;
import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminManagePage;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.damClaimDefinitionLink;

@SuppressWarnings("Duplicates")
public class AdminClaimDefinitionsE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void addClaimDefinition() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damClaimDefinitionLink());

        AdminManagePage adminManagePage = adminListPage.clickManage();

        String claimDefId = "test-claim-def-full";
        adminManagePage.fillField(DdapBy.se("inp-id"), claimDefId);
        adminManagePage.fillField(DdapBy.se("inp-label"), claimDefId);
        adminManagePage.fillField(DdapBy.se("inp-description"), "This is description");
        adminManagePage.fillField(DdapBy.se("inp-infoUrl"), "http://this-is-info-url.com");

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists(claimDefId);
    }

    @Test
    public void editClaimDefinition() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damClaimDefinitionLink());

        adminListPage.assertListItemExists("Accepted Terms and Policies");
        adminListPage.assertListItemDoNotExist("Acc3pt3d T3rms and Policies Edited");

        AdminManagePage adminManagePage = adminListPage.clickView("Accepted Terms and Policies");

        adminManagePage.clearField(DdapBy.se("inp-label"));
        adminManagePage.fillField(DdapBy.se("inp-label"), "Acc3pt3d T3rms and Policies Edited");

        adminListPage = adminManagePage.updateEntity();

        adminListPage.assertListItemDoNotExist("Accepted Terms and Policies");
        adminListPage.assertListItemExists("Acc3pt3d T3rms and Policies Edited");
    }

    @Test
    public void deleteClaimDefinition() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damClaimDefinitionLink());

        adminListPage.assertListItemExists("Affiliation and Role");

        AdminManagePage adminManagePage = adminListPage.clickView("Affiliation and Role");

        adminListPage = adminManagePage.deleteEntity();

        adminListPage.assertListItemDoNotExist("Affiliation and Role");
    }
}
