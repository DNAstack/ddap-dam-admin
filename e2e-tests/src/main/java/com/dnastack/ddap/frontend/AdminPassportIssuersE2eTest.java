package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.util.DdapBy;
import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminManagePage;
import com.dnastack.ddap.common.fragments.ConfirmationRemovalDialog;
import org.junit.Ignore;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.damPassportsLink;

@SuppressWarnings("Duplicates")
public class AdminPassportIssuersE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void addPassportIssuer() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damPassportsLink());

        AdminManagePage adminManagePage = adminListPage.clickManage();

        adminManagePage.fillField(DdapBy.se("inp-label"), "full-passport-issuer");
        adminManagePage.fillField(DdapBy.se("inp-description"), "full-passport-issuer-desc");

        adminManagePage.fillField(DdapBy.se("inp-issuer"), "https://dbgap.nlm.nih.gov/aa");
        adminManagePage.fillFieldFromDropdown(DdapBy.se("inp-translateUsing"), "dbGaP Passport Translator");

        adminListPage = adminManagePage.saveEntity();

        adminListPage.assertListItemExists("full-passport-issuer");
    }

    @Test
    public void editPassportIssuer() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damPassportsLink());

        adminListPage.assertListItemExists("edit-me");
        adminListPage.assertListItemDoNotExist("full-passport-issu3r");

        AdminManagePage adminManagePage = adminListPage.clickView("edit-me");

        adminManagePage.clearField(DdapBy.se("inp-label"));
        adminManagePage.fillField(DdapBy.se("inp-label"), "full-passport-issu3r");

        adminListPage = adminManagePage.updateEntity();

        adminListPage.assertListItemDoNotExist("edit-me");
        adminListPage.assertListItemExists("full-passport-issu3r");
    }

    @Test
    public void deletePassportIssuer() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damPassportsLink());

        adminListPage.assertListItemExists("delete-me");

        AdminManagePage adminManagePage = adminListPage.clickView("delete-me");

        adminListPage = adminManagePage.deleteEntity();

        adminListPage.assertListItemDoNotExist("delete-me");
    }

    /*
     * TODO Figure out what made this trusted passport issuer require a confirmation before deleting.
     */
    @Test
    @Ignore
    public void forceDeletePassportIssuer() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goToAdmin(damPassportsLink());

        adminListPage.assertListItemExists("nih");

        AdminManagePage adminManagePage = adminListPage.clickView("nih");

        adminManagePage.clickButton(DdapBy.se("btn-delete"));
        ConfirmationRemovalDialog dialog = new ConfirmationRemovalDialog(driver);
        adminListPage = dialog.confirmForceDelete();

        adminListPage.assertListItemDoNotExist("nih");
    }
}
