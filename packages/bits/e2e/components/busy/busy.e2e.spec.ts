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

import { BusyAtom } from "./busy.atom";
import { Atom } from "../../atom";
import { expect, Helpers, test } from "../../setup";
import { ButtonAtom } from "../button/button.atom";
import { SelectAtom } from "../select/select.atom";

test.describe("USERCONTROL Busy", () => {
    let busy: BusyAtom;
    let busyBtn: ButtonAtom;
    let select: SelectAtom;

    // Ensure correct type for busyById
    const busyById = (id: string): BusyAtom =>
        Atom.findIn(BusyAtom, Helpers.page.locator(`#${id}`)) as BusyAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("busy/busy-test", page);
        busyBtn = Atom.find<ButtonAtom>(ButtonAtom, "nui-busy-test-button");
        busy = busyById("nui-busy-test-basic");
        select = Atom.findIn<SelectAtom>(
            SelectAtom,
            Helpers.page.locator("#nui-busy-select-overlay"),
            true
        );
        await busyBtn.toBeVisible();
    });

    test("should append container to the attached element", async () => {
        expect(await busy.isAppended()).toBe(true);
    });

    test("should not container be visible when inactive", async () => {
        expect(await busy.isDisplayed()).toBe(false);
    });

    test.describe("Busy overlaps and tab navigation", () => {
        test.beforeEach(async () => {
            await busyBtn.click();
        });

        test.afterEach(async () => {
            await busyBtn.click();
        });

        test("in default mode shows spinner", async () => {
            const spinner = busy.getSpinner();
            await spinner.waitForDisplayed();
            await spinner.toBeVisible();
        });

        test("in progress mode shows progress bar", async () => {
            const progress = busyById("nui-busy-test-progress").getProgress();
            await progress.waitForDisplayed();
            await progress.toBeVisible();
        });

        test("any appended to body popup (select) should not be overlapped by busy", async () => {
            await select.toggleMenu();
            const item = Helpers.page.locator(
                ".nui-select-popup-host .nui-menu-item",
                { hasText: "Item 2" }
            );
            await item.click();
            expect(await select.input.innerText()).toBe("Item 2");
        });

        test("should NOT allow tab navigation when component is busy", async () => {
            await select.getLocator().click();
            // Focus should not be on the last button
            const busyBtnId = await busyBtn.getLocator().getAttribute("id");
            const activeId = await Helpers.page.evaluate(
                () => document.activeElement?.id
            );
            expect(activeId).not.toEqual(busyBtnId);
            await Helpers.page.keyboard.press("Tab");
            // Now focus should be on the last button
            const activeIdAfter = await Helpers.page.evaluate(
                () => document.activeElement?.id
            );
            expect(activeIdAfter).toEqual(busyBtnId);
        });

        test("should allow tab navigation when component is NOT busy", async () => {
            await busyBtn.click(); // deactivate busy
            await select.getLocator().click();
            await Helpers.page.keyboard.press("Tab");
            const activeId = await Helpers.page.evaluate(
                () => document.activeElement?.id
            );
            expect(activeId).toEqual("focusable-button-inside-busy-component");
        });
    });
});
