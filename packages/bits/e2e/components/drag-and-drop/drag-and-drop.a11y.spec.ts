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

import { CdkDraggableItemAtom } from "./cdk-drop-item.atom";
import { CdkDropListAtom } from "./cdk-drop-list.atom";
import { Helpers, test } from "../../setup";

const rulesToDisable: string[] = ["color-contrast"];

test.describe("a11y: drag-and-drop", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser(
            "external-libraries/drag-and-drop/dropzone-visual",
            page
        );
    });

    test("should check a11y of draggable item", async ({ runA11yScan }) => {
        await runA11yScan(CdkDraggableItemAtom, rulesToDisable);
    });

    test("should check a11y of drop list", async ({ runA11yScan }) => {
        await runA11yScan(CdkDropListAtom, rulesToDisable);
    });
});
