import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { SelectAtom } from "../select/select.atom";

import { DialogAtom } from "./dialog.atom";

describe("Visual tests: Dialog", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let buttonCriticalDialog: ElementFinder;
    let buttonWarningDialog: ElementFinder;
    let buttonInfoDialog: ElementFinder;
    let buttonMediumDialog: ElementFinder;
    let buttonLargeDialog: ElementFinder;
    let buttonCustomHeaderDialog: ElementFinder;
    let buttonConfirmationDialogOverrides: ElementFinder;
    let buttonConfirmationDialogDefaults: ElementFinder;
    let buttonLongDialog: ElementFinder;
    let buttonResponsiveDialog: ElementFinder;
    let select: SelectAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("dialog/dialog-visual-test");
        buttonCriticalDialog = element(by.id("nui-visual-test-critical-dialog-btn"));
        buttonWarningDialog = element(by.id("nui-visual-test-warning-dialog-btn"));
        buttonInfoDialog = element(by.id("nui-visual-test-info-dialog-btn"));
        buttonMediumDialog = element(by.id("nui-visual-test-medium-dialog-btn"));
        buttonLargeDialog = element(by.id("nui-visual-test-large-dialog-btn"));
        buttonCustomHeaderDialog = element(by.id("nui-visual-test-custom-actions-dialog-btn"));
        buttonConfirmationDialogOverrides = element(by.id("nui-visual-test-confirmation-dialog-overrides-btn"));
        buttonConfirmationDialogDefaults = element(by.id("nui-visual-test-confirmation-dialog-defaults-btn"));
        buttonLongDialog = element(by.id("nui-visual-test-long-dialog-btn"));
        buttonResponsiveDialog = element(by.id("nui-visual-test-responsive-dialog-btn"));
        select = Atom.find(SelectAtom, "nui-visual-basic-select");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Dialog");

        await buttonCriticalDialog.click();
        await eyes.checkWindow("Critical dialog");
        await DialogAtom.dismissDialog();

        await buttonWarningDialog.click();
        await eyes.checkWindow("Warning dialog");
        await DialogAtom.dismissDialog();

        await buttonInfoDialog.click();
        await eyes.checkWindow("Info dialog");
        await DialogAtom.dismissDialog();

        await buttonMediumDialog.click();
        await eyes.checkWindow("Medium dialog");
        await DialogAtom.dismissDialog();

        await buttonLargeDialog.click();
        await eyes.checkWindow("Large dialog");
        await DialogAtom.dismissDialog();

        await buttonCustomHeaderDialog.click();
        await eyes.checkWindow("Custom header dialog");
        await select.toggleMenu();
        await eyes.checkWindow("Menu is toggled and has proper z-index");
        await select.toggleMenu();
        await DialogAtom.dismissDialog();

        await buttonConfirmationDialogOverrides.click();
        await eyes.checkWindow("Confirmation dialog with overrides");
        await DialogAtom.dismissDialog();

        await buttonConfirmationDialogDefaults.click();
        await eyes.checkWindow("Confirmation dialog default");
        await DialogAtom.dismissDialog();

        await buttonLongDialog.click();
        await Helpers.browserZoom(55);
        await eyes.checkWindow("Default dialog with long content");
        await Helpers.browserZoom(100);
        await DialogAtom.dismissDialog();

        await buttonResponsiveDialog.click();
        await eyes.checkWindow("Responsive-mode dialog with long content");
        await DialogAtom.dismissDialog();

        await eyes.close();
    }, 200000);
});
