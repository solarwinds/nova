import { $, browser, by, element, ElementFinder, ExpectedConditions, Key } from "protractor";
import { protractor } from "protractor/built/ptor";

import { WebElement } from "../../../stub/protractor";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom, DialogAtom } from "../public_api";
import { SelectV2Atom } from "../select-v2/select-v2.atom";

describe("USERCONTROL Dialog", () => {
    let defaultDialogBtn: ButtonAtom;
    let closableDialogBtn: ButtonAtom;
    let unclosableDialogBtn: ButtonAtom;
    let criticalDialogBtn: ButtonAtom;
    let warningDialogBtn: ButtonAtom;
    let infoDialogBtn: ButtonAtom;
    let customClassButton: ButtonAtom;
    let staticBackdropButton: ButtonAtom;
    let staticBackdropESCButton: ButtonAtom;
    let selectToOpenDialog: SelectV2Atom;
    let overlayContainer: ElementFinder;
    let dialog: DialogAtom;
    let closeButton: ElementFinder;
    let header: ElementFinder;
    let footer: ElementFinder;
    let cancelButton: ElementFinder;
    let actionButton: ElementFinder;
    let themeSwitcher: WebElement;

    beforeAll(async () => {
        await Helpers.prepareBrowser("dialog/dialog-test");
        defaultDialogBtn = Atom.find(ButtonAtom, "nui-demo-default-dialog-btn");
        closableDialogBtn = Atom.find(ButtonAtom, "nui-demo-with-keyboard-dialog-btn");
        unclosableDialogBtn = Atom.find(ButtonAtom, "nui-demo-without-keyboard-dialog-btn");
        criticalDialogBtn = Atom.find(ButtonAtom, "nui-demo-critical-dialog-btn");
        warningDialogBtn = Atom.find(ButtonAtom, "nui-demo-warning-dialog-btn");
        infoDialogBtn = Atom.find(ButtonAtom, "nui-demo-info-dialog-btn");
        customClassButton = Atom.find(ButtonAtom, "nui-demo-custom-class-btn");
        staticBackdropButton = Atom.find(ButtonAtom, "nui-demo-static-backdrop-dialog-btn");
        staticBackdropESCButton = Atom.find(ButtonAtom, "nui-demo-static-backdrop-ESC-dialog-btn");
        selectToOpenDialog = Atom.find(SelectV2Atom, "select-to-open-dialog");
        themeSwitcher = await Helpers.getElementByCSS(".nui-switch__bar");
        overlayContainer = $(".overlay-container-priority");
        dialog = new DialogAtom(element(by.className("nui-dialog")));
        closeButton = dialog.getCloseButton();
        header = dialog.getHeader();
        footer = dialog.getFooter();
        cancelButton = dialog.getCancelButton();
        actionButton = dialog.getActionButton();
    });

    afterEach(async () => {
    // close dialog if possible to return to initial state
        try {
            await closeButton.click();
        } catch (e) {}
    });

    it("should show simple dialog", async () => {
        await defaultDialogBtn.click();
        expect(await dialog.isDialogDisplayed()).toBe(true);
    });

    it("should add custom class to dialog", async () => {
        await customClassButton.click();
        expect(await dialog.hasClass("demoDialogCustomClass")).toBe(true);
    });

    describe("severity levels", async () => {
        it("should show critical dialog", async () => {
            await criticalDialogBtn.scrollTo({ block: "center" });
            await criticalDialogBtn.click();
            expect(await Atom.hasClass(header, "dialog-header-critical")).toBe(true);
        });

        it("should show warning dialog", async () => {
            await warningDialogBtn.scrollTo({ block: "center" });
            await warningDialogBtn.click();
            expect(await Atom.hasClass(header, "dialog-header-warning")).toBe(true);
        });

        it("should show info dialog", async () => {
            await infoDialogBtn.scrollTo({ block: "center" });
            await infoDialogBtn.click();
            expect(await Atom.hasClass(header, "dialog-header-info")).toBe(true);
        });
    });

    describe("buttons in dialog footer", async () => {
        beforeEach(async () => {
            await defaultDialogBtn.scrollTo({ block: "center" });
            await defaultDialogBtn.click();
        });
        it("should cancel button is presented", async () => {
            expect(await cancelButton.isPresent()).toBe(true);
            expect(await cancelButton.getText()).toBe("Cancel");
        });

        it("should action button is presented", async () => {
            expect(await actionButton.isPresent()).toBe(true);
            expect(await actionButton.getText()).toBe("Action");
        });
    });
    describe("Dismissal on ESC keyboard input", async () => {
        it("should close closable with ESC", async () => {
            await closableDialogBtn.scrollTo({ block: "center" });
            await closableDialogBtn.click();
            expect(await dialog.isDialogDisplayed()).toBe(true);
            await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            expect(await dialog.isDialogDisplayed()).toBe(false);
        });

        it("should keep unclosable dialog open", async () => {
            await unclosableDialogBtn.scrollTo({ block: "center" });
            await unclosableDialogBtn.click();
            expect(await dialog.isDialogDisplayed()).toBe(true);
            await browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
            expect(await dialog.isDialogDisplayed()).toBe(true);
        });
    });
    describe("Dismissal in case of static backdrop", async () => {
        it("should stay opened on backdrop click if backdrop is static", async () => {
            await staticBackdropButton.scrollTo({ block: "center" });
            await staticBackdropButton.click();
            expect(await dialog.isDialogDisplayed()).toBe(true);
            await browser.actions().mouseMove({x: 100, y: 100}).perform();
            await browser.actions().click().perform();
            expect(await dialog.isDialogDisplayed()).toBe(true);
        });
        it("should stay opened on ESC key press if backdrop is static", async () => {
            await staticBackdropESCButton.scrollTo({ block: "center" });
            await staticBackdropESCButton.click();
            await Helpers.pressKey(Key.ESCAPE);
            expect(await dialog.isDialogDisplayed()).toBe(true);
        });
    });
    describe("Tab navigation inside the dialog", async () => {
        let initiallyFocusedCloseButtonElement: string;
        const assert = async () => expect(initiallyFocusedCloseButtonElement)
                                        .toEqual(await (await browser.switchTo().activeElement()).getId());

        beforeEach(async () => {
            await defaultDialogBtn.scrollTo({ block: "center" });
            await defaultDialogBtn.click();
            initiallyFocusedCloseButtonElement = await (await dialog.getCloseButton().getWebElement()).getId();
        });

        afterEach(async () => {
            if (await dialog.isDialogDisplayed()) {
                await dialog.getCloseButton().click();
            }
        });

        it("should Close button in header have focus by default", async () => {
            assert();
        });

        it("should focus stay inside dialog on TAB navigation", async () => {
            await Helpers.pressKey(Key.TAB, 3);
            assert();
        });

        it("should not slip back to the page on SHIFT+TAB keys input", async () => {
            await Helpers.pressKey(Key.chord(Key.SHIFT, Key.TAB), 3);
            assert();
        });
    });

    describe("Tab navigation outside the dialog", async () => {
        beforeEach(async () => {
            await defaultDialogBtn.scrollTo({ block: "center" });
            await defaultDialogBtn.click();
        });

        afterEach(async () => {
            if (await dialog.isDialogDisplayed()) {
                await dialog.getCloseButton().click();
            }
        });

        it("should focus element inside dialog on TAB when focus outside the dialog", async () => {
            await themeSwitcher.click();
            const actionButtonId = await dialog.getActionButton().getId();
            await Helpers.pressKey(Key.TAB, 1);
            const focusedElementId = await (await browser.switchTo().activeElement()).getId();

            expect(actionButtonId).toBe(focusedElementId);
        });

        it("should focus element inside dialog on SHIFT+TAB when focus outside the dialog", async () => {
            await themeSwitcher.click();
            const actionButtonId = await dialog.getActionButton().getId();
            await Helpers.pressKey(Key.chord(Key.SHIFT, Key.TAB), 1);
            const focusedElementId = await (await browser.switchTo().activeElement()).getId();

            expect(actionButtonId).toBe(focusedElementId);
        });
    });

    describe("regression >", async () => {
        it("should dialog be dismissed on mouseup event outside the dialog body (NUI-3292)", async () => {
            await defaultDialogBtn.scrollTo({ block: "center" });
            await defaultDialogBtn.click();
            await browser.actions().mouseMove(dialog.getDialog()).perform();
            await browser.actions().mouseDown().perform();
            await browser.actions().mouseMove({x: -500, y: 0}).perform();
            await browser.actions().mouseUp().perform();
            expect(await dialog.isDialogDisplayed()).toBe(true);
        });

        describe("dialog with overlay >", () => {
            beforeEach(async () => {
                await (await selectToOpenDialog.getFirstOption()).click();
                await browser.wait(ExpectedConditions.visibilityOf(dialog.getElement()), 3000, "Could not find the dialog!");
            });

            afterEach(async () => {
                await Helpers.pressKey(Key.ESCAPE);
            });

            it("should append to cdk overlay custom container (NUI-5169)", async () => {
                expect(await overlayContainer?.$(`.${DialogAtom.CSS_CLASS}`).isPresent()).toBeTruthy();
            });

            it("should append to cdk overlay custom container (NUI-5169)", async () => {
                expect(await overlayContainer?.$(`.${DialogAtom.DIALOG_WINDOW_CSS_CLASS}`).getCssValue("z-index")).toEqual("1000");
                expect(await overlayContainer?.$(`.${DialogAtom.BACKDROP_CSS_CLASS}`).getCssValue("z-index")).toEqual("1000");
            });

            it("should close overlay in datepicker on click outside dialog", async () => {
                const datePicker = dialog.getDatetimePicker().getDatePicker();
                await datePicker.toggle();
                await browser.actions().mouseMove({x: -500, y: 0}).click().perform();
                expect(await datePicker.overlay.isOpened()).toBe(false);
            });

            it("should close overlay in timepicker on click outside dialog", async () => {
                const timePicker = dialog.getDatetimePicker().getTimePicker();
                await timePicker.toggle();
                await browser.actions().mouseMove({x: -500, y: 0}).click().perform();
                expect(await timePicker.overlay.isOpened()).toBe(false);
            });
        });
    });
});
