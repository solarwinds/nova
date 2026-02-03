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

import {
    test,
    expect,
    Helpers,
    Animations,
} from "@nova-ui/bits/sdk/atoms-playwright";

import { StatusChartAtom } from "./status-chart.atom";

test.describe("Status chart", () => {
    const minIconSize: number = 10;
    const statusSeriesID = "1";
    let statusChartWithIcons: StatusChartAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("chart-types/status/test", page);
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        statusChartWithIcons = new StatusChartAtom(
            page.locator("#nui-status-chart-with-icons")
        );
    });

    test.describe("basic", () => {
        test("should display status bar series", async () => {
            // Basic presence check: status series container exists
            const seriesLocator = statusChartWithIcons
                .getLocator()
                .locator(`#data-${statusSeriesID}`);
            await expect(seriesLocator).toHaveCount(1);
        });

        test("should have expected number of data points", async () => {
            const allStatusBars =
                await statusChartWithIcons.getAllBarDataPointsBySeriesID(
                    statusSeriesID
                );
            expect(allStatusBars.length).toBe(8);
        });

        test("should display status bar data points", async () => {
            const allStatusBars =
                await statusChartWithIcons.getAllBarDataPointsBySeriesID(
                    statusSeriesID
                );
            for (const bar of allStatusBars) {
                await expect(bar.getLocator()).toBeVisible();
            }
        });

        test("should have default opacity", async () => {
            const allStatusBars =
                await statusChartWithIcons.getAllBarDataPointsBySeriesID(
                    statusSeriesID
                );
            for (const bar of allStatusBars) {
                expect(await bar.getOpacity()).toBe(1);
            }
        });
    });

    test.describe("interactions", () => {
        test("should hover a bar and keep default opacity + de-emphasize others", async () => {
            const allStatusBars =
                await statusChartWithIcons.getAllBarDataPointsBySeriesID(
                    statusSeriesID
                );

            const bar = await statusChartWithIcons.getStatusBarDataPointByIndex(
                statusSeriesID,
                5
            );
            await bar.hover();

            for (let idx = 0; idx < allStatusBars.length; idx++) {
                const b = allStatusBars[idx];
                if (idx !== 5) {
                    expect(await b.getOpacity()).toBeLessThan(1);
                } else {
                    expect(await b.getOpacity()).toBe(1);
                }
            }
        });
    });

    test.describe("content", () => {
        test("should contain an icon", async () => {
            const bar = await statusChartWithIcons.getStatusBarDataPointByIndex(
                statusSeriesID,
                -2
            );

            expect(await bar.hasIcon()).toBe(true);
        });

        test("should not display icon if one of its sizes is less than the icon's", async () => {
            const bar = await statusChartWithIcons.getStatusBarDataPointByIndex(
                statusSeriesID,
                0
            );

            const box = await bar.getLocator().boundingBox();
            const height = box?.height ?? 0;

            expect(height).toBeLessThan(minIconSize);
            expect(await bar.hasIcon()).toBe(
                false
            );
        });
    });

    test.describe("resize", () => {
        test("should hide icons on page or container resize", async ({ page }) => {
            // capture current viewport size (fallback to a sensible default if not set)
            const originalViewport = page.viewportSize() ?? { width: 1280, height: 720 };

            const bars = [
                await statusChartWithIcons.getStatusBarDataPointByIndex(
                    statusSeriesID,
                    1
                ),
                await statusChartWithIcons.getStatusBarDataPointByIndex(
                    statusSeriesID,
                    2
                ),
            ];

            await page.setViewportSize({ width: 340, height: 800 });

            expect(await bars[0].hasIcon()).toBe(false);
            expect(await bars[1].hasIcon()).toBe(false);

            await page.setViewportSize(originalViewport);
        });
    });
});
