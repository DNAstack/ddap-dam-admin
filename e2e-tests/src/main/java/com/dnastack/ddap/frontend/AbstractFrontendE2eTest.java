package com.dnastack.ddap.frontend;

import com.dnastack.ddap.common.AbstractBaseE2eTest;
import com.dnastack.ddap.common.TestingPersona;
import com.dnastack.ddap.common.page.AnyDdapPage;
import com.dnastack.ddap.common.util.RetryRule;
import com.dnastack.ddap.common.util.ScreenshotUtil;
import io.github.bonigarcia.wdm.WebDriverManager;
import lombok.extern.slf4j.Slf4j;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Rule;
import org.junit.rules.TestName;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

@Slf4j
public abstract class AbstractFrontendE2eTest extends AbstractBaseE2eTest {

    protected static final boolean HEADLESS = Boolean.parseBoolean(optionalEnv("HEADLESS", "true"));
    protected static WebDriver driver;
    protected static AnyDdapPage ddapPage;

    @Rule
    public TestName name = new TestName();
    @Rule
    public RetryRule retry = new RetryRule(Integer.parseInt(optionalEnv("E2E_TEST_RETRIES", "3")));

    @BeforeClass
    public static void driverSetup() {
        WebDriverManager.chromedriver().setup();
        driver = getChromeDriver();
        driver.manage().timeouts().implicitlyWait(1, TimeUnit.SECONDS);
    }

    private static ChromeDriver getChromeDriver() {
        ChromeOptions options = new ChromeOptions();
        if (HEADLESS) {
            options.addArguments("headless");
        }
        options.addArguments("--disable-gpu");
        options.addArguments("window-size=1200x600");
        options.addArguments("incognito");

        return new ChromeDriver(options);
    }

    @AfterClass
    public static void cleanUp() {
        if (driver == null) {
            return;
        }
        driver.manage().deleteAllCookies();
        driver.quit();
        driver = null;
    }

    protected static <T extends AnyDdapPage> T doBrowserLogin(String realm, TestingPersona persona, Function<WebDriver, T> pageFactory) {
        try {
            return loginStrategy.performPersonaLogin(driver, persona, realm, pageFactory);
        } catch (IOException e) {
            throw new RuntimeException("Unable to login", e);
        }
    }

    @After
    public void afterEach() {
        String testName = this.getClass().getSimpleName() + "." + name.getMethodName() + ".png";
        ScreenshotUtil.capture(testName, driver);
    }

    // Whenever test fails the JUnit retries the test, but it does not restart the test from the clean state.
    // There might be unclosed dialogs or dropdowns which might prevent a valid test retry. We try to close those
    // elements here if they exists after ending the test so the actual test retry won't be affected by them.
    @After
    public void tearDown() {
        try {
            WebElement overlay = driver.findElement(By.className("cdk-overlay-backdrop"));
            overlay.click();
        } catch (NoSuchElementException nsee) {
            // intentionally left empty
        }
    }

}
