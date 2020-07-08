package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminListPage;
import org.junit.Assume;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.consentsLink;

public class AdminConsentsE2eTest extends AbstractAdminFrontendE2eTest {

    @BeforeClass
    public static void beforeClass() throws Exception {
        Assume.assumeFalse(
                "Consent is disabled, skipping consents e2e tests",
                Boolean.parseBoolean(optionalEnv("E2E_WALLET_SKIP_DAM_CONSENT", "false"))
        );
    }

    @Ignore
    @Test
    public void shouldListConsents() {
        AdminListPage adminListPage = ddapPage.getNavBar()
                .goTo(consentsLink(), AdminListPage::new);
        adminListPage.assertTableNotEmpty();
    }
}
