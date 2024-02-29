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

import { browser, by, element, ElementFinder, Key } from "protractor";

import { SelectV2Atom } from "./select-v2.atom";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { DialogAtom } from "../dialog/dialog.atom";
import { OverlayAtom } from "../overlay/overlay.atom";
import { SwitchAtom } from "../switch/switch.atom";

describe("USERCONTROL Select V2 >", () => {
    let selectBasic: SelectV2Atom;
    let selectErrorState: SelectV2Atom;
    let selectCustomControl: SelectV2Atom;
    let selectInsideDialog: SelectV2Atom;

    let buttonShow: ElementFinder;
    let buttonHide: ElementFinder;
    let buttonToggle: ElementFinder;
    let buttonDialog: ElementFinder;

    let switchToOutsideClicksEnabled: SwitchAtom;

    let focusdrop: ElementFinder;

    beforeAll(() => {
        selectBasic = Atom.find(SelectV2Atom, "basic");
        selectErrorState = Atom.find(SelectV2Atom, "error-state");
        selectCustomControl = Atom.find(SelectV2Atom, "custom-control");
        selectInsideDialog = Atom.find(SelectV2Atom, "inside-dialog");

        buttonShow = element(by.id("show"));
        buttonHide = element(by.id("hide"));
        buttonToggle = element(by.id("toggle"));
        buttonDialog = element(by.id("dialog-btn"));

        switchToOutsideClicksEnabled = Atom.findIn(
            SwitchAtom,
            element(by.id("switch"))
        );

        focusdrop = element(by.className("select-test-focus-drop"));
    });

    beforeAll(async () => {
        await Helpers.prepareBrowser("select-v2/test");
    });

    describe("select-v2 >", () => {
        describe("custom control", () => {
            it("should not be clickable", async () => {
                await selectCustomControl.click();
                await expect(await selectCustomControl.isOpened()).toBe(false);
            });

            it("should not close on outside click is toggled", async () => {
                await buttonShow.click();
                await focusdrop.click();
                await expect(await selectCustomControl.isOpened()).toBe(true);
            });

            it("should close if hide is initiated", async () => {
                await buttonHide.click();
                await expect(await selectCustomControl.isOpened()).toBe(false);
            });

            it("should toggle and close on outside click", async () => {
                await switchToOutsideClicksEnabled.toggle();
                await buttonToggle.click();
                await focusdrop.click();

                await expect(await selectCustomControl.isOpened()).toBe(false);
            });

            it("should scroll to active option on click", async () => {
                await selectBasic.click();

                const option = await selectBasic.getOption(40);

                await option.click();
                await selectBasic.click();

                // Detect when option within a scrollable div are in view
                // https://stackoverflow.com/questions/16308037/detect-when-elements-within-a-scrollable-div-are-out-of-view
                const containerHeight = (
                    await selectBasic.getPopupElement().getSize()
                ).height;
                const containerTop = +(await selectBasic
                    .getPopupElement()
                    .getAttribute("scrollTop"));
                const optionTop = +(await option
                    .getElement()
                    .getAttribute("offsetTop"));

                const isOptionVisibleInScrollBox =
                    optionTop > containerTop &&
                    optionTop < containerTop + containerHeight;

                expect(isOptionVisibleInScrollBox).toBeTruthy();
            });
        });

        describe("keyboard navigation", () => {
            beforeAll(async () => {
                await browser.refresh();
            });

            beforeEach(async () => {
                await Helpers.pressKey(Key.TAB);
            });

            afterEach(async () => {
                await focusdrop.click();
            });

            it("should toggle", async () => {
                await expect(await selectErrorState.isOpened()).toBe(true);
            });

            it("should only one item be active", async () => {
                await expect(await selectErrorState.getActiveItemsCount()).toBe(
                    1
                );
            });

            it("should navigate with UP and DOWN buttons", async () => {
                await Helpers.pressKey(Key.DOWN, 5);
                await expect(
                    await (await selectErrorState.getOption(5)).isActive()
                ).toBe(true);

                await Helpers.pressKey(Key.UP);
                await expect(
                    await (await selectErrorState.getOption(4)).isActive()
                ).toBe(true);
            });

            it("should close on focus out", async () => {
                await Helpers.pressKey(Key.chord(Key.SHIFT, Key.TAB));
                await expect(await selectErrorState.isOpened()).toBe(false);
            });

            it("should close on ESC button", async () => {
                await Helpers.pressKey(Key.ESCAPE);
                await expect(await selectErrorState.isOpened()).toBe(false);
            });

            it("should open on up DOWN button", async () => {
                await Helpers.pressKey(Key.ESCAPE);
                await Helpers.pressKey(Key.DOWN);
                await expect(await selectErrorState.isOpened()).toBe(true);
            });

            it("should select on ENTER", async () => {
                await Helpers.pressKey(Key.DOWN, 2);
                await Helpers.pressKey(Key.ENTER);

                await expect(await selectErrorState.isOpened()).toBe(
                    false,
                    "Popup wasn't closed after selection!"
                );
                await expect(await selectErrorState.getInputText()).toEqual(
                    "Item 2"
                );
            });

            it("should reach the bottom of the list on PAGE_DOWN button pressed", async () => {
                const lastItemText = await (
                    await selectErrorState.getLastOption()
                )
                    .getElement()
                    .getText();
                await Helpers.pressKey(Key.PAGE_DOWN);
                await Helpers.pressKey(Key.ENTER);

                await expect(await selectErrorState.getInputText()).toEqual(
                    lastItemText
                );
            });

            it("should reach the bottom of the list on PAGE_UP button pressed", async () => {
                const firstItemText = await (
                    await selectErrorState.getFirstOption()
                )
                    .getElement()
                    .getText();
                await Helpers.pressKey(Key.PAGE_DOWN);
                await Helpers.pressKey(Key.PAGE_UP);
                await Helpers.pressKey(Key.ENTER);

                await expect(await selectErrorState.getInputText()).toEqual(
                    firstItemText
                );
            });
        });

        describe("work with modals and overlays", () => {
            it("should remove overlay if select gets destroyed", async () => {
                await buttonDialog.click();
                await selectInsideDialog.toggle();
                await DialogAtom.dismissDialog();

                expect(await OverlayAtom.cdkContainerPane.isPresent()).toBe(
                    false
                );
            });
        });
    });
});
