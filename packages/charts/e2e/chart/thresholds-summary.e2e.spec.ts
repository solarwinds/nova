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

import { SeriesAtom } from "./atoms/series.atom";
import { ThresholdSeriesAtom } from "./atoms/threshold-series.atom";
import { ThresholdsSummaryTestPage } from "./thresholds-summary-test.po";

test.describe("Thresholds summary", () => {
    // for 5 data points and grid width of 400px
    const mainRectangles = [
        { x: 50, width: 100, color: "rgba(254, 196, 5, 0.15)" }, // warning
        { x: 150, width: 100, color: "rgba(221, 44, 0, 0.15)" }, // error
        { x: 250, width: 100, color: "rgba(254, 196, 5, 0.15)" }, // warning
    ];
    const summaryRectangles = [
        { x: 0, width: 50, color: "rgb(0, 167, 83)" }, // ok
        { x: 50, width: 100, color: "rgb(254, 196, 5)" }, // warning
        { x: 150, width: 100, color: "rgb(221, 44, 0)" }, // error
        { x: 250, width: 100, color: "rgb(254, 196, 5)" }, // warning
        { x: 350, width: 50, color: "rgb(0, 167, 83)" }, // ok
    ];

    const multiSeriesData = {
        "series-1": [10, 30, 70, 30, 10],
        "series-2": [0, 40, 60, 40, 0],
    };
    const singleSeriesData = { "series-1": [10, 30, 70, 30, 10] };
    const zones = [
        { status: "error", start: 50 },
        { status: "warning", start: 20, end: 50 },
    ];
    const multiSeriesCount = Object.keys(multiSeriesData).length;
    const nonBackgroundSeriesCountSingle = 1; // dataSeries
    const nonBackgroundSeriesCountMulti =
        nonBackgroundSeriesCountSingle * multiSeriesCount;

    let pageObject: ThresholdsSummaryTestPage;

    // NOTE: Playwright's "hidden" is about layout/visibility, not opacity.
    // These background series can remain present but be faded out via opacity.
    const expectSeriesNotShown = async (
        series: SeriesAtom | undefined
    ): Promise<void> => {
        if (!series) {
            return;
        }

        const count = await series.getLocator().count();
        if (count === 0) {
            return;
        }

        const opacity = series.getComputedOpacity
            ? await series.getComputedOpacity()
            : await series.getOpacity();
        expect(opacity).toBeLessThanOrEqual(0.06);
    };

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("thresholds/summary-test", page);
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        pageObject = new ThresholdsSummaryTestPage(page);
        await pageObject.changeData(multiSeriesData);
        await pageObject.changeZones(zones);
    });

    test.describe("by default", () => {
        test.describe("main chart", () => {
            test("should not render any threshold series", async () => {
                expect(
                    await pageObject.mainChart.getNumberOfVisibleDataSeries()
                ).toEqual(nonBackgroundSeriesCountMulti);

                for (const id in multiSeriesData) {
                    if (Object.prototype.hasOwnProperty.call(multiSeriesData, id)) {
                        const seriesId = ThresholdSeriesAtom.buildSeriesId(id);
                        const backgroundSeries =
                            await pageObject.mainChart.getDataSeriesById(
                                ThresholdSeriesAtom,
                                seriesId
                            );
                        await expectSeriesNotShown(backgroundSeries);
                    }
                }
            });
        });

        test.describe("summary chart", () => {
            test("should render two threshold series", async () => {
                expect(
                    await pageObject.summaryChart.getNumberOfVisibleDataSeries()
                ).toEqual(multiSeriesCount);

                for (const id in multiSeriesData) {
                    if (Object.prototype.hasOwnProperty.call(multiSeriesData, id)) {
                        const seriesId = ThresholdSeriesAtom.buildSeriesId(id);
                        const backgroundSeries =
                            await pageObject.summaryChart.getDataSeriesById(
                                ThresholdSeriesAtom,
                                seriesId
                            );

                        await backgroundSeries?.toBeVisible();
                    }
                }
            });

            test("should have only semi-transparent series", async () => {
                for (const id in multiSeriesData) {
                    if (Object.prototype.hasOwnProperty.call(multiSeriesData, id)) {
                        const seriesId = ThresholdSeriesAtom.buildSeriesId(id);
                        const series =
                            await pageObject.summaryChart.getDataSeriesById(
                                ThresholdSeriesAtom,
                                seriesId
                            );
                        expect(await series?.getOpacity()).toBeLessThan(1);
                    }
                }
            });
        });
    });

    test.describe("threshold series", () => {
        test.describe("multiple series", () => {
            test("rectangles should be positioned and colored correctly for both charts", async () => {
                async function checkDataPoints(
                    thresholdSeries: ThresholdSeriesAtom,
                    expectations: { x: number; width: number; color: string }[]
                ) {
                    for (let i = 0; i < expectations.length; i++) {
                        const rect = expectations[i];
                        const dataPoint = thresholdSeries.getDataPoint(i);

                        expect(await dataPoint.getX()).toEqual(rect.x);
                        expect(await dataPoint.getWidth()).toEqual(rect.width);
                        expect(await dataPoint.getColor()).toEqual(rect.color);
                    }
                }

                for (const id in multiSeriesData) {
                    if (Object.prototype.hasOwnProperty.call(multiSeriesData, id)) {
                        const seriesId = ThresholdSeriesAtom.buildSeriesId(id);
                        const mainChartSeries =
                            await pageObject.mainChart.getDataSeriesById(
                                ThresholdSeriesAtom,
                                seriesId
                            ) as ThresholdSeriesAtom;
                        const summaryChartSeries =
                            await pageObject.summaryChart.getDataSeriesById(
                                ThresholdSeriesAtom,
                                seriesId
                            ) as ThresholdSeriesAtom;

                        expect(await mainChartSeries?.getDataPointCount()).toEqual(
                            mainRectangles.length
                        );
                        expect(await summaryChartSeries?.getDataPointCount()).toEqual(
                            summaryRectangles.length
                        );

                        if (mainChartSeries) {
                            await checkDataPoints(mainChartSeries, mainRectangles);
                        }
                        if (summaryChartSeries) {
                            await checkDataPoints(
                                summaryChartSeries,
                                summaryRectangles
                            );
                        }
                    }
                }
            });

            test.describe("when corresponding series on legend >", () => {
                const seriesIndex = 0;
                const seriesId = Object.keys(multiSeriesData)[seriesIndex];
                const backgroundSeriesId =
                    ThresholdSeriesAtom.buildSeriesId(seriesId);
                let mainChartSeries: ThresholdSeriesAtom;
                let summaryChartSeries: ThresholdSeriesAtom;

                test.beforeEach(async () => {
                    mainChartSeries = (await pageObject.mainChart.getDataSeriesById(
                        ThresholdSeriesAtom,
                        backgroundSeriesId
                    )) as any;
                    summaryChartSeries = (await pageObject.summaryChart.getDataSeriesById(
                        ThresholdSeriesAtom,
                        backgroundSeriesId
                    )) as any;
                });

                test.describe("is hovered", () => {
                    test.beforeEach(async () => {
                        await pageObject.legend.getSeriesByIndex(seriesIndex).hover();
                    });

                    test.afterEach(async () => {
                        await pageObject.mainChart.hover();
                    });

                    test("should be backgrounds and threshold lines displayed on the chart", async () => {
                        const expectedCount =
                            multiSeriesCount +
                            1 +
                            zones.length;
                        expect(
                            await pageObject.mainChart.getNumberOfVisibleDataSeries()
                        ).toEqual(expectedCount);
                        expect(
                            await pageObject.summaryChart.getNumberOfVisibleDataSeries()
                        ).toEqual(1);
                    });

                    test("should be fully opaque on both charts", async () => {
                        expect(await mainChartSeries?.getOpacity()).toEqual(1);
                        expect(await summaryChartSeries?.getOpacity()).toEqual(1);
                    });
                });

                test.describe("is clicked", () => {
                    test.beforeEach(async () => {
                        await pageObject
                            .legend
                            .getSeriesByIndex(seriesIndex)
                            .getLocator()
                            .click();
                    });

                    test.afterEach(async () => {
                        await pageObject
                            .legend
                            .getSeriesByIndex(seriesIndex)
                            .getLocator()
                            .click();
                    });

                    test("should be hidden on both charts", async () => {
                        await expectSeriesNotShown(mainChartSeries);
                        await expectSeriesNotShown(summaryChartSeries);

                        const expectedCount =
                            nonBackgroundSeriesCountSingle *
                            (multiSeriesCount - 1);
                        expect(
                            await pageObject.mainChart.getNumberOfVisibleDataSeries()
                        ).toEqual(expectedCount);
                        expect(
                            await pageObject.summaryChart.getNumberOfVisibleDataSeries()
                        ).toEqual(0);
                    });
                });

                test.describe("is the only selected", () => {
                    test.beforeEach(async () => {
                        for (let i = 0; i < multiSeriesCount; i++) {
                            if (i !== seriesIndex) {
                                await pageObject.legend
                                    .getSeriesByIndex(i)
                                    .getLocator()
                                    .click();
                            }
                        }
                        await pageObject.mainChart.hover();
                    });

                    test.afterEach(async () => {
                        for (let i = 0; i < multiSeriesCount; i++) {
                            if (i !== seriesIndex) {
                                await pageObject.legend
                                    .getSeriesByIndex(i)
                                    .getLocator()
                                    .click();
                            }
                        }
                        await pageObject.mainChart.hover();
                    });

                    test("should be only one background series displayed per chart", async () => {
                        const expectedCount =
                            nonBackgroundSeriesCountSingle +
                            1 +
                            zones.length;
                        expect(
                            await pageObject.mainChart.getNumberOfVisibleDataSeries()
                        ).toEqual(expectedCount);
                        expect(
                            await pageObject.summaryChart.getNumberOfVisibleDataSeries()
                        ).toEqual(1);
                    });

                    test("should be fully opaque on both charts", async () => {
                        expect(await mainChartSeries?.getOpacity()).toEqual(1);
                        expect(await summaryChartSeries?.getOpacity()).toEqual(1);
                    });
                });
            });
        });

        test.describe("single series", () => {
            let mainChartSeries: ThresholdSeriesAtom;
            let summaryChartSeries: ThresholdSeriesAtom;

            test.beforeEach(async () => {
                await pageObject.changeData(singleSeriesData);

                const seriesId = ThresholdSeriesAtom.buildSeriesId(
                    Object.keys(singleSeriesData)[0]
                );
                mainChartSeries = await pageObject.mainChart.getDataSeriesById(
                    ThresholdSeriesAtom,
                    seriesId
                ) as ThresholdSeriesAtom;
                summaryChartSeries = await pageObject.summaryChart.getDataSeriesById(
                    ThresholdSeriesAtom,
                    seriesId
                ) as ThresholdSeriesAtom;
            });

            test.describe("by default", () => {
                test("should be visible on both charts", async () => {
                    await mainChartSeries?.toBeVisible();
                    await summaryChartSeries?.toBeVisible();
                });

                test("should be fully opaque on both charts", async () => {
                    expect(await mainChartSeries?.getOpacity()).toEqual(1);
                    expect(await summaryChartSeries?.getOpacity()).toEqual(1);
                });
            });

            test.describe("when hovered on legend", () => {
                test.beforeEach(async () => {
                    await pageObject.legend.getSeriesByIndex(0).hover();
                });
                test.afterEach(async () => {
                    await pageObject.mainChart.hover();
                });

                test("should be visible on both charts", async () => {
                    await mainChartSeries?.toBeVisible();
                    await summaryChartSeries?.toBeVisible();
                });

                test("should be fully opaque on both charts", async () => {
                    expect(await mainChartSeries?.getOpacity()).toEqual(1);
                    expect(await summaryChartSeries?.getOpacity()).toEqual(1);
                });
            });

            test.describe("when clicked on legend", () => {
                test.beforeEach(async () => {
                    await pageObject.legend.getSeriesByIndex(0).getLocator().click();
                });

                test.afterEach(async () => {
                    await pageObject.legend.getSeriesByIndex(0).getLocator().click();
                });

                test("should be hidden on both charts", async () => {
                    await expectSeriesNotShown(mainChartSeries);
                    await expectSeriesNotShown(summaryChartSeries);
                    expect(
                        await pageObject.mainChart.getNumberOfVisibleDataSeries()
                    ).toEqual(0);
                    expect(
                        await pageObject.summaryChart.getNumberOfVisibleDataSeries()
                    ).toEqual(0);
                });
            });
        });
    });
});
