package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.page.AdminManagePage;
import com.dnastack.ddap.common.page.SimplifiedAdminQuickstartPage;
import com.dnastack.ddap.common.util.DdapBy;
import org.junit.Test;

import static com.dnastack.ddap.common.fragments.NavBar.simplifiedAdminQuickstartLink;
import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertThat;

@SuppressWarnings("Duplicates")
public class SimplifiedAdminQuickstartE2eTest extends AbstractAdminFrontendE2eTest {

    @Test
    public void createResourceForGCSWithDefaults() {
        SimplifiedAdminQuickstartPage simplifiedQuickstartPage = ddapPage.getNavBar()
            .goTo(simplifiedAdminQuickstartLink(), SimplifiedAdminQuickstartPage::new);

        AdminManagePage adminManagePage = simplifiedQuickstartPage.clickCreateGCSResource();

        String collection = "test-gcs-cag-read";
        adminManagePage.fillField(DdapBy.se("inp-display-name"), collection);
        adminManagePage.fillField(DdapBy.se("inp-variable-bucket"), "test");
        adminManagePage.fillField(DdapBy.se("inp-variable-project"), "test");
        adminManagePage.fillField(DdapBy.se("inp-access-policy-value"), "http://test.dnastack.com");

        // Should be redirected to newly created resource detail page
        AdminManagePage resourceAdminManagePage = adminManagePage.saveEntity(AdminManagePage::new);
        assertThat(driver.findElement(DdapBy.se("page-title")).getText(), equalTo(collection));
    }

    @Test
    public void createResourceForGCSWithRead() {
        SimplifiedAdminQuickstartPage simplifiedQuickstartPage = ddapPage.getNavBar()
            .goTo(simplifiedAdminQuickstartLink(), SimplifiedAdminQuickstartPage::new);

        AdminManagePage adminManagePage = simplifiedQuickstartPage.clickCreateGCSResource();

        String collection = "test-gcs-rs-read";
        adminManagePage.fillField(DdapBy.se("inp-display-name"), collection);
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
        SimplifiedAdminQuickstartPage simplifiedQuickstartPage = ddapPage.getNavBar()
            .goTo(simplifiedAdminQuickstartLink(), SimplifiedAdminQuickstartPage::new);

        AdminManagePage adminManagePage = simplifiedQuickstartPage.clickCreateGCSResource();

        String collection = "test-gcs-rs-write";
        adminManagePage.fillField(DdapBy.se("inp-display-name"), collection);
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
        SimplifiedAdminQuickstartPage simplifiedQuickstartPage = ddapPage.getNavBar()
            .goTo(simplifiedAdminQuickstartLink(), SimplifiedAdminQuickstartPage::new);

        AdminManagePage adminManagePage = simplifiedQuickstartPage.clickCreateBigQueryResource();

        String collection = "test-bigquery-cag-read";
        adminManagePage.fillField(DdapBy.se("inp-display-name"), collection);
        adminManagePage.fillField(DdapBy.se("inp-variable-project"), "test");
        adminManagePage.fillField(DdapBy.se("inp-access-policy-value"), "http://test.dnastack.com");

        // Should be redirected to newly created resource detail page
        AdminManagePage resourceAdminManagePage = adminManagePage.saveEntity(AdminManagePage::new);
        assertThat(driver.findElement(DdapBy.se("page-title")).getText(), equalTo(collection));
    }

    @Test
    public void createResourceForBeaconWithDefaults() {
        SimplifiedAdminQuickstartPage simplifiedQuickstartPage = ddapPage.getNavBar()
            .goTo(simplifiedAdminQuickstartLink(), SimplifiedAdminQuickstartPage::new);

        AdminManagePage adminManagePage = simplifiedQuickstartPage.clickCreateBeaconResource();

        String collection = "test-beacon-cag-read";
        adminManagePage.fillField(DdapBy.se("inp-display-name"), collection);
        adminManagePage.fillField(DdapBy.se("inp-variable-aud"), "http://test.dnastack.com");
        adminManagePage.fillField(DdapBy.se("inp-variable-url"), "http://test.beacon.dnastack.com");
        adminManagePage.fillField(DdapBy.se("inp-access-policy-value"), "http://test.dnastack.com");

        // Should be redirected to newly created resource detail page
        AdminManagePage resourceAdminManagePage = adminManagePage.saveEntity(AdminManagePage::new);
        assertThat(driver.findElement(DdapBy.se("page-title")).getText(), equalTo(collection));
    }

    @Test
    public void createResourceForAwsS3WithDefaults() {
        SimplifiedAdminQuickstartPage simplifiedQuickstartPage = ddapPage.getNavBar()
            .goTo(simplifiedAdminQuickstartLink(), SimplifiedAdminQuickstartPage::new);

        AdminManagePage adminManagePage = simplifiedQuickstartPage.clickCreateAwsS3Resource();

        String collection = "test-s3-cag-read";
        adminManagePage.fillField(DdapBy.se("inp-display-name"), collection);
        adminManagePage.fillField(DdapBy.se("inp-variable-bucket"), "dnastack");
        adminManagePage.fillField(DdapBy.se("inp-access-policy-value"), "http://test.dnastack.com");

        // Should be redirected to newly created resource detail page
        AdminManagePage resourceAdminManagePage = adminManagePage.saveEntity(AdminManagePage::new);
        assertThat(driver.findElement(DdapBy.se("page-title")).getText(), equalTo(collection));
    }

    @Test
    public void createResourceForAwsRedshiftWithDefaults() {
        SimplifiedAdminQuickstartPage simplifiedQuickstartPage = ddapPage.getNavBar()
            .goTo(simplifiedAdminQuickstartLink(), SimplifiedAdminQuickstartPage::new);

        AdminManagePage adminManagePage = simplifiedQuickstartPage.clickCreateAwsRedshiftResource();

        String collection = "test-redshift-cag-read";
        adminManagePage.fillField(DdapBy.se("inp-display-name"), collection);
        adminManagePage.fillField(DdapBy.se("inp-variable-cluster"), "arn:aws:redshift:us-east-1:123456:cluster:test-cluster");
        adminManagePage.fillField(DdapBy.se("inp-access-policy-value"), "http://test.dnastack.com");

        // Should be redirected to newly created resource detail page
        AdminManagePage resourceAdminManagePage = adminManagePage.saveEntity(AdminManagePage::new);
        assertThat(driver.findElement(DdapBy.se("page-title")).getText(), equalTo(collection));
    }

}
