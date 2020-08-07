package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.TestingPersona;
import com.dnastack.ddap.common.page.AdminDdapPage;
import org.junit.After;
import org.junit.BeforeClass;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebElement;

import java.io.IOException;
import java.lang.invoke.MethodHandles;

import static com.dnastack.ddap.common.TestingPersona.ADMINISTRATOR;
import static java.lang.String.format;

public abstract class AbstractAdminFrontendE2eTest extends AbstractFrontendE2eTest {

    @BeforeClass
    public static void oneTimeSetup() throws IOException {
        String realm = getRealm();
        String testConfig = loadTemplate("/com/dnastack/ddap/adminConfig.json");
        setupRealmConfig(TestingPersona.ADMINISTRATOR, testConfig, realm);

        ddapPage = doBrowserLogin(realm, ADMINISTRATOR, AdminDdapPage::new);
    }

    protected static String getRealm() {
        return generateRealmName(MethodHandles.lookup().lookupClass().getSimpleName());
    }

    protected static String getInternalName(String displayName) {
        String name = format("%s-%s", displayName, System.currentTimeMillis());
        return name.length() > 15 ? name.substring(0, 16) : name;
    }

    // Whenever test fails the JUnit retries the test, but it does not restart the test from the clean state.
    // There might be unclosed dialogs or dropdowns which might prevent a valid test retry. We try to close those
    // elements here if they exists after ending the test so the actual test retry won't be affected by them.
    @After
    public void tearDown() throws Exception {
        try {
            WebElement overlay = driver.findElement(By.className("cdk-overlay-backdrop"));
            overlay.click();
        } catch (NoSuchElementException nsee) {
            // intentionally left empty
        }
    }

}
