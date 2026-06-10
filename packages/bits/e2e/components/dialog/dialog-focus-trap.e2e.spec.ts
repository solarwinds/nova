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
import { DialogAtom } from "../dialog/dialog.atom";
import { SelectV2Atom } from "../select-v2/select-v2.atom";

test.describe("Dialog Focus Trap", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("dialog/dialog-visual-test", page);
    });

    test("should trap focus within the dialog and allow tabbing through elements", async ({
        page,
    }) => {
        const openDialogBtn = page.locator(
            "#nui-visual-test-default-dialog-btn"
        );

        // 1. Open the dialog
        await openDialogBtn.click();

        const dialog = page.locator(".modal-dialog").first();
        await expect(dialog).toBeVisible();

        // 2. Locate focusable elements in dialog
        const closeBtn = dialog.locator(".nui-button[icon='close']");
        const cancelBtn = dialog.locator(".btn-default").first(); // Cancel button
        const actionBtn = dialog.locator(".btn-primary");

        // 3. Verify initial focus is in dialog
        // Small delay to ensure focus containment is active
        await page.waitForTimeout(500);

        // We start by focusing the Cancel button to have a stable starting point
        await cancelBtn.focus();
        await expect(cancelBtn).toBeFocused();

        // 4. Tab forward: Cancel -> Action -> Close -> Cancel
        await page.keyboard.press("Tab");
        await expect(actionBtn).toBeFocused();

        await page.keyboard.press("Tab");
        await expect(closeBtn).toBeFocused();

        await page.keyboard.press("Tab");
        await expect(cancelBtn).toBeFocused();

        // 5. Tab backward: Cancel -> Close -> Action -> Cancel
        await page.keyboard.press("Shift+Tab");
        await expect(closeBtn).toBeFocused();

        await page.keyboard.press("Shift+Tab");
        await expect(actionBtn).toBeFocused();

        await page.keyboard.press("Shift+Tab");
        await expect(cancelBtn).toBeFocused();
    });
});
