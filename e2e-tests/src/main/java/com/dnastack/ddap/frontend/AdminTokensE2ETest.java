package com.dnastack.ddap.frontend;


import com.dnastack.ddap.common.page.AdminListPage;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.damTokensLink;

public class AdminTokensE2ETest extends AbstractAdminFrontendE2eTest {

    @Test
    public void listTokens() {
        AdminListPage adminListPage = ddapPage.getNavBar().goTo(damTokensLink(), AdminListPage::new);
        adminListPage.assertListItemExists("access-token");
    }

    @Test
    public void revokeToken() {
        AdminListPage adminListPage = ddapPage.getNavBar().goTo(damTokensLink(), AdminListPage::new);
        adminListPage.assertListItemExists("access-token");

        adminListPage.clickView("access-token", "Revoke Token");

        adminListPage.waitForInflightRequests();
        // doing this for now as we have mock data
        adminListPage.assertListItemExists("access-token");
        // TODO: Update this after integration with real token endpoint
        // adminListPage.assertListItemDoNotExist("access-token");
    }
}
