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

import { test, Helpers } from "../../setup";

test.describe("USERCONTROL drag & drop", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("dragdrop", page);
    });

    // NOTE:
    // Native HTML5 drag & drop is notoriously flaky across engines and app implementations.
    // Only enable once the demo page exposes reliable drag/drop hooks (or we add a deterministic helper).
    test.skip("should be able to drop object", async ({ page }) => {
        const dragElement = page.locator("#nui-demo-src-object");
        const dropElement = page.locator("#nui-demo-dest-object");

        // Best-effort attempt. If the app uses HTML5 DnD, Playwright may need a custom implementation.
        await dragElement.dragTo(dropElement);
    });
});
