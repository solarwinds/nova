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

import { LineSeriesAtom, type Point } from "./atoms/line-series.atom";
import { InteractiveBooster } from "./boosters/interactive.booster";
import { ZoomBooster } from "./boosters/zoom.booster";
import { LineChartTestPage } from "./line-chart-test.po";

test.describe("Line chart", () => {
    const xTicks = [0, 100, 200, 300, 400]; // for 5 datapoints and grid width of 400px
    const data = [
        [60, 40, 70, 45, 90],
        [30, 95, 15, 60, 35],
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

    const getYCoordinate = (value: number): number => 105 - value;

    const getLineSeriesById = async (id: string): Promise<LineSeriesAtom | undefined> => {
        const [layer] = await pageObject.chart.getLayer("data");
        if (!layer) {
            return undefined;
        }

        const selector = `#data-${id}`;
        const locator = layer.locator(selector);
        if ((await locator.count()) === 0) {
            return undefined;
        }

        return new LineSeriesAtom(locator.first());
    };

    let pageObject: LineChartTestPage;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("chart-types/line/test", page);
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );
        pageObject = new LineChartTestPage(page);
        await pageObject.changeData(data);
    });

    test.describe("by default", () => {
        test("should render 2 lines in basic line chart", async () => {
            expect(await pageObject.chart.getNumberOfVisibleDataSeries()).toEqual(2);
        });

        test("should have markers in basic line chart", async () => {
            expect(await pageObject.chart.getNumberOfSeriesWithMarkers()).toEqual(2);
        });
    });

    test.describe("lines", () => {
        let firstLine: LineSeriesAtom | undefined;
        let secondLine: LineSeriesAtom | undefined;
        let firstLinePoints: Point[] | undefined;
        let secondLinePoints: Point[] | undefined;

        test.beforeEach(async () => {
            firstLine = await getLineSeriesById("1");
            secondLine = await getLineSeriesById("2");
            firstLinePoints = await firstLine?.getPoints();
            secondLinePoints = await secondLine?.getPoints();
        });

        test("should have proper color", async () => {
            expect(await firstLine?.getColor()).toEqual(colors[0]);
            expect(await secondLine?.getColor()).toEqual(colors[1]);
        });

        // TODO: Re-enable after NUI-4162 is done.
        test.skip("should connect proper data points", async () => {
            for (let i = 0; i < xTicks.length; i++) {
                const x = xTicks[i];
                const y1 = getYCoordinate(data[0][i]);
                const y2 = getYCoordinate(data[1][i]);
                expect(firstLinePoints?.[i]).toEqual({ x, y: y1 });
                expect(secondLinePoints?.[i]).toEqual({ x, y: y2 });
            }
        });
    });

    test.describe("markers", () => {
        test("should have proper color", async () => {
            const marker1 = (await pageObject.chart.getMarkerSeriesById("1"))?.getMarker(0);
            const marker2 = (await pageObject.chart.getMarkerSeriesById("2"))?.getMarker(0);

            expect(await marker1?.getColor()).toEqual(colors[0]);
            expect(await marker2?.getColor()).toEqual(colors[1]);
        });

        test("should be in positions corresponding to last data points by default", async () => {
            const marker1 = (await pageObject.chart.getMarkerSeriesById("1"))?.getMarker(0);
            const marker2 = (await pageObject.chart.getMarkerSeriesById("2"))?.getMarker(0);

            const index = xTicks.length - 1;
            const position1 = await marker1?.getPosition();
            const position2 = await marker2?.getPosition();

            expect(position1?.x).toEqual(xTicks[index]);
            expect(position2?.x).toEqual(xTicks[index]);
            expect(position1?.y).toEqual(getYCoordinate(data[0][index]));
            expect(position2?.y).toEqual(getYCoordinate(data[1][index]));
        });

        test.describe("after highlighting of the second data point", () => {
            const index = 1;

            test.beforeEach(async ({ page }) => {
                await InteractiveBooster.hover(pageObject.chart, {
                    x: xTicks[index],
                    y: getYCoordinate(50),
                });
            });

            test("should be moved to correct positions", async () => {
                const marker1 = (await pageObject.chart.getMarkerSeriesById("1"))?.getMarker(0);
                const marker2 = (await pageObject.chart.getMarkerSeriesById("2"))?.getMarker(0);

                const position1 = await marker1?.getPosition();
                const position2 = await marker2?.getPosition();

                expect(position1?.x).toEqual(xTicks[index]);
                expect(position2?.x).toEqual(xTicks[index]);
                expect(position1?.y).toEqual(getYCoordinate(data[0][index]));
                expect(position2?.y).toEqual(getYCoordinate(data[1][index]));
            });
        });
    });

    test.describe("zoom", () => {
        test("should be disabled by default", async () => {
            const firstLine = await getLineSeriesById("1");
            const pointsBefore = await firstLine?.getPoints();

            await ZoomBooster.zoom(
                pageObject.chart,
                { x: xTicks[1], y: getYCoordinate(50) },
                { x: xTicks[2], y: getYCoordinate(50) }
            );

            expect(await firstLine?.getPoints()).toEqual(pointsBefore);
        });
    });
});
