import { browser, by, element, ElementFinder, ExpectedConditions } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { DialogAtom } from "../public_api";

describe("a11y: dialog", () => {
    // disabling the rule until NUI-6014 is addressed
    const rulesToDisable: string[] = [
        "color-contrast",
        "scrollable-region-focusable", // consumers are responsible for taking care of their own content
    ];
    let buttonCriticalDialog: ElementFinder;
    let buttonWarningDialog: ElementFinder;
    let buttonInfoDialog: ElementFinder;
    let buttonConfirmationDialogOverrides: ElementFinder;
    let buttonConfirmationDialogDefaults: ElementFinder;
    let buttonResponsiveDialog: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("dialog/dialog-visual-test");

        buttonCriticalDialog = element(by.id("nui-visual-test-critical-dialog-btn"));
        buttonWarningDialog = element(by.id("nui-visual-test-warning-dialog-btn"));
        buttonInfoDialog = element(by.id("nui-visual-test-info-dialog-btn"));
        buttonConfirmationDialogOverrides = element(by.id("nui-visual-test-confirmation-dialog-overrides-btn"));
        buttonConfirmationDialogDefaults = element(by.id("nui-visual-test-confirmation-dialog-defaults-btn"));
        buttonResponsiveDialog = element(by.id("nui-visual-test-responsive-dialog-btn"));

        await browser.wait(ExpectedConditions.visibilityOf(buttonResponsiveDialog), 3000);
    });

    it("should verify a11y of critical dialog", async () => {
        await buttonCriticalDialog.click();
        await assertA11y(browser, DialogAtom.CSS_CLASS, rulesToDisable);
        await DialogAtom.dismissDialog();
    });

    it("should verify a11y of warning dialog", async () => {
        await buttonWarningDialog.click();
        await assertA11y(browser, DialogAtom.CSS_CLASS, rulesToDisable);
        await DialogAtom.dismissDialog();
    });

    it("should verify a11y of info dialog", async () => {
        await buttonInfoDialog.click();
        await assertA11y(browser, DialogAtom.CSS_CLASS, rulesToDisable);
        await DialogAtom.dismissDialog();
    });

    it("should verify a11y of confirmation dialog in dark theme", async () => {
        await Helpers.switchDarkTheme("on");
        await buttonConfirmationDialogOverrides.click();
        await assertA11y(browser, DialogAtom.CSS_CLASS, rulesToDisable);
        await DialogAtom.dismissDialog();
        await Helpers.switchDarkTheme("off");
    });

    it("should verify a11y of confirmation dialog in light theme", async () => {
        await buttonConfirmationDialogDefaults.click();
        await assertA11y(browser, DialogAtom.CSS_CLASS, rulesToDisable);
        await DialogAtom.dismissDialog();
    });

    it("should verify a11y of confirmation dialog in light theme", async () => {
        await buttonConfirmationDialogDefaults.click();
        await assertA11y(browser, DialogAtom.CSS_CLASS, rulesToDisable);
        await DialogAtom.dismissDialog();
    });

    it("should verify a11y of responsive dialog", async () => {
        await buttonResponsiveDialog.click();
        await assertA11y(browser, DialogAtom.CSS_CLASS, rulesToDisable);
        await DialogAtom.dismissDialog();
    });
});
