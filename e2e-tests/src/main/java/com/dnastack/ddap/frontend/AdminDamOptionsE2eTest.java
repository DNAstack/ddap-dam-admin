package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminOptionPage;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.damOptionsLink;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.hasItem;

@SuppressWarnings("Duplicates")
public class AdminDamOptionsE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void submitBooleanOptionWithoutTypeError() {
        AdminOptionPage adminListPage = ddapPage.getNavBar()
                                                .goToAdminOptionPage(damOptionsLink());
        String option = "Read Only Master Realm";

        assertThat(adminListPage.getOptionNames(), hasItem(option));
        final String oldValue = adminListPage.getOptionValue(option);

        adminListPage.clickEdit(option);
        adminListPage.fillInput(oldValue);

        adminListPage.assertNoError( 5);
    }

    @Test
    public void submitNumberOptionWithoutTypeError() {
        AdminOptionPage adminListPage = ddapPage.getNavBar()
                                                .goToAdminOptionPage(damOptionsLink());

        String option = "GCP Managed Keys Per Account";

        assertThat(adminListPage.getOptionNames(), hasItem(option));
        final String oldValue = adminListPage.getOptionValue(option);

        adminListPage.clickEdit(option);
        adminListPage.fillInput(oldValue);

        adminListPage.assertNoError( 5);
    }

    @Test
    public void submitStringOptionWithoutTypeError() {
        AdminOptionPage adminListPage = ddapPage.getNavBar()
                                                .goToAdminOptionPage(damOptionsLink());

        String option = "GCP Service Account Project";

        assertThat(adminListPage.getOptionNames(), hasItem(option));
        final String oldValue = adminListPage.getOptionValue(option);

        adminListPage.clickEdit(option);
        adminListPage.fillInput(oldValue);

        adminListPage.assertNoError( 5);
    }

    @Test
    public void submitStringOptionWithError() {
        AdminOptionPage adminListPage = ddapPage.getNavBar()
            .goToAdminOptionPage(damOptionsLink());

        String option = "GCP Service Account Project";

        assertThat(adminListPage.getOptionNames(), hasItem(option));

        adminListPage.clickEdit(option);
        adminListPage.fillInput("11111111111");

        adminListPage.assertHasError( 5);
    }

    @Test
    public void submitIntOptionWithError() {
        AdminOptionPage adminListPage = ddapPage.getNavBar()
            .goToAdminOptionPage(damOptionsLink());

        String option = "GCP Managed Keys Per Account";

        assertThat(adminListPage.getOptionNames(), hasItem(option));

        adminListPage.clickEdit(option);
        adminListPage.fillInput("invalid-value");

        adminListPage.assertHasError( 5);
    }

    @Test
    public void submitBoolOptionWithError() {
        AdminOptionPage adminListPage = ddapPage.getNavBar()
            .goToAdminOptionPage(damOptionsLink());

        String option = "Read Only Master Realm";

        assertThat(adminListPage.getOptionNames(), hasItem(option));

        adminListPage.clickEdit(option);
        adminListPage.fillInput("invalid-value");

        adminListPage.assertHasError( 5);
    }

}
