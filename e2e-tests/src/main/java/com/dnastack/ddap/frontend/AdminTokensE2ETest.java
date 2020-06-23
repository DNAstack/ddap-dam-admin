package com.dnastack.ddap.frontend;


import com.dnastack.ddap.common.page.AdminListPage;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.tokensLink;

public class AdminTokensE2ETest extends AbstractAdminFrontendE2eTest {

    @Test
    public void shouldListTokens() {
        AdminListPage adminListPage = ddapPage.getNavBar()
            .goTo(tokensLink(), AdminListPage::new);

        adminListPage.assertTableNotEmpty();
    }

}
