// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.


import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";
import { ButtonAtom  } from "../button/button.atom";
import { DateTimepickerAtom } from "../datetimepicker/datetimepicker.atom";
import { SelectV2Atom } from "../select-v2/select-v2.atom";
import { DialogAtom } from "./dialog.atom";

test.describe("USERCONTROL Dialog", () => {
    let defaultDialogBtn: ButtonAtom;
    let closableDialogBtn: ButtonAtom;
    let unclosableDialogBtn: ButtonAtom;
    let criticalDialogBtn: ButtonAtom;
    let warningDialogBtn: ButtonAtom;
    let infoDialogBtn: ButtonAtom;
    let customClassButton: ButtonAtom;
    let staticBackdropButton: ButtonAtom;
    let staticBackdropESCButton: ButtonAtom;
    let insideOverlayWithDateTimePickerBtn: ButtonAtom;
    let dateTimePicker: DateTimepickerAtom;
    let selectToOpenDialog: SelectV2Atom;
    let overlayContainer: Locator;
    let dialog: DialogAtom;
    let closeButton: Locator;
    let header: Locator;
    let themeSwitcher: Locator;

    test.beforeEach(async ({page}) => {
        await Helpers.prepareBrowser("dialog/dialog-test", page);
        defaultDialogBtn = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-default-dialog-btn");
        closableDialogBtn = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-with-keyboard-dialog-btn"
        );
        unclosableDialogBtn = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-without-keyboard-dialog-btn"
        );
        criticalDialogBtn = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-critical-dialog-btn"
        );
        warningDialogBtn = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-warning-dialog-btn");
        infoDialogBtn = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-info-dialog-btn");
        customClassButton = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-custom-class-btn");
        staticBackdropButton = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-static-backdrop-dialog-btn"
        );
        staticBackdropESCButton = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-static-backdrop-ESC-dialog-btn"
        );
        // selectToOpenDialog = Atom.find<SelectV2Atom>(SelectV2Atom, "select-to-open-dialog");
        insideOverlayWithDateTimePickerBtn = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-dialog-inside-overlay-with-date-time-picker-btn"
        );
        dateTimePicker = Atom.find<DateTimepickerAtom>(DateTimepickerAtom, "date-time-picker");
        themeSwitcher =  Helpers.page.locator(".nui-switch__bar");
        overlayContainer =  Helpers.page.locator(".overlay-container-priority");
        dialog = new DialogAtom(Helpers.page.locator(".nui-dialog"));
        closeButton = dialog.getCloseButton();
        header = dialog.getHeader();
    });

    test("should show simple dialog when click", async () => {
        await defaultDialogBtn.click();
        await dialog.toBeVisible();
    });

    test("should add custom class to dialog", async () => {
        await customClassButton.click();
        await dialog.toContainClass("demoDialogCustomClass");
    });

    test.describe("severity levels", async () => {
        test("should show critical dialog", async () => {
            await criticalDialogBtn.click();
            await expect(header).toContainClass("dialog-header-critical");
        });

        test("should show warning dialog", async () => {
            await warningDialogBtn.click();
            await expect(header).toContainClass("dialog-header-warning");
        });

        test("should show info dialog", async () => {
            await infoDialogBtn.click();
            await expect(header).toContainClass("dialog-header-info");
        });
    });

    test.describe("Dismissal on ESC keyboard input", async () => {
        test("should close closable with ESC", async () => {
            await closableDialogBtn.click();
            await dialog.toBeVisible();
            await Helpers.page.keyboard.press("Escape");
            await dialog.toBeHidden();
        });

        test("should keep unclosable dialog open", async () => {
            await unclosableDialogBtn.getLocator().scrollIntoViewIfNeeded();
            await unclosableDialogBtn.click();
            await dialog.toBeVisible();
            await Helpers.page.keyboard.press("Escape");
            await dialog.toBeVisible();
        });
    });

    test.describe("Dismissal in case of static backdrop", async () => {
        test("should stay opened on backdrop click if backdrop is static", async () => {
            await staticBackdropButton.getLocator().scrollIntoViewIfNeeded();
            await staticBackdropButton.click();
            await dialog.toBeVisible();
            await Helpers.clickOnEmptySpace();
            await dialog.toBeVisible();
        });

        test("should stay opened on ESC key press if backdrop is static", async () => {
            await staticBackdropButton.getLocator().scrollIntoViewIfNeeded();
            await staticBackdropESCButton.click();
            await dialog.toBeVisible();
            await Helpers.page.keyboard.press("Escape");
            await dialog.toBeVisible();
        });
    });

    test.describe("Dismissal on route changes", async () => {
        test("should close dialog with router changed", async () => {
            await defaultDialogBtn.getLocator().scrollIntoViewIfNeeded();
            await defaultDialogBtn.click();
            await dialog.toBeVisible();

            await Helpers.setLocation("dialog");
            expect(await dialog.isDialogDisplayed()).toBe(false);
        });
    });
    //
    // test.describe("Tab navigation inside the dialog", async () => {
    //     let initiallyFocusedCloseButtonElement: string;
    //     const assert = async () =>
    //         expect(initiallyFocusedCloseButtonElement).toEqual(
    //             await (await browser.switchTo().activeElement()).getId()
    //         );
    //
    //     test.beforeEach(async () => {
    //         await defaultDialogBtn.scrollTo({ block: "center" });
    //         await defaultDialogBtn.click();
    //         initiallyFocusedCloseButtonElement = await (
    //             await dialog.getCloseButton().getWebElement()
    //         ).getId();
    //     });
    //
    //
    //     test("should Close button in header have focus by default", async () => {
    //         assert();
    //     });
    //
    //     test("should focus stay inside dialog on TAB navigation", async () => {
    //         await Helpers.pressKey(Key.TAB, 3);
    //         assert();
    //     });
    //
    //     test("should not slip back to the page on SHIFT+TAB keys input", async () => {
    //         await Helpers.pressKey(Key.chord(Key.SHIFT, Key.TAB), 3);
    //         assert();
    //     });
    // });
    //
    // test.describe("Tab navigation outside the dialog", async () => {
    //     test.beforeEach(async () => {
    //         await defaultDialogBtn.scrollTo({ block: "center" });
    //         await defaultDialogBtn.click();
    //     });
    //
    //     test("should focus element inside dialog on TAB when focus outside the dialog", async () => {
    //         await themeSwitcher.click();
    //         const actionButtonId = await dialog.getActionButton().getId();
    //         await Helpers.pressKey(Key.TAB);
    //         const focusedElementId = await (
    //             await browser.switchTo().activeElement()
    //         ).getId();
    //
    //         expect(actionButtonId).toBe(focusedElementId);
    //     });
    //
    //     test("should focus element inside dialog on SHIFT+TAB when focus outside the dialog", async () => {
    //         await themeSwitcher.click();
    //         const actionButtonId = await dialog.getActionButton().getId();
    //         await Helpers.pressKey(Key.chord(Key.SHIFT, Key.TAB));
    //         const focusedElementId = await (
    //             await browser.switchTo().activeElement()
    //         ).getId();
    //
    //         expect(actionButtonId).toBe(focusedElementId);
    //     });
    // });
    //
    // test.describe("regression >", async () => {
    //     test("should dialog be dismissed on mouseup event outside the dialog body (NUI-3292)", async () => {
    //         await defaultDialogBtn.scrollTo({ block: "center" });
    //         await defaultDialogBtn.click();
    //         await browser.actions().mouseMove(dialog.getDialog()).perform();
    //         await browser.actions().mouseDown().perform();
    //         await browser.actions().mouseMove({ x: -500, y: 0 }).perform();
    //         await browser.actions().mouseUp().perform();
    //         expect(await dialog.isDialogDisplayed()).toBe(true);
    //     });
    //
    //     test.describe("dialog with overlay >", () => {
    //         test.beforeEach(async () => {
    //             await (await selectToOpenDialog.getFirstOption()).click();
    //             await browser.watest(
    //                 ExpectedConditions.visibilityOf(dialog.getElement()),
    //                 3000,
    //                 "Could not find the dialog!"
    //             );
    //         });
    //
    //         test("should append to cdk overlay custom container (NUI-5169)", async () => {
    //             expect(
    //                 await overlayContainer
    //                     ?.$(Atom.getSelector(DialogAtom))
    //                     .isPresent()
    //             ).toBeTruthy();
    //         });
    //
    //         test("should append to cdk overlay custom container (NUI-5169)", async () => {
    //             expect(
    //                 await overlayContainer
    //                     ?.$(`.${DialogAtom.DIALOG_WINDOW_CSS_CLASS}`)
    //                     .getCssValue("z-index")
    //             ).toEqual("1000");
    //             expect(
    //                 await overlayContainer
    //                     ?.$(`.${DialogAtom.BACKDROP_CSS_CLASS}`)
    //                     .getCssValue("z-index")
    //             ).toEqual("1000");
    //         });
    //     });
    // });
    //
    // test.describe("dialog with date-time-picker in overlay >", () => {
    //     test.beforeEach(async () => {
    //         await insideOverlayWithDateTimePickerBtn.scrollTo({
    //             block: "center",
    //         });
    //         await insideOverlayWithDateTimePickerBtn.click();
    //         await browser.watest(
    //             ExpectedConditions.visibilityOf(dialog.getElement()),
    //             3000,
    //             "Could not find the dialog!"
    //         );
    //     });
    //
    //     test("should close overlay in datepicker on click outside dialog", async () => {
    //         const datePicker = dateTimePicker.getDatePicker();
    //         await datePicker.toggle();
    //         await browser
    //             .actions()
    //             .mouseMove({ x: -500, y: 0 })
    //             .click()
    //             .perform();
    //         expect(await datePicker.overlay.isOpened()).toBe(false);
    //     });
    //
    //     test("should close overlay in timepicker on click outside dialog", async () => {
    //         const timePicker = dateTimePicker.getTimePicker();
    //         await timePicker.toggle();
    //         await browser
    //             .actions()
    //             .mouseMove({ x: -500, y: 0 })
    //             .click()
    //             .perform();
    //         expect(await timePicker.overlay.isOpened()).toBe(false);
    //     });
    // });
});
