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
import { PaginatorAtom } from "./paginator.atom";
import { test, Helpers } from "../../setup";

test.describe("a11y: paginator", () => {
    const rulesToDisable: string[] = ["nested-interactive"];

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("paginator/paginator-visual-test", page);
    });

    test("should check a11y of paginator", async ({ runA11yScan }) => {
        await runA11yScan(PaginatorAtom, rulesToDisable);
    });
});

test.describe("a11y: virtualized paginator", () => {
    [false, true].forEach(appendToBody => {
        test(`should check the open popup with appendToBody=${appendToBody}`, async ({
            page,
            runA11yScan,
        }) => {
            await Helpers.prepareBrowser("paginator/paginator-test", page);
            await page
                .locator("#nui-demo-virtualized-paginators")
                .evaluate(element => {
                    (element as HTMLElement).style.display = "block";
                });
            const id = appendToBody
                ? "#nui-demo-body-virtualized-paginator"
                : "#nui-demo-virtualized-paginator";
            await page.locator(id).locator(".nui-paginator__dots").focus();
            await page.keyboard.press("Enter");
            await runA11yScan("cdk-virtual-scroll-viewport");
        });
    });
});
