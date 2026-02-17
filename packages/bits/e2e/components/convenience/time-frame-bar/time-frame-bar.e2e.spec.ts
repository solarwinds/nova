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

import moment from "moment/moment";

import { expect, test, Helpers, Animations } from "../../../setup";
import { TimeFrameBarTestPage } from "./time-frame-bar-test.po";

test.describe("CONVENIENCE COMPONENTS", () => {
    test.describe("TimeFrameBar", () => {
        let page: TimeFrameBarTestPage;

        const baseDate = moment([2018, 5, 1, 15, 0, 0]);
        const minDate = baseDate.clone().subtract(1, "month");
        const maxDate = moment([2050]);

        test.beforeEach(async ({ page: pwPage }) => {
            await Helpers.prepareBrowser("convenience/time-frame-bar/test", pwPage);
            await Helpers.disableCSSAnimations(Animations.ALL);

            page = new TimeFrameBarTestPage();
            await page.reset();
        });

        test("should have 'prev' and 'next' buttons enabled by default", async () => {
            await expect(page.timeFrameBar.nextButton.getLocator()).not.toBeDisabled();
            await expect(page.timeFrameBar.prevButton.getLocator()).not.toBeDisabled();
        });

        test("should not show 'undo' and 'clear' buttons by default", async () => {
            await expect(page.timeFrameBar.undoButton.getLocator()).toHaveCount(0);
            await expect(page.timeFrameBar.clearButton.getLocator()).toHaveCount(0);
        });

        test("should show just 'clear' button after zoom in once", async () => {
            await page.zoomIn();

            await expect(page.timeFrameBar.undoButton.getLocator()).toHaveCount(0);
            await expect(page.timeFrameBar.clearButton.getLocator()).toBeVisible();
        });

        test("should show both 'undo' and 'clear' buttons after zoom in twice", async () => {
            await page.zoomIn();
            await page.zoomIn();

            await expect(page.timeFrameBar.undoButton.getLocator()).toBeVisible();
            await expect(page.timeFrameBar.clearButton.getLocator()).toBeVisible();
        });

        test.describe("should reset zoom after", () => {
            test.beforeEach(async () => {
                await page.zoomIn();
                await page.zoomIn();

                await expect(page.timeFrameBar.undoButton.getLocator()).toBeVisible();
                await expect(page.timeFrameBar.clearButton.getLocator()).toBeVisible();
            });

            test.afterEach(async () => {
                await expect(
                    page.timeFrameBar.undoButton.getLocator()
                ).toBeHidden();
                await expect(page.timeFrameBar.clearButton.getLocator()).toBeHidden();
            });

            test("shifting to earlier time frame", async () => {
                await page.timeFrameBar.prevButton.click();
            });

            test("shifting to later time frame", async () => {
                await page.timeFrameBar.nextButton.click();
            });

            test("selecting new preset from quick picker", async () => {
                await page.timeFrameBar.quickPickPreset("Last 7 days");
            });

            test("setting new time range with time frame picker", async () => {
                await page.timeFrameBar.pickTimeFrame(
                    baseDate.clone().subtract(3, "weeks"),
                    baseDate.clone()
                );
            });
        });

        test.describe("when time frame is out of limits", () => {
            test("should disable 'prev' button", async () => {
                await page.timeFrameBar.pickTimeFrame(minDate, baseDate.clone());

                await expect(page.timeFrameBar.prevButton.getLocator()).toBeDisabled();
                await expect(page.timeFrameBar.nextButton.getLocator()).not.toBeDisabled();
            });

            test("should disable 'next' button", async () => {
                await page.timeFrameBar.pickTimeFrame(baseDate.clone(), maxDate);

                await expect(page.timeFrameBar.nextButton.getLocator()).toBeDisabled();
                await expect(page.timeFrameBar.prevButton.getLocator()).not.toBeDisabled();
            });
        });
    });
});
