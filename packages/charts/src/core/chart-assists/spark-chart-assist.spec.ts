import {
    INTERACTION_DATA_POINTS_EVENT,
    MOUSE_ACTIVE_EVENT,
} from "../../constants";
import {
    ILineAccessors,
    LineAccessors,
} from "../../renderers/line/line-accessors";
import { LineRenderer } from "../../renderers/line/line-renderer";
import { Chart } from "../chart";
import { LinearScale } from "../common/scales/linear-scale";
import { IChartEvent, IChartSeries, InteractionType } from "../common/types";
import { UtilityService } from "../common/utility.service";
import { XYGridConfig } from "../grid/config/xy-grid-config";
import { InteractionLabelPlugin } from "../plugins/interaction/interaction-label-plugin";
import { SparkChartAssist } from "./spark-chart-assist";
import { ISpark } from "./types";

describe("SparkChartAssist >", () => {
    let chartAssist: SparkChartAssist;
    const renderer = new LineRenderer();
    const xScale = new LinearScale();
    const accessors = new LineAccessors();

    const sparkScales = {
        x: xScale,
        y: new LinearScale(),
    };

    const testSeriesSet: IChartSeries<ILineAccessors>[] = [
        {
            id: `spark-series-1`,
            name: `Spark Series 1`,
            data: [
                { x: 1, y: 10 },
                { x: 2, y: 30 },
            ],
        },
        {
            id: `spark-series-2`,
            name: `Spark Series 2`,
            data: [
                { x: 1, y: 15 },
                { x: 2, y: 20 },
            ],
        },
    ].map((s) => ({ ...s, scales: sparkScales, renderer, accessors }));

    const testSparks: ISpark<ILineAccessors>[] = testSeriesSet.map(
        (chartSeries) => ({ id: chartSeries.id, chartSeriesSet: [chartSeries] })
    );

    const additionalSpark: ISpark<ILineAccessors> = {
        id: `spark-series-3`,
        chartSeriesSet: [
            {
                id: `spark-series-3`,
                name: `Spark Series 3`,
                data: [
                    { x: 1, y: 15 },
                    { x: 2, y: 20 },
                ],
                scales: sparkScales,
                renderer,
                accessors,
            },
        ],
    };

    beforeEach(() => {
        chartAssist = new SparkChartAssist();
    });

    describe("update", () => {
        it("should create a collection of ISpark's based on the input series set", () => {
            expect(chartAssist.sparks).toEqual([]);
            chartAssist.update(testSeriesSet);
            chartAssist.sparks.forEach((spark, index) => {
                expect(spark.chart instanceof Chart).toEqual(true);
                expect(spark.chartSeriesSet).toEqual([testSeriesSet[index]]);
                expect(spark.id).toEqual(testSeriesSet[index].id);
            });
        });
    });

    describe("updateSparks", () => {
        let realLabelPluginInitialize: () => void;
        beforeAll(() => {
            realLabelPluginInitialize =
                InteractionLabelPlugin.prototype.initialize;
            InteractionLabelPlugin.prototype.initialize = jasmine.createSpy();
        });

        afterAll(() => {
            InteractionLabelPlugin.prototype.initialize =
                realLabelPluginInitialize;
        });

        it("should reuse an existing chart if it already exists", () => {
            chartAssist.updateSparks(testSparks);
            const testChart = chartAssist.sparks.find(
                (spark) => spark.id === testSparks[1].id
            )?.chart;
            const amendedSparks = [...testSparks, additionalSpark];
            chartAssist.sparks.forEach((spark) => {
                // @ts-ignore: Disabled for testing purposes
                spyOn(spark.chart, "removePlugin");
            });
            chartAssist.updateSparks(amendedSparks);
            expect(chartAssist.sparks.length).toEqual(amendedSparks.length);
            // test for instance equality using toBe
            expect(testChart).toBe(
                chartAssist.sparks.find(
                    (spark) => spark.id === testSparks[1].id
                )?.chart
            );
        });

        it("should invoke an existing chart's updateDimensions method", () => {
            const amendedSparks = [...testSparks, additionalSpark];
            chartAssist.updateSparks(amendedSparks);
            const testChart = chartAssist.sparks.find(
                (spark) => spark.id === testSparks[1].id
            )?.chart;
            // @ts-ignore: Disabled for testing purposes
            spyOn(testChart, "updateDimensions");
            chartAssist.updateSparks(testSparks);
            expect(testChart?.updateDimensions).toHaveBeenCalled();
        });

        it("should generate a spark id if one isn't provided", () => {
            testSparks[0].id = undefined;
            const realUuid = UtilityService.uuid;
            UtilityService.uuid = jasmine
                .createSpy()
                .and.returnValue("mock-id");
            chartAssist.updateSparks(testSparks);
            UtilityService.uuid = realUuid;
            expect(chartAssist.sparks[0].id).toEqual("mock-id");
        });

        it("should invoke the chart update method for all sparks", () => {
            const realChartUpdate = Chart.prototype.update;
            Chart.prototype.update = jasmine.createSpy();
            chartAssist.updateSparks(testSparks);
            expect(Chart.prototype.update).toHaveBeenCalledTimes(2);
            Chart.prototype.update = realChartUpdate;
        });

        describe("InteractionLabelPlugin configuration", () => {
            it("should add the InteractionLabelPlugin to an existing chart if its needed'", () => {
                const amendedSparks = [...testSparks, additionalSpark];
                chartAssist.updateSparks(amendedSparks);
                const testChart = chartAssist.sparks.find(
                    (spark) => spark.id === testSparks[1].id
                )?.chart as Chart;
                expect(testChart.hasPlugin(InteractionLabelPlugin)).toEqual(
                    false
                );
                chartAssist.updateSparks(testSparks);
                expect(testChart.hasPlugin(InteractionLabelPlugin)).toEqual(
                    true
                );
            });

            it("should add the InteractionLabelPlugin to a new chart if its needed'", () => {
                chartAssist.updateSparks(testSparks);
                const amendedSparks = [...testSparks, additionalSpark];
                chartAssist.sparks.forEach((spark) => {
                    // @ts-ignore: Disabled for testing purposes
                    spyOn(spark.chart, "removePlugin");
                });
                chartAssist.updateSparks(amendedSparks);
                const testChart = chartAssist.sparks.find(
                    (spark) => spark.id === amendedSparks[2].id
                )?.chart as Chart;
                expect(testChart.hasPlugin(InteractionLabelPlugin)).toEqual(
                    true
                );
            });

            it("should remove the InteractionLabelPlugin from an existing chart if it's not needed'", () => {
                chartAssist.updateSparks(testSparks);
                const testChart = chartAssist.sparks.find(
                    (spark) => spark.id === testSparks[1].id
                )?.chart as Chart;
                expect(testChart.hasPlugin(InteractionLabelPlugin)).toEqual(
                    true
                );
                spyOn(testChart, "updateDimensions");
                const amendedSparks = [...testSparks, additionalSpark];
                spyOn(testChart, "removePlugin");
                chartAssist.updateSparks(amendedSparks);
                expect(testChart.removePlugin).toHaveBeenCalledWith(
                    InteractionLabelPlugin
                );
            });
        });

        describe("grid configuration", () => {
            it("should hide the bottom axis for all except the last grid", () => {
                chartAssist.updateSparks(testSparks);
                chartAssist.sparks.forEach((spark, index) => {
                    const isBottomAxisVisible = !!(<XYGridConfig>(
                        spark.chart?.getGrid().config()
                    )).dimension.margin.bottom;
                    expect(isBottomAxisVisible).toEqual(
                        index === chartAssist.sparks.length - 1
                    );
                });
            });

            it("should hide the bottom border for all except the last grid", () => {
                chartAssist.updateSparks(testSparks);
                chartAssist.sparks.forEach((spark, index) => {
                    const bottomBorder = spark.chart?.getGrid().config()
                        .borders.bottom;
                    expect(bottomBorder?.visible).toEqual(
                        index === chartAssist.sparks.length - 1
                    );
                });
            });

            it("should reconfigure an existing chart to not use the 'last chart' grid configuration", () => {
                chartAssist.updateSparks(testSparks);
                const testChart = chartAssist.sparks.find(
                    (spark) => spark.id === testSparks[1].id
                )?.chart;
                expect(testChart?.getGrid().config()).toEqual(
                    chartAssist.lastGridConfig
                );
                const amendedSparks = [...testSparks, additionalSpark];
                chartAssist.sparks.forEach((spark) => {
                    // @ts-ignore: Disabled for testing purposes
                    spyOn(spark.chart, "removePlugin");
                });
                chartAssist.updateSparks(amendedSparks);
                expect(testChart?.getGrid().config()).toEqual(
                    chartAssist.gridConfig
                );
            });

            it("should reconfigure an existing chart to use the 'last chart' grid configuration", () => {
                const amendedSparks = [...testSparks, additionalSpark];
                chartAssist.updateSparks(amendedSparks);
                const testChart = chartAssist.sparks.find(
                    (spark) => spark.id === testSparks[1].id
                )?.chart;
                expect(testChart?.getGrid().config()).toEqual(
                    chartAssist.gridConfig
                );
                chartAssist.updateSparks(testSparks);
                expect(testChart?.getGrid().config()).toEqual(
                    chartAssist.lastGridConfig
                );
            });
        });

        describe("event subscriptions", () => {
            it("should configure a subscription per chart for the INTERACTION_DATA_POINTS_EVENT", () => {
                const payloads: IChartEvent[] = testSeriesSet.map(
                    (chartSeries) => ({
                        data: {
                            interactionType: InteractionType.MouseMove,
                            dataPoints: {
                                [chartSeries.id]: {
                                    data: chartSeries.data[1],
                                    index: 1,
                                    seriesId: chartSeries.id,
                                },
                            },
                        },
                    })
                );

                chartAssist.updateSparks(testSparks);
                payloads.forEach((payload, index) => {
                    const chartSeries = testSeriesSet[index];
                    expect(
                        chartAssist.getHighlightedValue(chartSeries, "y")
                    ).toBeNull();
                    chartAssist.sparks[index].chart
                        ?.getEventBus()
                        .getStream(INTERACTION_DATA_POINTS_EVENT)
                        .next(payload);
                    expect(
                        chartAssist.getHighlightedValue(chartSeries, "y")
                    ).toEqual(payload.data.dataPoints[chartSeries.id].data.y);
                });
            });
        });

        it("should configure a subscription per chart for the MOUSE_ACTIVE_EVENT", () => {
            chartAssist.updateSparks(testSparks);
            chartAssist.sparks.forEach((spark) => {
                expect(chartAssist.isLegendActive).toEqual(false);
                spark.chart
                    ?.getEventBus()
                    .getStream(MOUSE_ACTIVE_EVENT)
                    .next({ data: true });
                expect(chartAssist.isLegendActive).toEqual(true);
                spark.chart
                    ?.getEventBus()
                    .getStream(MOUSE_ACTIVE_EVENT)
                    .next({ data: false });
            });
        });
    });
});
