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
import { test, expect, Helpers } from "../../setup";
import { SorterAtom } from "./sorter.atom";
import { ButtonAtom } from "../button/button.atom";
import { IconAtom } from "../icon/icon.atom";

test.describe("USERCONTROL Sorter >", () => {
    let sorter: SorterAtom;
    let button: ButtonAtom;
    let icon: IconAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("sorter/sorter-test", page);
        sorter = Atom.find<SorterAtom>(SorterAtom, "nui-demo-sorter", true);
        button = sorter.sorterButton;
        icon = button.getIcon();

        // Ensure sorter is collapsed and reset to default state
        if (await sorter.overlay.isOpened()) {
            await sorter.toggle();
        }
        if ((await sorter.displayValue.textContent()) !== "Year") {
            await sorter.select("Year");
        }
        if ((await icon.getName()) === "arrow-down") {
            await button.click();
        }
    });

    test.describe("sorter >", () => {
        test("should contain expected items", async () => {
            await sorter.toggle();
            await sorter.toBeExpanded();
            await sorter.toHaveItemCount(3);
            await expect(sorter.itemByIndex(0)).toHaveText("Title");
            await expect(sorter.itemByIndex(1)).toHaveText("Year");
            await expect(sorter.itemByIndex(2)).toHaveText("Director");
        });

        test("should change icon direction on click", async () => {
            await button.click();
            expect(await icon.getName()).toBe("arrow-down");
        });

        test("should have correct text in caption", async () => {
            await sorter.toHaveLabel("Sorter Caption");
        });

        test.describe("when a value is picked from select, it", () => {
            const selectedColumn = "Title";

            test.beforeEach(async () => {
                await sorter.select(selectedColumn);
            });

            test("should display selected item on sorter button", async () => {
                await sorter.toHaveValue(selectedColumn);
            });

            // TODO: Enable in scope of NUI-4879
            test("should mark the selected item in the select menu", async () => {
                await sorter.toggle();
                await sorter.toBeExpanded();
                await expect(sorter.selectedItems).toHaveCount(1);
                await expect(sorter.selectedItems.first()).toHaveText("Title");
            });
        });

        test.describe("key navigation >", () => {
            test("should close sorter menu when navigating from it by TAB key", async () => {
                await sorter.toggle();
                await sorter.toBeExpanded();
                await Helpers.pressKey("Tab");
                await sorter.toBeCollapsed();
            });

            // TODO Change this test in the scope of NUI-6132
            test("should close sorter menu by ESCAPE key, open by ENTER, and select first item", async () => {
                await sorter.toggle();
                await sorter.toBeExpanded();
                await Helpers.pressKey("Escape");
                await sorter.toBeCollapsed();
                await Helpers.pressKey("Enter");
                await Helpers.pressKey("ArrowDown");
                await Helpers.pressKey("Enter");
                await sorter.toHaveValue("Title");
            });

            // TODO Change this test in the scope of NUI-6132
            test("should select sort items by keyboard", async () => {
                await sorter.toggle();
                await Helpers.pressKey("ArrowDown", 3);
                await Helpers.pressKey("Enter");
                await sorter.toHaveValue("Director");
                await Helpers.pressKey("Enter");
                await Helpers.pressKey("ArrowDown", 2);
                await Helpers.pressKey("ArrowUp");
                await Helpers.pressKey("Enter");
                await sorter.toHaveValue("Title");
            });
        });
    });
});
