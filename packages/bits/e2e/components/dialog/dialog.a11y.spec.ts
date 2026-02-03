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

import { DialogAtom } from "./dialog.atom";
import { test, Helpers } from "../../setup";

describe("a11y: dialog", () => {
    // disabling the rule until NUI-6014 is addressed
    const rulesToDisable: string[] = [
        "color-contrast",
        "scrollable-region-focusable", // consumers are responsible for taking care of their own content
    ];

    const dialogButtons = [
        "nui-visual-test-critical-dialog-btn",
        "nui-visual-test-warning-dialog-btn",
        "nui-visual-test-info-dialog-btn",
        "nui-visual-test-small-dialog-btn",
        "nui-visual-test-medium-dialog-btn",
        "nui-visual-test-large-dialog-btn",
        "nui-visual-test-confirmation-dialog-defaults-btn",
        "nui-visual-test-confirmation-dialog-overrides-btn",
        "nui-visual-test-responsive-dialog-btn",
    ];

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("dialog/dialog-visual-test", page);
    });

    for (const btnId of dialogButtons) {
        test(`should verify a11y of dialog: ${btnId}`, async ({ runA11yScan, page }) => {
            const btn = page.locator(`#${btnId}`);
            await btn.click();
            await runA11yScan(DialogAtom, rulesToDisable);
            await DialogAtom.dismissDialog();
        });
    }

    test("should verify a11y of confirmation dialog in dark theme", async ({ runA11yScan, page }) => {
        await Helpers.switchDarkTheme("on");
        const btn = page.locator("#nui-visual-test-confirmation-dialog-overrides-btn");
        await btn.click();
        await runA11yScan(DialogAtom, rulesToDisable);
        await DialogAtom.dismissDialog();
        await Helpers.switchDarkTheme("off");
    });
});
