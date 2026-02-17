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

import { Locator } from "@playwright/test";

import { Animations, expect, Helpers, test } from "@nova-ui/bits/sdk/atoms-playwright";

import { RadialSeriesAtom } from "./atoms/radial-series.atom";
import { DonutChartContentBooster } from "./boosters/donut-chart-content.booster";
import { DonutChartTestPage } from "./donut-chart-test.po";

test.describe("Donut chart", () => {
    let pageObject: DonutChartTestPage;
    const arcCoords = {
            blue: { x: 950, y: 150 },
            pink: { x: 900, y: 100 },
            lilac: { x: 950, y: 100 },
    };

    let allSeries: RadialSeriesAtom[];
    let blueArc: RadialSeriesAtom;
    let pinkArc: RadialSeriesAtom;
    let lilacArc: RadialSeriesAtom;

    let content: Locator;
    let textPage: Locator;
    let textSecondary: Locator;

    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await Helpers.prepareBrowser("chart-types/pie-and-donut/donut-test", page);
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        pageObject = new DonutChartTestPage();

        allSeries = (await pageObject.chart.getAllVisibleDataSeries(
            RadialSeriesAtom as any
        )) as unknown as RadialSeriesAtom[];
        blueArc = allSeries[0];
        pinkArc = allSeries[1];
        lilacArc = allSeries[2];

        content = DonutChartContentBooster.getContentElement(pageObject.chart);
        textPage = content.locator(".nui-text-page");
        textSecondary = content.locator(".nui-text-secondary");
        await blueArc.getLocator().waitFor({ state: "visible" });
        await pinkArc.getLocator().waitFor({ state: "visible" });
        await lilacArc.getLocator().waitFor({ state: "visible" });
    });

    test("should be displayed", async () => {
        await expect(pageObject.chart.getLocator()).toBeVisible();
    });

    test("series should be non-transparent by default", async () => {
        await expect
            .poll(async () => blueArc.getComputedOpacity())
            .toBeGreaterThan(0.9);
        await expect
            .poll(async () => pinkArc.getComputedOpacity())
            .toBeGreaterThan(0.9);
        await expect
            .poll(async () => lilacArc.getComputedOpacity())
            .toBeGreaterThan(0.9);
    });

    test("should highlight active arc and fade inactive ones", async () => {
        await pageObject.chart.clickElementByCoordinates(arcCoords.blue);

        await expect.poll(async () => blueArc.getOpacity()).toBe(1);
        await expect.poll(async () => pinkArc.getOpacity()).toBeLessThan(0.5);
        await expect.poll(async () => lilacArc.getOpacity()).toBeLessThan(0.5);
    });

    test.describe("content", () => {
        test("should be visible", async () => {
            await expect(content).toBeAttached();
        });

        test("should have layout visible", async () => {
            await expect(textPage).toBeVisible();
            await expect(textSecondary).toBeVisible();
        });

        test("should contain correct content", async () => {
            await expect(textPage).toContainText("57");
            await expect(textSecondary).toContainText("donuts");
        });
    });
});
