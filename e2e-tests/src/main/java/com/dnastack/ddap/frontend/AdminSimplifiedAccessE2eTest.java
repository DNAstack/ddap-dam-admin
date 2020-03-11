package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminManagePage;
import com.dnastack.ddap.common.page.AdminSimplifiedAccessPage;
import com.dnastack.ddap.common.util.DdapBy;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.simplifiedAccessLink;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

@SuppressWarnings("Duplicates")
public class AdminSimplifiedAccessE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void createResourceForGCSWithDefaults() {
        AdminSimplifiedAccessPage simplifiedAccessPage = ddapPage.getNavBar()
            .goToSimplifiedAdmin(simplifiedAccessLink(), AdminSimplifiedAccessPage::new);

        AdminManagePage adminManagePage = simplifiedAccessPage.clickCreateGCSResource();

        String collection = "test-gcs-cag-read";
        adminManagePage.fillField(DdapBy.se("inp-collection"), collection);
        adminManagePage.fillField(DdapBy.se("inp-variable-bucket"), "test");
        adminManagePage.fillField(DdapBy.se("inp-variable-project"), "test");
        adminManagePage.fillField(DdapBy.se("inp-access-policy-value"), "http://test.dnastack.com");

        // Should be redirected to newly created resource detail page
        AdminManagePage resourceAdminManagePage = adminManagePage.saveEntity(AdminManagePage::new);
        assertThat(driver.findElement(DdapBy.se("page-title")).getText(), equalTo(collection));
    }

    @Test
    public void createResourceForGCSWithRead() {
        AdminSimplifiedAccessPage simplifiedAccessPage = ddapPage.getNavBar()
            .goToSimplifiedAdmin(simplifiedAccessLink(), AdminSimplifiedAccessPage::new);

        AdminManagePage adminManagePage = simplifiedAccessPage.clickCreateGCSResource();

        String collection = "test-gcs-rs-read";
        adminManagePage.fillField(DdapBy.se("inp-collection"), collection);
        adminManagePage.fillField(DdapBy.se("inp-variable-bucket"), "test");
        adminManagePage.fillField(DdapBy.se("inp-variable-project"), "test");
        adminManagePage.fillField(DdapBy.se("inp-access-policy-value"), "http://test.dnastack.com");
        adminManagePage.clickButton(DdapBy.se("radio-access-level-Read"));
        adminManagePage.clickButton(DdapBy.se("radio-access-policy-ResearcherStatus"));

        // Should be redirected to newly created resource detail page
        AdminManagePage resourceAdminManagePage = adminManagePage.saveEntity(AdminManagePage::new);
        assertThat(driver.findElement(DdapBy.se("page-title")).getText(), equalTo(collection));
    }

    @Test
    public void createResourceForGCSWithWrite() {
        AdminSimplifiedAccessPage simplifiedAccessPage = ddapPage.getNavBar()
            .goToSimplifiedAdmin(simplifiedAccessLink(), AdminSimplifiedAccessPage::new);

        AdminManagePage adminManagePage = simplifiedAccessPage.clickCreateGCSResource();

        String collection = "test-gcs-rs-write";
        adminManagePage.fillField(DdapBy.se("inp-collection"), collection);
        adminManagePage.fillField(DdapBy.se("inp-variable-bucket"), "test");
        adminManagePage.fillField(DdapBy.se("inp-variable-project"), "test");
        adminManagePage.fillField(DdapBy.se("inp-access-policy-value"), "http://test.dnastack.com");
        adminManagePage.clickButton(DdapBy.se("radio-access-level-Write"));
        adminManagePage.clickButton(DdapBy.se("radio-access-policy-ResearcherStatus"));

        // Should be redirected to newly created resource detail page
        AdminManagePage resourceAdminManagePage = adminManagePage.saveEntity(AdminManagePage::new);
        assertThat(driver.findElement(DdapBy.se("page-title")).getText(), equalTo(collection));
    }

    @Test
    public void createResourceForBigQueryWithDefaults() {
        AdminSimplifiedAccessPage simplifiedAccessPage = ddapPage.getNavBar()
            .goToSimplifiedAdmin(simplifiedAccessLink(), AdminSimplifiedAccessPage::new);

        AdminManagePage adminManagePage = simplifiedAccessPage.clickCreateBigQueryResource();

        String collection = "test-bigquery-cag-read";
        adminManagePage.fillField(DdapBy.se("inp-collection"), collection);
        adminManagePage.fillField(DdapBy.se("inp-variable-project"), "test");
        adminManagePage.fillField(DdapBy.se("inp-access-policy-value"), "http://test.dnastack.com");

        // Should be redirected to newly created resource detail page
        AdminManagePage resourceAdminManagePage = adminManagePage.saveEntity(AdminManagePage::new);
        assertThat(driver.findElement(DdapBy.se("page-title")).getText(), equalTo(collection));
    }

    @Test
    public void createResourceForBeaconWithDefaults() {
        AdminSimplifiedAccessPage simplifiedAccessPage = ddapPage.getNavBar()
            .goToSimplifiedAdmin(simplifiedAccessLink(), AdminSimplifiedAccessPage::new);

        AdminManagePage adminManagePage = simplifiedAccessPage.clickCreateBeaconResource();

        String collection = "test-beacon-cag-read";
        adminManagePage.fillField(DdapBy.se("inp-collection"), collection);
        adminManagePage.fillField(DdapBy.se("inp-variable-aud"), "http://test.dnastack.com");
        adminManagePage.fillField(DdapBy.se("inp-variable-url"), "http://test.beacon.dnastack.com");
        adminManagePage.fillField(DdapBy.se("inp-access-policy-value"), "http://test.dnastack.com");

        // Should be redirected to newly created resource detail page
        AdminManagePage resourceAdminManagePage = adminManagePage.saveEntity(AdminManagePage::new);
        assertThat(driver.findElement(DdapBy.se("page-title")).getText(), equalTo(collection));
    }

}
