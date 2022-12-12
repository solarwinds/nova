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

import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { ThresholdSeriesAtom } from "./atoms/threshold-series.atom";
import { ThresholdsSummaryTestPage } from "./thresholds-summary-test.po";

describe("Thresholds summary", () => {
    const page = new ThresholdsSummaryTestPage();
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

    // data point y values are purposefully equidistant from the start of each zone to make the threshold rectangle
    // positions start and end exactly halfway between the data point x values
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

    beforeAll(async () => {
        await Helpers.prepareBrowser("thresholds/summary-test");
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );
        await page.changeData(multiSeriesData);
        await page.changeZones(zones);
    });

    describe("by default", () => {
        describe("main chart", () => {
            it("should not render any threshold series", async () => {
                await expect(
                    await page.mainChart.getNumberOfVisibleDataSeries()
                ).toEqual(nonBackgroundSeriesCountMulti);

                for (const id in multiSeriesData) {
                    if (multiSeriesData.hasOwnProperty(id)) {
                        const seriesId = ThresholdSeriesAtom.buildSeriesId(id);
                        const backgroundSeries =
                            await page.mainChart.getDataSeriesById(
                                ThresholdSeriesAtom,
                                seriesId
                            );

                        await expect(
                            await backgroundSeries?.isDisplayed()
                        ).toEqual(false);
                    }
                }
            });
        });

        describe("summary chart", () => {
            it("should render two threshold series", async () => {
                await expect(
                    await page.summaryChart.getNumberOfVisibleDataSeries()
                ).toEqual(multiSeriesCount);

                for (const id in multiSeriesData) {
                    if (multiSeriesData.hasOwnProperty(id)) {
                        const seriesId = ThresholdSeriesAtom.buildSeriesId(id);
                        const backgroundSeries =
                            await page.summaryChart.getDataSeriesById(
                                ThresholdSeriesAtom,
                                seriesId
                            );

                        await expect(
                            await backgroundSeries?.isDisplayed()
                        ).toEqual(true);
                    }
                }
            });
            it("should have only semi-transparent series", async () => {
                for (const id in multiSeriesData) {
                    if (multiSeriesData.hasOwnProperty(id)) {
                        const seriesId = ThresholdSeriesAtom.buildSeriesId(id);
                        const series =
                            await page.summaryChart.getDataSeriesById(
                                ThresholdSeriesAtom,
                                seriesId
                            );
                        await expect(await series?.getOpacity()).toBeLessThan(
                            1
                        );
                    }
                }
            });
        });
    });

    describe("threshold series", () => {
        describe("multiple series", () => {
            it("rectangles should be positioned and colored correctly for both charts", async () => {
                async function checkDataPoints(
                    thresholdSeries: ThresholdSeriesAtom,
                    expectations: { x: number; width: number; color: string }[]
                ) {
                    for (let i = 0; i < expectations.length; i++) {
                        const rect = expectations[i];
                        const dataPoint = thresholdSeries.getDataPoint(i);

                        await expect(await dataPoint.getX()).toEqual(rect.x);
                        await expect(await dataPoint.getWidth()).toEqual(
                            rect.width
                        );
                        await expect(await dataPoint.getColor()).toEqual(
                            rect.color
                        );
                    }
                }

                for (const id in multiSeriesData) {
                    if (multiSeriesData.hasOwnProperty(id)) {
                        const seriesId = ThresholdSeriesAtom.buildSeriesId(id);
                        const mainChartSeries =
                            await page.mainChart.getDataSeriesById(
                                ThresholdSeriesAtom,
                                seriesId
                            );
                        const summaryChartSeries =
                            await page.summaryChart.getDataSeriesById(
                                ThresholdSeriesAtom,
                                seriesId
                            );

                        // Number of rendered rectangles should match
                        await expect(
                            await mainChartSeries?.getDataPointCount()
                        ).toEqual(mainRectangles.length);
                        await expect(
                            await summaryChartSeries?.getDataPointCount()
                        ).toEqual(summaryRectangles.length);

                        // @ts-ignore
                        await checkDataPoints(mainChartSeries, mainRectangles);
                        await checkDataPoints(
                            // @ts-ignore
                            summaryChartSeries,
                            summaryRectangles
                        );
                    }
                }
            });

            describe("when corresponding series on legend >",  () => {
                const seriesIndex = 0;
                const seriesId = Object.keys(multiSeriesData)[seriesIndex];
                const backgroundSeriesId =
                    ThresholdSeriesAtom.buildSeriesId(seriesId);
                let mainChartSeries: ThresholdSeriesAtom | undefined;
                let summaryChartSeries: ThresholdSeriesAtom | undefined;

                beforeAll(async () => {
                    mainChartSeries = await page.mainChart.getDataSeriesById(
                        ThresholdSeriesAtom,
                        backgroundSeriesId
                    );
                    summaryChartSeries =
                        await page.summaryChart.getDataSeriesById(
                            ThresholdSeriesAtom,
                            backgroundSeriesId
                        );
                });
                describe("is hovered", () => {
                    beforeAll(async () => {
                        await page.legend.getSeriesByIndex(seriesIndex).hover();
                    });

                    afterAll(async () => {
                        await page.mainChart.hover();
                    });

                    it("should be backgrounds and threshold lines displayed on the chart", async () => {
                        const expectedCount =
                            multiSeriesCount + // all main series are visible, some of them are demphasized
                            1 + // threshold backgrounds for hovered series
                            zones.length; // threshold lines for hovered series
                        await expect(
                            await page.mainChart.getNumberOfVisibleDataSeries()
                        ).toEqual(expectedCount);
                        await expect(
                            await page.summaryChart.getNumberOfVisibleDataSeries()
                        ).toEqual(1);
                    });

                    it("should be fully opaque on both charts", async () => {
                        await expect(
                            await mainChartSeries?.getOpacity()
                        ).toEqual(1);
                        await expect(
                            await summaryChartSeries?.getOpacity()
                        ).toEqual(1);
                    });
                });

                describe("is clicked", () => {
                    beforeAll(async () => {
                        await page.legend
                            .getSeriesByIndex(seriesIndex)
                            .getElement()
                            .click();
                    });

                    afterAll(async () => {
                        await page.legend
                            .getSeriesByIndex(seriesIndex)
                            .getElement()
                            .click();
                    });

                    it("should be hidden on both charts", async () => {
                        await expect(
                            await mainChartSeries?.isDisplayed()
                        ).toEqual(false);
                        await expect(
                            await summaryChartSeries?.isDisplayed()
                        ).toEqual(false);

                        const expectedCount =
                            nonBackgroundSeriesCountSingle *
                            (multiSeriesCount - 1); // for all but 1
                        await expect(
                            await page.mainChart.getNumberOfVisibleDataSeries()
                        ).toEqual(expectedCount);
                        await expect(
                            await page.summaryChart.getNumberOfVisibleDataSeries()
                        ).toEqual(0);
                    });
                });

                describe("is the only selected", () => {
                    beforeAll(async () => {
                        for (let i = 0; i < multiSeriesCount; i++) {
                            if (i !== seriesIndex) {
                                await page.legend
                                    .getSeriesByIndex(i)
                                    .getElement()
                                    .click();
                            }
                        }
                        await page.mainChart.hover();
                    });

                    afterAll(async () => {
                        for (let i = 0; i < multiSeriesCount; i++) {
                            if (i !== seriesIndex) {
                                await page.legend
                                    .getSeriesByIndex(i)
                                    .getElement()
                                    .click();
                            }
                        }
                        await page.mainChart.hover();
                    });

                    it("should be only one background series displayed per chart", async () => {
                        const expectedCount =
                            nonBackgroundSeriesCountSingle +
                            1 + // threshold backgrounds
                            zones.length; // a line for every threshold zone
                        await expect(
                            await page.mainChart.getNumberOfVisibleDataSeries()
                        ).toEqual(expectedCount);
                        await expect(
                            await page.summaryChart.getNumberOfVisibleDataSeries()
                        ).toEqual(1);
                    });

                    it("should be fully opaque on both charts", async () => {
                        await expect(
                            await mainChartSeries?.getOpacity()
                        ).toEqual(1);
                        await expect(
                            await summaryChartSeries?.getOpacity()
                        ).toEqual(1);
                    });
                });
            });
        });

        describe("single series", () => {
            let mainChartSeries: ThresholdSeriesAtom | undefined;
            let summaryChartSeries: ThresholdSeriesAtom | undefined;

            beforeAll(async () => {
                await page.changeData(singleSeriesData);

                const seriesId = ThresholdSeriesAtom.buildSeriesId(
                    Object.keys(singleSeriesData)[0]
                );
                mainChartSeries = await page.mainChart.getDataSeriesById(
                    ThresholdSeriesAtom,
                    seriesId
                );
                summaryChartSeries = await page.summaryChart.getDataSeriesById(
                    ThresholdSeriesAtom,
                    seriesId
                );
            });

            describe("by default", () => {
                it("should be visible on both charts", async () => {
                    await expect(await mainChartSeries?.isDisplayed()).toEqual(
                        true
                    );
                    await expect(
                        await summaryChartSeries?.isDisplayed()
                    ).toEqual(true);
                });

                it("should be fully opaque on both charts", async () => {
                    await expect(await mainChartSeries?.getOpacity()).toEqual(
                        1
                    );
                    await expect(
                        await summaryChartSeries?.getOpacity()
                    ).toEqual(1);
                });
            });

            describe("when hovered on legend", () => {
                beforeAll(async () => {
                    await page.legend.getSeriesByIndex(0).hover();
                });
                afterAll(async () => {
                    await page.mainChart.hover();
                });
                it("should be visible on both charts", async () => {
                    await expect(await mainChartSeries?.isDisplayed()).toEqual(
                        true
                    );
                    await expect(
                        await summaryChartSeries?.isDisplayed()
                    ).toEqual(true);
                });
                it("should be fully opaque on both charts", async () => {
                    await expect(await mainChartSeries?.getOpacity()).toEqual(
                        1
                    );
                    await expect(
                        await summaryChartSeries?.getOpacity()
                    ).toEqual(1);
                });
            });

            describe("when clicked on legend", () => {
                beforeAll(async () => {
                    await page.legend.getSeriesByIndex(0).getElement().click();
                });

                afterAll(async () => {
                    await page.legend.getSeriesByIndex(0).getElement().click();
                });

                it("should be hidden on both charts", async () => {
                    await expect(await mainChartSeries?.isDisplayed()).toEqual(
                        false
                    );
                    await expect(
                        await summaryChartSeries?.isDisplayed()
                    ).toEqual(false);
                    await expect(
                        await page.mainChart.getNumberOfVisibleDataSeries()
                    ).toEqual(0);
                    await expect(
                        await page.summaryChart.getNumberOfVisibleDataSeries()
                    ).toEqual(0);
                });
            });
        });
    });
});
