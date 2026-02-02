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

import { SpinnerAtom } from "./spinner.atom";
import { test, Helpers, Animations } from "../../setup";

describe("a11y: spinner", () => {
    const rulesToDisable: string[] = [];

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("spinner/spinner-visual-test", page);
        await Helpers.disableCSSAnimations(Animations.ALL);
        // Wait until there are 9 SpinnerAtom instances on the page
        await Helpers.page.waitForFunction(async () => {
            const count = await SpinnerAtom.findIn(SpinnerAtom, Helpers.page.locator("body"), true).getLocator().count();
            return count === 9;
        });
    });

    test("should check a11y of spinner", async ({ runA11yScan }) => {
        await runA11yScan(SpinnerAtom, rulesToDisable);
    });
});
