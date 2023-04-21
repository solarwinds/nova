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

import { browser, by, ElementFinder } from "protractor";

import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { RadialSeriesAtom } from "./atoms/radial-series.atom";
import { DonutChartContentBooster } from "./boosters/donut-chart-content.booster";
import { DonutChartTestPage } from "./donut-chart-test.po";

describe("Donut chart",  () => {
    const page = new DonutChartTestPage();
    const arcCoords = {
        blue: { x: 950, y: 150 },
        pink: { x: 900, y: 100 },
        lilac: { x: 950, y: 100 },
    };
    let allSeries: RadialSeriesAtom[] | undefined;
    let blueArc: RadialSeriesAtom | undefined;
    let pinkArc: RadialSeriesAtom | undefined;
    let lilacArc: RadialSeriesAtom | undefined;
    let textPage: ElementFinder;
    let textSecondary: ElementFinder;
    let content: ElementFinder;

    beforeAll(async () => {
        await browser.manage().window().setSize(1920, 1080);
        await Helpers.prepareBrowser("chart-types/pie-and-donut/donut-test");
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );
        allSeries = await page.chart.getAllVisibleDataSeries(RadialSeriesAtom);
        blueArc = allSeries?.[0];
        pinkArc = allSeries?.[1];
        lilacArc = allSeries?.[2];
        content = DonutChartContentBooster.getContentElement(page.chart);
        textPage = content.element(by.className("nui-text-page"));
        textSecondary = content.element(by.className("nui-text-secondary"));
    });

    it("should be displayed", async () => {
        await expect(await page.chart.isPresent()).toBe(true);
        await expect(await page.chart.isDisplayed()).toBe(true);
    });

    it("should series be non-transpared by default", async () => {
        await expect(await blueArc?.getOpacity()).toBe(1);
        await expect(await pinkArc?.getOpacity()).toBe(1);
        await expect(await lilacArc?.getOpacity()).toBe(1);
    });

    it("should highlight active arc and fade inactive ones", async () => {
        await page.chart.clickElementByCoordinates(arcCoords.blue);
        await expect(await blueArc?.getOpacity()).toBe(1);
        await expect(await pinkArc?.getOpacity()).toBe(0.1);
        await expect(await lilacArc?.getOpacity()).toBe(0.1);
    });

    describe("content >", () => {
        it("should content be visible", async () => {
            await expect(await content.isDisplayed()).toBe(true);
        });

        it("should content layout be visible", async () => {
            await expect(await textPage.isDisplayed()).toBe(true);
            await expect(await textSecondary.isDisplayed()).toBe(true);
        });

        it("should contain correct content", async () => {
            await expect(await textPage.getText()).toContain("57");
            await expect(await textSecondary.getText()).toContain("donuts");
        });
    });
});
