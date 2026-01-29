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
import { ButtonAtom } from "../button/button.atom";
import { ProgressAtom } from "./progress.atom";
import { TooltipAtom } from "../../directives/tooltip/tooltip.atom";
import { test, expect, Helpers } from "../../setup";

test.describe("USERCONTROL progress", () => {
    let indeterminateProgress: ProgressAtom;
    let compactProgress: ProgressAtom;
    let compactProgressBtn: ButtonAtom;
    let startBtn: ButtonAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("progress/progress-test", page);
        indeterminateProgress = Atom.find<ProgressAtom>(ProgressAtom, "nui-demo-indeterminate-progress");
        compactProgress = Atom.find<ProgressAtom>(ProgressAtom, "nui-demo-compact-progress");
        compactProgressBtn = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-compact-progress", false);
        startBtn = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-indeterminate-progress-btn", false);
    });

    test.describe("stacked header progress", () => {
        test.beforeEach(async () => {
            await startBtn.toBeVisible();
            await startBtn.click();
        });

        test("should show cancel button when allow-cancel is true and progress run and hide when cancel button clicked", async () => {
            expect(await indeterminateProgress.canCancel()).toBe(true);
            await indeterminateProgress.getCancelButton().click();
            expect(await indeterminateProgress.canCancel()).toBe(false);
        });

        test("should be possible to display tooltip on close button", async ({ page }) => {
            await indeterminateProgress.getCancelButton().getLocator().hover();
            const buttonTooltip = Atom.findIn<TooltipAtom>(TooltipAtom, page.locator(".cdk-overlay-container"));
            await buttonTooltip.waitToBeDisplayed();
            expect(await buttonTooltip.isTooltipDisplayed()).toBeTruthy();
            expect(await buttonTooltip.getTooltipText()).toContain("Cancel");
            // Return to initial state
            await indeterminateProgress.getCancelButton().click();
            expect(await indeterminateProgress.canCancel()).toBe(false);
        });
    });

    test.describe("compact progress", () => {
        test.beforeEach(async () => {
            await compactProgressBtn.toBeVisible();
            await compactProgressBtn.click();
        });

        test("should show and hide progress bar when click button in compact progress", async () => {
            expect(await compactProgress.isProgressBarDisplayed()).toBe(true);
            await compactProgressBtn.click();
            await compactProgress.toBeHidden();
        });
    });
});
