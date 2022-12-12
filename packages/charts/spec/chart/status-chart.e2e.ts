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

import { browser } from "protractor";

import { Atom } from "@nova-ui/bits/sdk/atoms";
import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { SeriesAtom } from "./atoms/series.atom";
import { StatusBarDataPointAtom } from "./atoms/status-bar-data-point.atom";
import { StatusChartAtom } from "./status-chart.atom";

describe("Status chart", () => {
    const minIconSize: number = 10;
    const statusSeriesID = "1";
    let statusChartWithIcons: StatusChartAtom;
    let allStatusBars: StatusBarDataPointAtom[];

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/status/test");
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );
        statusChartWithIcons = Atom.find(
            StatusChartAtom,
            "nui-status-chart-with-icons"
        );
        allStatusBars =
            await statusChartWithIcons.getAllBarDataPointsBySeriesID(
                statusSeriesID
            );
    });

    describe("basic",  () => {
        it("should display status bar series", async () => {
            const series = await statusChartWithIcons.getDataSeriesById(
                SeriesAtom,
                statusSeriesID
            );
            await expect(await series?.isDisplayed()).toBe(true);
        });

        it("should have expected number of data points", async () => {
            await expect(allStatusBars.length).toBe(8);
        });

        it("should display status bar data points", async () => {
            for (const bar of allStatusBars) {
                await expect(await bar.isDisplayed()).toBe(true);
            }
        });

        it("should have default opacity", async () => {
            for (const bar of allStatusBars) {
                await expect(await bar.getOpacity()).toBe(1);
            }
        });
    });

    describe("interactions",  () => {
        it("should hover a bar and keep default opacity + de-emphasize others", async () => {
            const bar = await statusChartWithIcons.getStatusBarDataPointByIndex(
                statusSeriesID,
                5
            );
            await bar.hover();
            for (let idx = 0; idx < allStatusBars.length; idx++) {
                const b = allStatusBars[idx];
                if (idx !== 5) {
                    await expect(await b.getOpacity()).toBeLessThan(1);
                } else {
                    await expect(await b.getOpacity()).toBe(1);
                }
            }
        });
    });

    describe("content",  () => {
        it("should contain an icon", async () => {
            const bar = await statusChartWithIcons.getStatusBarDataPointByIndex(
                statusSeriesID,
                -2
            );

            await expect(await bar.hasIcon()).toBe(true);
        });

        it("should not display icon if one of its sizes is less than the icon's", async () => {
            const bar = await statusChartWithIcons.getStatusBarDataPointByIndex(
                statusSeriesID,
                0
            );
            const barSize = await bar.getElement().getSize();

            await expect(barSize.height).toBeLessThan(minIconSize);
            await expect(await bar.hasIcon()).toBe(
                false,
                "Icon is displayed despite bar height is less than the min icon size!"
            );
        });
    });

    describe("resize",  () => {
        it("should hide icons on page or container resize", async (done) => {
            const originalSize = await browser.manage().window().getSize();
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

            await browser.manage().window().setSize(340, 800);

            await expect(await bars[0].hasIcon()).toBe(false);
            await expect(await bars[1].hasIcon()).toBe(false);

            await browser
                .manage()
                .window()
                .setSize(originalSize.width, originalSize.height);
            done();
        });
    });
});
