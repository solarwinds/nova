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

import { by, element } from "protractor";

import { Atom, IconAtom } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { TimeseriesAtom } from "./timeseries/timeseries.atom";
import { DashboardAtom } from "./dashboard.atom";
import { LegendSeriesAtom } from "./timeseries/legend-series.atom";

const getTimeseriesWidget = (index: number): TimeseriesAtom =>
    Atom.findIn(
        TimeseriesAtom,
        element(by.className(DashboardAtom.CSS_CLASS)),
        index
    );

const getLegends = async (widgetIndex: number): Promise<LegendSeriesAtom[]> =>
    await getTimeseriesWidget(widgetIndex).getLegendSeries();

describe("Dashboards - Timeseries Widget", () => {
    beforeAll(async () => await Helpers.prepareBrowser("test/timeseries"));

    it("should display Legend menu button for line charts", async () => {
        // line chart
        let legends = await getTimeseriesWidget(10).getLegendSeries();
        expect(legends.length).toBe(3);

        await legends[0].hover();

        expect(await legends[0].getMenuButton()?.isDisplayed()).toBe(true);
        expect(await legends[1].getMenuButton()?.isDisplayed()).toBe(false);

        // area chart
        legends = await getTimeseriesWidget(2).getLegendSeries();
        expect(legends.length).toBe(4);

        await legends[0].hover();
        expect(legends[0].getMenuButton).toThrow();

        // bar chart
        legends = await getTimeseriesWidget(6).getLegendSeries();
        expect(legends.length).toBe(3);

        await legends[0].hover();
        expect(legends[0].getMenuButton).toThrow();
    });

    it("should display the correct menu items", async () => {
        const legend = (await getLegends(10))[0];
        expect(legend).toBeDefined();

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

        for (const transformName of expectedTransforms) {
            const transform = await legend.getTransform(transformName);
            expect(await transform?.getElement().getText()).toBe(transformName);

            transform?.clickItem();
        }
    });

    it("should display icon after using transform", async () => {
        const getIcon = async (): Promise<IconAtom> =>
            (await getLegends(10))[0].getTransformIcon();

        await getTimeseriesWidget(10).transformSeries("Difference", 0);
        expect((await getIcon()).isDisplayed()).toBe(true);

        await getTimeseriesWidget(10).transformSeries("Linear", 0);
        expect((await getIcon()).isDisplayed()).toBe(true);

        await getTimeseriesWidget(10).transformSeries("None", 0);
        expect((await getIcon()).isDisplayed()).toBe(false);

        await getTimeseriesWidget(10).transformSeries("Standardize", 0);
        expect((await getIcon()).isDisplayed()).toBe(true);
    });

    it("should display remove icon for status charts", async () => {
        let legends = await getTimeseriesWidget(11).getLegendSeries();
        expect(legends.length).toBe(2);

        await legends[0].hover();
        expect(await legends[0].getMenuButton()?.isDisplayed()).toBe(true);

        legends = await getTimeseriesWidget(8).getLegendSeries();
        expect(legends.length).toBe(2);

        await legends[0].hover();
        expect(legends[0].getMenuButton).toThrow();
    });
});
