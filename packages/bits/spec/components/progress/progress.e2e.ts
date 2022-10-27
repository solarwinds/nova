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

import { browser, by, element, ExpectedConditions } from "protractor";

import { Atom } from "../../atom";
import { TooltipAtom } from "../../directives/public_api";
import { Helpers } from "../../helpers";
import { ButtonAtom } from "../button/button.atom";
import { ProgressAtom } from "../public_api";

describe("USERCONTROL progress", () => {
    let indeterminateProgress: ProgressAtom;
    let compactProgress: ProgressAtom;
    let compactProgressBtn: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("progress/progress-test");
        indeterminateProgress = Atom.find(
            ProgressAtom,
            "nui-demo-indeterminate-progress"
        );
        compactProgress = Atom.find(ProgressAtom, "nui-demo-compact-progress");
        compactProgressBtn = Atom.findIn(
            ButtonAtom,
            element(by.buttonText("Start/stop progress"))
        );
    });

    describe("stacked header progress", () => {
        beforeEach(async () => {
            const startBtn = element(
                by.id("nui-demo-indeterminate-progress-btn")
            );
            await browser.wait(ExpectedConditions.visibilityOf(startBtn), 3000);
            await startBtn.click();
        });

        it("should show cancel button when allow-cancel is true and progress run and hide when cancel button clicked", async () => {
            expect(await indeterminateProgress.canCancel()).toBe(true);
            await indeterminateProgress.getCancelButton().click();
            expect(await indeterminateProgress.canCancel()).toBe(false);
        });

        it("should be possible to display tooltip on close button", async () => {
            await indeterminateProgress.getCancelButton().hover();
            const buttonTooltip = Atom.findIn(
                TooltipAtom,
                element(by.className("cdk-overlay-container"))
            );
            await buttonTooltip.waitToBeDisplayed();
            expect(await buttonTooltip.isTooltipDisplayed()).toBeTruthy();
            expect(await buttonTooltip.getTooltipText()).toContain("Cancel");
            // Return to initial state
            await indeterminateProgress.getCancelButton().click();
            expect(await indeterminateProgress.canCancel()).toBe(false);
        });
    });

    describe("compact progress", () => {
        beforeEach(async () => {
            await compactProgressBtn.click();
        });

        it("should show and hide progress bar when click button in compact progress", async () => {
            expect(await compactProgress.isProgressBarDisplayed()).toBe(true);
            await compactProgressBtn.click();
            expect(await compactProgress.isDisplayed()).toBe(false);
        });
    });
});
