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

import { LineSeriesAtom } from "./atoms/line-series.atom";
import { InteractiveBooster } from "./boosters/interactive.booster";
import { ZoomBooster } from "./boosters/zoom.booster";
import { SparkChartTestPage } from "./spark-chart-test.po";

test.describe("Spark chart", () => {
    const sparkStackClassName = "nui-spark-chart-multiple-test";
    const xTicks = [0, 100, 200, 300, 400]; // for 5 datapoints and grid width of 400px
    const data = [
        [10, 4, 7, 15, 20],
        [20, 5, 15, 6, 5],
        [0, 12, 18, 3, 23],
    ];
    const colors = [
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "black",
        "white",
    ];
    const rgbColors = [
        "rgb(255, 0, 0)",
        "rgb(255, 165, 0)",
        "rgb(255, 255, 0)",
        "rgb(0, 128, 0)",
        "rgb(0, 0, 255)",
        "rgb(128, 0, 128)",
        "rgb(0, 0, 0)",
        "rgb(255, 255, 255)",
    ];

    const getYCoordinate = (value: number): number => 31 - value;

    let pageObject: SparkChartTestPage;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("chart-types/spark/test", page);
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        pageObject = new SparkChartTestPage(page);
        await pageObject.changeData(data);
    });

    test.describe("by default", () => {
        test("should render line chart for every data series", async () => {
            expect(
                await pageObject.getSparkCountInStack(sparkStackClassName)
            ).toEqual(data.length);
        });

        test("should show legend for every data series", async () => {
            expect(await pageObject.getLegendSeriesCount()).toEqual(data.length);
        });

        test("should have different color per series", async () => {
            for (let i = 0; i < data.length; i++) {
                const expectedColor = colors[i];

                const chart = pageObject.getChart(i);

                const [dataLayer] = await chart.getLayer("data");
                const lineLocator = dataLayer?.locator(`#data-${i + 1}`).first();
                const line = lineLocator ? new LineSeriesAtom(lineLocator) : undefined;

                const markerSeries = await chart.getMarkerSeriesById(
                    (i + 1).toString()
                );
                const marker = markerSeries?.getMarker(0);
                const legend = pageObject.getLegendSeries(i);

                expect(await line?.getColor()).toEqual(expectedColor);
                expect(await marker?.getColor()).toEqual(expectedColor);
                expect(await legend.richTile.getBackgroundColor()).toEqual(
                    rgbColors[i]
                );
            }

            expect(await pageObject.getLegendSeriesCount()).toEqual(data.length);
        });
    });

    test.describe("after hovering second data point in first chart", () => {
        const pointIndex = 1;

        test.beforeEach(async ({ page }) => {
            await InteractiveBooster.hover(pageObject.getChart(0), {
                x: xTicks[pointIndex],
                y: getYCoordinate(10),
            });

        });

        test("should highlight corresponding data points in all charts", async () => {
            for (let i = 0; i < data.length; i++) {
                const dataValue = data[i][pointIndex];
                const chart = pageObject.getChart(i);
                const legend = pageObject.getLegendSeries(i);
                const legendValue = await legend.richTile.getValue();
                const markerSeries = await chart.getMarkerSeriesById(
                    (i + 1).toString()
                );
                const marker = markerSeries?.getMarker(0);
                const markerPosition = await marker?.getPosition();

                expect(parseInt(legendValue, 10)).toEqual(dataValue);
                expect(markerPosition?.x).toEqual(xTicks[pointIndex]);
                expect(markerPosition?.y).toEqual(getYCoordinate(dataValue));
            }
        });

        test("should make all legend series active", async () => {
            for (let i = 0; i < data.length; i++) {
                const legend = pageObject.getLegendSeries(i);
                expect(await legend.isActive()).toEqual(true);
            }
        });
    });

    test.describe("after click on the legend", () => {
        test.beforeEach(async () => {
            await pageObject.getLegendSeries(0).getLocator().click();
        });

        test("should keep all series visible", async () => {
            expect(
                await pageObject.getSparkCountInStack(sparkStackClassName)
            ).toEqual(data.length);
            for (let i = 0; i < data.length; i++) {
                expect(await pageObject.getChart(i).getNumberOfVisibleDataSeries()).toEqual(1);
            }
        });
    });

    test.describe("zoom", () => {
        test("should not be possible", async () => {
            const chart = pageObject.getChart(0);

            const [dataLayer] = await chart.getLayer("data");
            const path = dataLayer?.locator("#data-1 path").first();
            const dBefore = (await path?.getAttribute("d")) ?? "";

            await ZoomBooster.zoom(
                chart,
                { x: xTicks[1], y: getYCoordinate(50) },
                { x: xTicks[2], y: getYCoordinate(50) }
            );

            const dAfter = (await path?.getAttribute("d")) ?? "";
            expect(dAfter).toEqual(dBefore);
        });
    });
});
