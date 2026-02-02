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

import { Locator } from "playwright-core";

import { SelectV2Atom } from "./select-v2.atom";
import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";
import { DialogAtom } from "../dialog/dialog.atom";
import { OverlayAtom } from "../overlay/overlay.atom";
import { SwitchAtom } from "../switch/switch.atom";

test.describe("USERCONTROL Select V2 >", () => {
    let selectBasic: SelectV2Atom;
    let selectErrorState: SelectV2Atom;
    let selectCustomControl: SelectV2Atom;
    let selectInsideDialog: SelectV2Atom;

    let buttonShow: Locator;
    let buttonHide: Locator;
    let buttonToggle: Locator;
    let buttonDialog: Locator;

    let switchToOutsideClicksEnabled: SwitchAtom;

    let focusdrop: Locator;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("select-v2/test", page);
    });

    test.beforeEach(() => {
        selectBasic = Atom.find<SelectV2Atom>(SelectV2Atom, "basic");
        selectErrorState = Atom.find<SelectV2Atom>(SelectV2Atom, "error-state");
        selectCustomControl = Atom.find<SelectV2Atom>(
            SelectV2Atom,
            "custom-control"
        );
        selectInsideDialog = Atom.find<SelectV2Atom>(
            SelectV2Atom,
            "inside-dialog"
        );

        buttonShow = Helpers.page.locator("#show");
        buttonHide = Helpers.page.locator("#hide");
        buttonToggle = Helpers.page.locator("#toggle");
        buttonDialog = Helpers.page.locator("#dialog-btn");

        switchToOutsideClicksEnabled = Atom.find<SwitchAtom>(
            SwitchAtom,
            "switch"
        );

        focusdrop = Atom.findIn(
            Atom,
            Helpers.page.locator(".select-test-focus-drop")
        ).getLocator();
    });

    test.describe("select-v2 >", () => {
        test.describe("custom control", () => {
            test("should not be clickable", async () => {
                await selectCustomControl.click();
                await selectCustomControl.popup.toNotBeOpened();
            });

            test("should not close on outside click is toggled", async () => {
                await buttonShow.click();
                await focusdrop.click({ force: true });
                await selectCustomControl.popup.toBeOpened();
            });

            test("should close if hide is initiated", async () => {
                await buttonShow.click();
                await selectCustomControl.popup.toBeOpened();
                expect(await selectCustomControl.isOpened()).toBe(true);
                await buttonHide.click();
                await selectCustomControl.popup.toBeHidden();
            });

            test("should toggle and close on outside click", async () => {
                await switchToOutsideClicksEnabled.toggle();
                await buttonToggle.click();
                await focusdrop.click({ force: true });

                await selectCustomControl.popup.toBeHidden();
            });

            test("should scroll to active option on click", async () => {
                await selectBasic.click();
                const option = await selectBasic.getOption(40);
                await option.click();
                await selectBasic.click();
                // Use .popup as Locator
                const container = selectBasic.popup.getLocator();
                const containerBox = await container.boundingBox();
                const optionBox = await option.getLocator().boundingBox();
                const isOptionVisibleInScrollBox =
                    optionBox &&
                    containerBox &&
                    optionBox.y > containerBox.y &&
                    optionBox.y < containerBox.y + containerBox.height;
                expect(isOptionVisibleInScrollBox).toBeTruthy();
            });
        });

        test.describe("keyboard navigation", () => {
            test.beforeEach(async () => {
                await selectBasic.toBeVisible();
                await Helpers.page.keyboard.press("Tab");
            });

            test.afterEach(async () => {
                await focusdrop.click({ force: true });
            });

            test("should toggle", async () => {
                await selectErrorState.toBeOpened();
            });

            test("should only one item be active", async () => {
                expect(await selectErrorState.getActiveItemsCount()).toBe(1);
            });

            test("should navigate with UP and DOWN buttons", async () => {
                await Helpers.pressKey("ArrowDown", 5);
                const option5 = await selectErrorState.getOption(5);
                await option5.isActive();

                await Helpers.page.keyboard.press("ArrowUp");
                const option4 = await selectErrorState.getOption(4);
                await option4.isActive();
            });

            test("should close on focus out", async () => {
                await Helpers.page.keyboard.down("Shift");
                await Helpers.page.keyboard.press("Tab");
                await Helpers.page.keyboard.up("Shift");
                await selectErrorState.toBeHidden();
            });

            test("should close on ESC button", async () => {
                await Helpers.page.keyboard.press("Escape");
                await selectErrorState.toBeHidden();
            });

            test("should open on DOWN button after ESC", async () => {
                await Helpers.page.keyboard.press("Escape");
                await Helpers.page.keyboard.press("ArrowDown");
                await selectErrorState.toBeOpened();
            });

            test("should select on ENTER", async () => {
                await Helpers.page.keyboard.press("ArrowDown");
                await Helpers.page.keyboard.press("ArrowDown");
                await Helpers.page.keyboard.press("Enter");
                await selectErrorState.toBeHidden();
                await expect(selectErrorState.input).toHaveText("Item 2");
            });
            test("should reach the bottom of the list on PAGE_DOWN button pressed", async () => {
                const lastItem = await selectErrorState.getLastOption();
                const lastItemText = await lastItem.getLocator().textContent();
                await Helpers.page.keyboard.press("PageDown");
                await Helpers.page.keyboard.press("Enter");
                await expect(selectErrorState.input).toHaveText(
                    lastItemText || ""
                );
            });
            test("should reach the top of the list on PAGE_UP button pressed", async () => {
                const firstItem = await selectErrorState.getFirstOption();
                const firstItemText = await firstItem
                    .getLocator()
                    .textContent();
                await Helpers.page.keyboard.press("PageDown");
                await Helpers.page.keyboard.press("PageUp");
                await Helpers.page.keyboard.press("Enter");
                await expect(selectErrorState.input).toHaveText(
                    firstItemText || ""
                );
            });
        });

        test.describe("work with modals and overlays", () => {
            test("should remove overlay if select gets destroyed", async () => {
                await buttonDialog.click();
                await selectInsideDialog.toggle();
                await DialogAtom.dismissDialog();
                const overlay = Helpers.page.locator(
                    OverlayAtom.CDK_CONTAINER_PANE
                );
                await expect(overlay).toHaveCount(0);
            });
        });
    });
});
