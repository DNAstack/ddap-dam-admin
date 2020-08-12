package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminDdapPage;
import com.dnastack.ddap.common.page.AdminListPage;
import com.dnastack.ddap.common.page.AdminManagePage;
import com.dnastack.ddap.common.util.DdapBy;
import lombok.extern.slf4j.Slf4j;
import org.junit.After;
import org.junit.Test;
import org.openqa.selenium.ElementClickInterceptedException;
import org.openqa.selenium.NoSuchElementException;

import static com.dnastack.ddap.common.TestingPersona.ADMINISTRATOR;
import static com.dnastack.ddap.common.fragments.NavBar.groupsLink;

@Slf4j
@SuppressWarnings("Duplicates")
public class AdminGroupsE2eTest extends AbstractAdminFrontendE2eTest {

    @Override
    @After
    public void tearDown() {
        super.tearDown();
        try {
            AdminListPage adminListPage = ddapPage.getNavBar()
                .goTo(groupsLink(), AdminListPage::new);
            adminListPage.assertListItemExists("test-group");
            adminListPage.clickDelete("test-group");
            adminListPage.assertListItemDoNotExist("test-group");
        } catch (ElementClickInterceptedException | NoSuchElementException e) {
            // Intentionally left empty
        }
    }

    @Test
    public void addAndThenDeleteGroup() {
        ddapPage = doBrowserLogin(getRealm(), ADMINISTRATOR, AdminDdapPage::new);

        AdminListPage adminListPage = ddapPage.getNavBar()
            .goTo(groupsLink(), AdminListPage::new);

        AdminManagePage adminManagePage = adminListPage.clickManage();
        adminManagePage.fillField(DdapBy.se("inp-label"), "test-group");
        adminManagePage.fillField(DdapBy.se("inp-bulk-emails"), "1@1.com;2@2.com;3@3.com");

        adminManagePage.saveEntity();
        adminListPage.assertListItemExists("test-group");
    }

}
