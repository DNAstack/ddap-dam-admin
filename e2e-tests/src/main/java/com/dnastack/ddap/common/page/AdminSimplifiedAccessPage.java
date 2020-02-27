package com.dnastack.ddap.common.page;

import com.dnastack.ddap.common.util.DdapBy;
import org.openqa.selenium.WebDriver;

public class AdminSimplifiedAccessPage extends AdminDdapPage {

    public AdminSimplifiedAccessPage(WebDriver driver) {
        super(driver);
    }

    public AdminManagePage clickCreateGCSResource() {
        driver.findElement(DdapBy.se("btn-create-gcs-resource"))
                .click();
        return new AdminManagePage(driver);
    }

    public AdminManagePage clickCreateBigQueryResource() {
        driver.findElement(DdapBy.se("btn-create-bigquery-resource"))
            .click();
        return new AdminManagePage(driver);
    }

    public AdminManagePage clickCreateBeaconResource() {
        driver.findElement(DdapBy.se("btn-create-beacon-resource"))
            .click();
        return new AdminManagePage(driver);
    }

}
