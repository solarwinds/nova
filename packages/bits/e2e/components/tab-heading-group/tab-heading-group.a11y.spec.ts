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

import { Helpers, expect, test } from "../../setup";
import { Atom } from "../../atom";
import { TabHeadingGroupAtom } from "./tab-heading-group.atom";
import { TabHeadingAtom } from "./tab-heading.atom";

test.describe("a11y: tab-heading-group", () => {
    const rulesToDisable: string[] = [
        "color-contrast", // NUI-6014
    ];

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("tabgroup/tabgroup-test", page);
    });

    test("should expose overflowing tabs after keyboard navigation", async ({
        page,
        runA11yScan,
    }) => {
        const group = Atom.findIn<TabHeadingGroupAtom>(
            TabHeadingGroupAtom,
            page.locator("#nui-demo-visual-tabgroup-responsive")
        );
        const firstTab = await group.getFirstTab();
        const lastTab = await group.getLastTab();
        await firstTab.getLocator().focus();
        await page.keyboard.press("End");
        await expect(lastTab.getLocator()).toBeFocused();
        await group.toHaveTabInView(lastTab);
        await runA11yScan(
            "#nui-demo-visual-tabgroup-responsive",
            rulesToDisable
        );
    });

    test("should check a11y of tab-heading", async ({ runA11yScan }) => {
        await runA11yScan(TabHeadingAtom, rulesToDisable);
    });

    test("should check a11y of tab-heading-group", async ({ runA11yScan }) => {
        await runA11yScan(TabHeadingGroupAtom, rulesToDisable);
    });
});
