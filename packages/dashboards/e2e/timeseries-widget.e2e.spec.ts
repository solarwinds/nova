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
    Atom,
    ButtonAtom,
    Helpers,
    test,
    expect,
} from "@nova-ui/bits/sdk/atoms-playwright";

import { TimeseriesAtom } from "./timeseries/timeseries.atom";

const name = "Timeseries Widget";

const getTimeseriesWidget = (index: number): TimeseriesAtom => {
    const all = Atom.findIn<TimeseriesAtom>(TimeseriesAtom);
    return all.nth<TimeseriesAtom>(TimeseriesAtom, index);
};

test.describe(`Dashboards - ${name}`, () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("test/timeseries", page);
    });

    test("should display Legend menu button for line charts", async () => {
        // Line chart (widget index 10) — menu button should appear on hover
        const lineChart = getTimeseriesWidget(10);
        const lineLegends = await lineChart.getLegendSeries();
        expect(lineLegends.length).toEqual(3);

        await lineLegends[0].hover();
        await expect(lineLegends[0].getMenuButton().getLocator()).toBeVisible();
        await expect(
            lineLegends[1].getMenuButton().getLocator()
        ).not.toBeVisible();

        // Area chart (widget index 2) — no menu button at all
        const areaChart = getTimeseriesWidget(2);
        const areaLegends = await areaChart.getLegendSeries();
        expect(areaLegends.length).toEqual(4);

        await areaLegends[0].hover();
        const areaButtonLocator = areaLegends[0]
            .getLocator()
            .locator(`.${ButtonAtom.CSS_CLASS}`);
        await expect(areaButtonLocator).toHaveCount(0);

        // Bar chart (widget index 6) — no menu button at all
        const barChart = getTimeseriesWidget(6);
        const barLegends = await barChart.getLegendSeries();
        expect(barLegends.length).toEqual(3);

        await barLegends[0].hover();
        const barButtonLocator = barLegends[0]
            .getLocator()
            .locator(`.${ButtonAtom.CSS_CLASS}`);
        await expect(barButtonLocator).toHaveCount(0);
    });

    test.skip("should display the correct menu items", async () => {
        const lineChart = getTimeseriesWidget(10);
        const legends = await lineChart.getLegendSeries();
        const firstLegend = legends[0];

        await firstLegend.hover();
        await firstLegend.getMenuButton().click();

        // Verify the transform names in the "Display Transforms" group
        const expectedTransforms = [
            "None",
            "Change Point",
            "Difference",
            "Floating Average",
            "Normalize",
            "Percentile Standardized",
            "Smoothing",
            "Smoothing Standardized",
            "Standardize",
        ];

        const group = firstLegend
            .getLocator()
            .page()
            .locator("nui-menu-group[header='Display Transforms']");
        const items = group.locator(
            ".nui-menu-item:not(.nui-menu-item--header)"
        );
        const count = await items.count();
        const names: string[] = [];
        for (let i = 0; i < count; i++) {
            names.push(await items.nth(i).innerText());
        }
        expect(names).toEqual(expectedTransforms);
    });

    test("should display icon after using transform", async () => {
        const lineChart = getTimeseriesWidget(10);

        // Apply "Difference" → icon should be visible
        await lineChart.transformSeries("Difference", 0);
        const legends1 = await lineChart.getLegendSeries();
        await expect(legends1[0].getTransformIcon().getLocator()).toBeVisible();

        // Apply "Linear" → icon should be visible
        await lineChart.transformSeries("Linear", 0);
        const legends2 = await lineChart.getLegendSeries();
        await expect(legends2[0].getTransformIcon().getLocator()).toBeVisible();

        // Apply "None" → icon should NOT be visible
        await lineChart.transformSeries("None", 0);
        const legends3 = await lineChart.getLegendSeries();
        await expect(
            legends3[0].getTransformIcon().getLocator()
        ).not.toBeVisible();

        // Apply "Standardize" → icon should be visible
        await lineChart.transformSeries("Standardize", 0);
        const legends4 = await lineChart.getLegendSeries();
        await expect(legends4[0].getTransformIcon().getLocator()).toBeVisible();
    });

    test("should display remove icon for status charts", async () => {
        // Status line chart (widget index 11) — menu button should appear on hover
        const statusLineChart = getTimeseriesWidget(11);
        const statusLineLegends = await statusLineChart.getLegendSeries();
        expect(statusLineLegends.length).toEqual(2);

        await statusLineLegends[0].hover();
        await expect(
            statusLineLegends[0].getMenuButton().getLocator()
        ).toBeVisible();

        // Status bar chart (widget index 8) — no menu button at all
        const statusBarChart = getTimeseriesWidget(8);
        const statusBarLegends = await statusBarChart.getLegendSeries();
        expect(statusBarLegends.length).toEqual(2);

        await statusBarLegends[0].hover();
        const statusBarButtonLocator = statusBarLegends[0]
            .getLocator()
            .locator(`.${ButtonAtom.CSS_CLASS}`);
        await expect(statusBarButtonLocator).toHaveCount(0);
    });
});
