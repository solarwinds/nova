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
import { test, expect, Helpers } from "../../setup";
import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";

test.describe("USERCONTROL Spinner", () => {
    const spinnerDelay = 500;

    let delayedSpinner: SpinnerAtom;
    let spinner2: SpinnerAtom;
    let delayedButton: ButtonAtom;
    let button2: ButtonAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("/spinner/spinner-test", page);
        delayedSpinner = Atom.find<SpinnerAtom>(SpinnerAtom, "spinner1");
        spinner2 = Atom.find<SpinnerAtom>(SpinnerAtom, "spinner2");
        delayedButton = Atom.find<ButtonAtom>(ButtonAtom, "spinnerButton1");
        button2 = Atom.find<ButtonAtom>(ButtonAtom, "spinnerButton2");
    });

    test("will be hidden when show is undefined", async () => {
        await spinner2.waitForHidden();
    });

    test.describe("will show/hide based on property", () => {
        test("with delayed set", async () => {
            await delayedSpinner.toBeHidden();
            await delayedButton.click();
            await delayedSpinner.waitForDisplayed(spinnerDelay * 2);
            await delayedButton.click();
            await delayedSpinner.toBeHidden();
        });

        test("without delay", async () => {
            await spinner2.toBeHidden();
            await button2.click();
            await spinner2.waitForDisplayed(SpinnerAtom.defaultDelay * 2);
            await button2.click();
            await spinner2.toBeHidden();
        });
    });

    test("should have 'small' default size if no 'size' input provided", async () => {
        await button2.click();
        await spinner2.waitForDisplayed(SpinnerAtom.defaultDelay * 2);
        await expect(spinner2.getLocator()).toHaveClass(
            /nui-spinner__container--small/
        );
    });

    test("will respect size", async () => {
        await button2.click();
        await spinner2.waitForDisplayed(SpinnerAtom.defaultDelay * 2);
        const size = await spinner2.getSize();
        expect(size.width).toBe(20);
        expect(size.height).toBe(20);
    });

    test.skip("will wait for display", async ({ page }) => {
        const startPoint: number = await page.evaluate(() => performance.now());
        await delayedButton.click();
        await delayedSpinner.toBeHidden();
        await delayedSpinner.waitForDisplayed(spinnerDelay * 2);
        const endPoint: number = await page.evaluate(() => performance.now());
        expect(endPoint - startPoint).toBeGreaterThan(spinnerDelay);
    });
});
