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
    GaugeMode,
    GAUGE_QUANTITY_SERIES_ID,
    GAUGE_REMAINDER_SERIES_ID,
    GAUGE_THRESHOLD_MARKERS_SERIES_ID,
    StandardGaugeColor,
    StandardGaugeThresholdId,
} from "./constants";
import { GaugeUtil } from "./gauge-util";
import {
    IGaugeConfig,
    IGaugeLabelsConfig,
    IGaugeThresholdsConfig,
} from "./types";
import { Chart } from "../core/chart";
import { ChartAssist } from "../core/chart-assists/chart-assist";
import {
    IChartPlugin,
    IDonutGaugeThresholdsRendererConfig,
    ILinearGaugeThresholdsRendererConfig,
} from "../core/common/types";
import { GAUGE_LABEL_FORMATTER_NAME_DEFAULT } from "../core/plugins/gauge/constants";
import { DonutGaugeLabelsPlugin } from "../core/plugins/gauge/donut-gauge-labels-plugin";
import { LinearGaugeLabelsPlugin } from "../core/plugins/gauge/linear-gauge-labels-plugin";
import { BarRenderer } from "../renderers/bar/bar-renderer";
import { LinearGaugeThresholdsRenderer } from "../renderers/bar/linear-gauge-thresholds-renderer";
import { DonutGaugeThresholdsRenderer } from "../renderers/radial/gauge/donut-gauge-thresholds-renderer";
import { RadialRenderer } from "../renderers/radial/radial-renderer";

describe("GaugeUtil >", () => {
    let gaugeConfig: IGaugeConfig;
    let consoleWarnFn: any;

    beforeAll(() => {
        // suppress console warning
        consoleWarnFn = console.warn;
        console.warn = () => null;
    });

    afterAll(() => {
        // restore console warning
        console.warn = consoleWarnFn;
    });

    beforeEach(() => {
        gaugeConfig = {
            value: 3,
            max: 10,
            thresholds: GaugeUtil.createStandardThresholdsConfig(2, 4),
            labels: {},
        };
    });

    describe("createChartAssist", () => {
        describe("for 'donut' mode", () => {
            it("should create a chart assist", () => {
                const chartAssist = GaugeUtil.createChartAssist(
                    gaugeConfig,
                    GaugeMode.Donut
                );
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    gaugeConfig,
                    GaugeMode.Donut
                );
                expect(chartAssist instanceof ChartAssist).toEqual(true);
                expect(
                    chartAssist.seriesProcessor(seriesSet)[0].data[0].startAngle
                ).toBeDefined();
            });

            it("should add a donut gauge labels plugin", () => {
                const chartAssist = GaugeUtil.createChartAssist(
                    gaugeConfig,
                    GaugeMode.Donut
                );
                expect(
                    (chartAssist.chart as Chart).hasPlugin(
                        DonutGaugeLabelsPlugin
                    )
                ).toEqual(true);
                expect(
                    (chartAssist.chart as Chart).hasPlugin(
                        LinearGaugeLabelsPlugin
                    )
                ).toEqual(false);
            });

            it("should apply the correct margin for label clearance", () => {
                const configWithLabelClearance = {
                    ...gaugeConfig,
                    labels: { clearance: 123 },
                };
                const chartAssist = GaugeUtil.createChartAssist(
                    configWithLabelClearance,
                    GaugeMode.Donut
                );
                expect(
                    chartAssist.chart.getGrid().config().dimension.margin
                ).toEqual({
                    top: 123,
                    right: 123,
                    bottom: 123,
                    left: 123,
                });
            });

            it("should add the provided labels plugin", () => {
                const providedPlugin = new DonutGaugeLabelsPlugin();
                const chartAssist = GaugeUtil.createChartAssist(
                    gaugeConfig,
                    GaugeMode.Donut,
                    providedPlugin
                );
                expect(
                    (chartAssist.chart as any).plugins.find(
                        (plugin: IChartPlugin) => plugin === providedPlugin
                    )
                ).toBeDefined();
            });

            it("should not add a label plugin if threshold markers are disabled", () => {
                const thresholds =
                    gaugeConfig.thresholds as IGaugeThresholdsConfig;
                const configWithDisabledMarkers = {
                    ...gaugeConfig,
                    thresholds: { ...thresholds, disableMarkers: true },
                };
                const chartAssist = GaugeUtil.createChartAssist(
                    configWithDisabledMarkers,
                    GaugeMode.Donut
                );
                expect(
                    (chartAssist.chart as Chart).hasPlugin(
                        DonutGaugeLabelsPlugin
                    )
                ).toEqual(false);
            });
        });

        describe("for 'linear' mode", () => {
            it("should create a chart assist", () => {
                const chartAssist = GaugeUtil.createChartAssist(
                    gaugeConfig,
                    GaugeMode.Horizontal
                );
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    gaugeConfig,
                    GaugeMode.Horizontal
                );
                expect(chartAssist instanceof ChartAssist).toEqual(true);
                expect(
                    chartAssist.seriesProcessor(seriesSet)[0].data[0].__bar
                ).toBeDefined();
            });

            it("should add a linear gauge labels plugin", () => {
                const chartAssist = GaugeUtil.createChartAssist(
                    gaugeConfig,
                    GaugeMode.Horizontal
                );
                expect(
                    (chartAssist.chart as Chart).hasPlugin(
                        DonutGaugeLabelsPlugin
                    )
                ).toEqual(false);
                expect(
                    (chartAssist.chart as Chart).hasPlugin(
                        LinearGaugeLabelsPlugin
                    )
                ).toEqual(true);
            });

            it("should add the provided labels plugin", () => {
                const providedPlugin = new LinearGaugeLabelsPlugin();
                const chartAssist = GaugeUtil.createChartAssist(
                    gaugeConfig,
                    GaugeMode.Horizontal,
                    providedPlugin
                );
                expect(
                    (chartAssist.chart as any).plugins.find(
                        (plugin: IChartPlugin) => plugin === providedPlugin
                    )
                ).toBeDefined();
            });

            it("should not add a label plugin if threshold markers are disabled", () => {
                const thresholds =
                    gaugeConfig.thresholds as IGaugeThresholdsConfig;
                const configWithDisabledMarkers = {
                    ...gaugeConfig,
                    thresholds: { ...thresholds, disableMarkers: true },
                };
                const chartAssist = GaugeUtil.createChartAssist(
                    configWithDisabledMarkers,
                    GaugeMode.Horizontal
                );
                expect(
                    (chartAssist.chart as Chart).hasPlugin(
                        LinearGaugeLabelsPlugin
                    )
                ).toEqual(false);
            });

            describe("Horizontal", () => {
                it("should apply the correct margin for label clearance", () => {
                    const configWithLabelClearance = {
                        ...gaugeConfig,
                        labels: { clearance: 123 },
                    };
                    const chartAssist = GaugeUtil.createChartAssist(
                        configWithLabelClearance,
                        GaugeMode.Horizontal
                    );
                    expect(
                        chartAssist.chart.getGrid().config().dimension.margin
                    ).toEqual({
                        top: 0,
                        right: 0,
                        bottom: 123,
                        left: 0,
                    });
                });

                it("should apply the correct margin for label clearance when the labels are flipped", () => {
                    const configWithLabelClearance = {
                        ...gaugeConfig,
                        labels: { clearance: 123, flipped: true },
                    };
                    const chartAssist = GaugeUtil.createChartAssist(
                        configWithLabelClearance,
                        GaugeMode.Horizontal
                    );
                    expect(
                        chartAssist.chart.getGrid().config().dimension.margin
                    ).toEqual({
                        top: 123,
                        right: 0,
                        bottom: 0,
                        left: 0,
                    });
                });
            });

            describe("Vertical", () => {
                it("should apply the correct margin for label clearance", () => {
                    const configWithLabelClearance = {
                        ...gaugeConfig,
                        labels: { clearance: 123 },
                    };
                    const chartAssist = GaugeUtil.createChartAssist(
                        configWithLabelClearance,
                        GaugeMode.Vertical
                    );
                    expect(
                        chartAssist.chart.getGrid().config().dimension.margin
                    ).toEqual({
                        top: 0,
                        right: 123,
                        bottom: 0,
                        left: 0,
                    });
                });

                it("should apply the correct margin for label clearance when the labels are flipped", () => {
                    const configWithLabelClearance = {
                        ...gaugeConfig,
                        labels: { clearance: 123, flipped: true },
                    };
                    const chartAssist = GaugeUtil.createChartAssist(
                        configWithLabelClearance,
                        GaugeMode.Vertical
                    );
                    expect(
                        chartAssist.chart.getGrid().config().dimension.margin
                    ).toEqual({
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 123,
                    });
                });
            });
        });
    });

    describe("assembleSeriesSet", () => {
        it("should clamp the value to the max if it's larger than the max", () => {
            gaugeConfig.max = 10;
            gaugeConfig.value = 15;

            const seriesSet = GaugeUtil.assembleSeriesSet(
                gaugeConfig,
                GaugeMode.Donut
            );
            let series = seriesSet.find(
                (s) => s.id === GAUGE_QUANTITY_SERIES_ID
            );
            expect(series?.data[0].value).toEqual(gaugeConfig.max);
            series = seriesSet.find((s) => s.id === GAUGE_REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(0);
        });

        it("should set the active threshold on the quantity series", () => {
            const seriesSet = GaugeUtil.assembleSeriesSet(
                { ...gaugeConfig, value: 5 },
                GaugeMode.Donut
            );
            const series = seriesSet.find(
                (s) => s.id === GAUGE_QUANTITY_SERIES_ID
            );
            expect(series?.["activeThreshold"].id).toEqual(
                StandardGaugeThresholdId.Critical
            );
        });

        it("should set the default color on the quantity series", () => {
            const seriesSet = GaugeUtil.assembleSeriesSet(
                { ...gaugeConfig, defaultQuantityColor: "red" },
                GaugeMode.Donut
            );
            const series = seriesSet.find(
                (s) => s.id === GAUGE_QUANTITY_SERIES_ID
            );
            expect(series?.["defaultColor"]).toEqual("red");
        });

        describe("quantity color accessor", () => {
            it("should return the color for the triggered threshold", () => {
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    { ...gaugeConfig, defaultQuantityColor: "red" },
                    GaugeMode.Donut
                );
                const series = seriesSet.find(
                    (s) => s.id === GAUGE_QUANTITY_SERIES_ID
                );
                expect(
                    series?.accessors.data?.color?.(undefined, 0, [], series)
                ).toEqual(StandardGaugeColor.Warning);
            });

            it("should return the default color if no threshold is triggered", () => {
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    { ...gaugeConfig, value: 1, defaultQuantityColor: "red" },
                    GaugeMode.Donut
                );
                const series = seriesSet.find(
                    (s) => s.id === GAUGE_QUANTITY_SERIES_ID
                );
                expect(
                    series?.accessors.data?.color?.(undefined, 0, [], series)
                ).toEqual("red");
            });
        });

        describe("for 'donut' mode", () => {
            it("should generate a series set", () => {
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    gaugeConfig,
                    GaugeMode.Donut
                );
                let series = seriesSet.find(
                    (s) => s.id === GAUGE_QUANTITY_SERIES_ID
                );
                expect(series?.data[0].value).toEqual(gaugeConfig.value);
                expect(series?.renderer instanceof RadialRenderer).toEqual(
                    true
                );
                series = seriesSet.find(
                    (s) => s.id === GAUGE_REMAINDER_SERIES_ID
                );
                expect(series?.data[0].value).toEqual(
                    gaugeConfig.max - gaugeConfig.value
                );
                expect(series?.renderer instanceof RadialRenderer).toEqual(
                    true
                );
                series = seriesSet.find(
                    (s) => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID
                );
                const thresholds =
                    GaugeUtil.prepareThresholdsData(gaugeConfig).thresholds;
                expect(series?.data[0].value).toEqual(thresholds?.[0].value);
                expect(
                    series?.renderer instanceof DonutGaugeThresholdsRenderer
                ).toEqual(true);
            });

            it("should set a custom label formatter", () => {
                (gaugeConfig.labels as IGaugeLabelsConfig).formatter = () =>
                    "test";
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    gaugeConfig,
                    GaugeMode.Donut
                );
                const formattedValue =
                    seriesSet[0]?.scales.r.formatters?.[
                        GAUGE_LABEL_FORMATTER_NAME_DEFAULT
                    ]?.("any old string");
                expect(formattedValue).toEqual(
                    gaugeConfig.labels?.formatter?.(null)
                );
            });

            it("should enable the threshold markers based on the configuration", () => {
                const thresholds =
                    gaugeConfig.thresholds as IGaugeThresholdsConfig;
                const configWithDisabledMarkers = {
                    ...gaugeConfig,
                    thresholds: { ...thresholds, disableMarkers: false },
                };
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    configWithDisabledMarkers,
                    GaugeMode.Donut
                );
                const series = seriesSet.find(
                    (s) => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID
                );
                expect(
                    (
                        series?.renderer
                            .config as IDonutGaugeThresholdsRendererConfig
                    ).enabled
                ).toEqual(true);
            });

            it("should disable the threshold markers based on the configuration", () => {
                const thresholds =
                    gaugeConfig.thresholds as IGaugeThresholdsConfig;
                const configWithDisabledMarkers = {
                    ...gaugeConfig,
                    thresholds: { ...thresholds, disableMarkers: true },
                };
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    configWithDisabledMarkers,
                    GaugeMode.Donut
                );
                const series = seriesSet.find(
                    (s) => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID
                );
                expect(
                    (
                        series?.renderer
                            .config as IDonutGaugeThresholdsRendererConfig
                    ).enabled
                ).toEqual(false);
            });

            it("should set the marker radius based on the configuration", () => {
                const thresholds =
                    gaugeConfig.thresholds as IGaugeThresholdsConfig;
                const configWithDisabledMarkers = {
                    ...gaugeConfig,
                    thresholds: { ...thresholds, markerRadius: 123 },
                };
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    configWithDisabledMarkers,
                    GaugeMode.Donut
                );
                const series = seriesSet.find(
                    (s) => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID
                );
                expect(
                    (
                        series?.renderer
                            .config as IDonutGaugeThresholdsRendererConfig
                    ).markerRadius
                ).toEqual(123);
            });
        });

        describe("for 'horizontal' mode", () => {
            it("should generate a series", () => {
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    gaugeConfig,
                    GaugeMode.Horizontal
                );
                let series = seriesSet.find(
                    (s) => s.id === GAUGE_QUANTITY_SERIES_ID
                );
                expect(series?.data[0].value).toEqual(gaugeConfig.value);
                expect(series?.renderer instanceof BarRenderer).toEqual(true);
                series = seriesSet.find(
                    (s) => s.id === GAUGE_REMAINDER_SERIES_ID
                );
                expect(series?.data[0].value).toEqual(
                    gaugeConfig.max - gaugeConfig.value
                );
                expect(series?.renderer instanceof BarRenderer).toEqual(true);
                series = seriesSet.find(
                    (s) => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID
                );
                const thresholds =
                    GaugeUtil.prepareThresholdsData(gaugeConfig).thresholds;
                expect(series?.data[0].value).toEqual(thresholds?.[0].value);
                expect(
                    series?.renderer instanceof LinearGaugeThresholdsRenderer
                ).toEqual(true);
            });

            it("should set a custom label formatter", () => {
                (gaugeConfig.labels as IGaugeLabelsConfig).formatter = () =>
                    "test";
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    gaugeConfig,
                    GaugeMode.Horizontal
                );
                const formattedValue =
                    seriesSet[0]?.scales.x.formatters?.[
                        GAUGE_LABEL_FORMATTER_NAME_DEFAULT
                    ]?.("any old string");
                expect(formattedValue).toEqual(
                    gaugeConfig.labels?.formatter?.(null)
                );
            });

            it("should enable the threshold markers based on the configuration", () => {
                const thresholds =
                    gaugeConfig.thresholds as IGaugeThresholdsConfig;
                const configWithDisabledMarkers = {
                    ...gaugeConfig,
                    thresholds: { ...thresholds, disableMarkers: false },
                };
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    configWithDisabledMarkers,
                    GaugeMode.Horizontal
                );
                const series = seriesSet.find(
                    (s) => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID
                );
                expect(
                    (
                        series?.renderer
                            .config as ILinearGaugeThresholdsRendererConfig
                    ).enabled
                ).toEqual(true);
            });

            it("should disable the threshold markers based on the configuration", () => {
                const thresholds =
                    gaugeConfig.thresholds as IGaugeThresholdsConfig;
                const configWithDisabledMarkers = {
                    ...gaugeConfig,
                    thresholds: { ...thresholds, disableMarkers: true },
                };
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    configWithDisabledMarkers,
                    GaugeMode.Horizontal
                );
                const series = seriesSet.find(
                    (s) => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID
                );
                expect(
                    (
                        series?.renderer
                            .config as ILinearGaugeThresholdsRendererConfig
                    ).enabled
                ).toEqual(false);
            });

            it("should set the marker radius based on the configuration", () => {
                const thresholds =
                    gaugeConfig.thresholds as IGaugeThresholdsConfig;
                const configWithDisabledMarkers = {
                    ...gaugeConfig,
                    thresholds: { ...thresholds, markerRadius: 123 },
                };
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    configWithDisabledMarkers,
                    GaugeMode.Horizontal
                );
                const series = seriesSet.find(
                    (s) => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID
                );
                expect(
                    (
                        series?.renderer
                            .config as ILinearGaugeThresholdsRendererConfig
                    ).markerRadius
                ).toEqual(123);
            });
        });

        describe("for 'vertical' mode", () => {
            it("should generate a series set", () => {
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    gaugeConfig,
                    GaugeMode.Vertical
                );
                let series = seriesSet.find(
                    (s) => s.id === GAUGE_QUANTITY_SERIES_ID
                );
                expect(series?.data[0].value).toEqual(gaugeConfig.value);
                expect(series?.renderer instanceof BarRenderer).toEqual(true);
                series = seriesSet.find(
                    (s) => s.id === GAUGE_REMAINDER_SERIES_ID
                );
                expect(series?.data[0].value).toEqual(
                    gaugeConfig.max - gaugeConfig.value
                );
                expect(series?.renderer instanceof BarRenderer).toEqual(true);
                series = seriesSet.find(
                    (s) => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID
                );
                const thresholds =
                    GaugeUtil.prepareThresholdsData(gaugeConfig).thresholds;
                expect(series?.data[0].value).toEqual(thresholds?.[0].value);
                expect(
                    series?.renderer instanceof LinearGaugeThresholdsRenderer
                ).toEqual(true);
            });

            it("should set a custom label formatter", () => {
                (gaugeConfig.labels as IGaugeLabelsConfig).formatter = () =>
                    "test";
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    gaugeConfig,
                    GaugeMode.Vertical
                );
                const formattedValue =
                    seriesSet[0]?.scales.y.formatters?.[
                        GAUGE_LABEL_FORMATTER_NAME_DEFAULT
                    ]?.("any old string");
                expect(formattedValue).toEqual(
                    gaugeConfig.labels?.formatter?.(null)
                );
            });

            it("should enable the threshold markers based on the configuration", () => {
                const thresholds =
                    gaugeConfig.thresholds as IGaugeThresholdsConfig;
                const configWithDisabledMarkers = {
                    ...gaugeConfig,
                    thresholds: { ...thresholds, disableMarkers: false },
                };
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    configWithDisabledMarkers,
                    GaugeMode.Vertical
                );
                const series = seriesSet.find(
                    (s) => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID
                );
                expect(
                    (
                        series?.renderer
                            .config as ILinearGaugeThresholdsRendererConfig
                    ).enabled
                ).toEqual(true);
            });

            it("should disable the threshold markers based on the configuration", () => {
                const thresholds =
                    gaugeConfig.thresholds as IGaugeThresholdsConfig;
                const configWithDisabledMarkers = {
                    ...gaugeConfig,
                    thresholds: { ...thresholds, disableMarkers: true },
                };
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    configWithDisabledMarkers,
                    GaugeMode.Vertical
                );
                const series = seriesSet.find(
                    (s) => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID
                );
                expect(
                    (
                        series?.renderer
                            .config as ILinearGaugeThresholdsRendererConfig
                    ).enabled
                ).toEqual(false);
            });

            it("should set the marker radius based on the configuration", () => {
                const thresholds =
                    gaugeConfig.thresholds as IGaugeThresholdsConfig;
                const configWithDisabledMarkers = {
                    ...gaugeConfig,
                    thresholds: { ...thresholds, markerRadius: 123 },
                };
                const seriesSet = GaugeUtil.assembleSeriesSet(
                    configWithDisabledMarkers,
                    GaugeMode.Vertical
                );
                const series = seriesSet.find(
                    (s) => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID
                );
                expect(
                    (
                        series?.renderer
                            .config as ILinearGaugeThresholdsRendererConfig
                    ).markerRadius
                ).toEqual(123);
            });
        });
    });

    describe("update", () => {
        it("should clamp the value to the max if it's larger than the max", () => {
            gaugeConfig.max = 10;
            const updatedGaugeConfig = { ...gaugeConfig, value: 15 };

            let seriesSet = GaugeUtil.assembleSeriesSet(
                gaugeConfig,
                GaugeMode.Donut
            );
            seriesSet = GaugeUtil.update(seriesSet, updatedGaugeConfig);
            let series = seriesSet.find(
                (s) => s.id === GAUGE_QUANTITY_SERIES_ID
            );
            expect(series?.data[0].value).toEqual(gaugeConfig.max);
            series = seriesSet.find((s) => s.id === GAUGE_REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(0);
        });

        it("should update the gauge's series set", () => {
            const updatedGaugeConfig = { ...gaugeConfig, value: 5 };

            let seriesSet = GaugeUtil.assembleSeriesSet(
                gaugeConfig,
                GaugeMode.Donut
            );
            seriesSet = GaugeUtil.update(seriesSet, updatedGaugeConfig);
            let series = seriesSet.find(
                (s) => s.id === GAUGE_QUANTITY_SERIES_ID
            );

            expect(series?.data[0].value).toEqual(updatedGaugeConfig.value);
            expect(series?.renderer instanceof RadialRenderer).toEqual(true);
            series = seriesSet.find((s) => s.id === GAUGE_REMAINDER_SERIES_ID);
            expect(series?.data[0].value).toEqual(
                updatedGaugeConfig.max - updatedGaugeConfig.value
            );
            expect(series?.renderer instanceof RadialRenderer).toEqual(true);
            series = seriesSet.find(
                (s) => s.id === GAUGE_THRESHOLD_MARKERS_SERIES_ID
            );
            const thresholds =
                GaugeUtil.prepareThresholdsData(updatedGaugeConfig).thresholds;
            expect(series?.data[0].value).toEqual(thresholds?.[0].value);
            expect(
                series?.renderer instanceof DonutGaugeThresholdsRenderer
            ).toEqual(true);
        });

        it("should update the active threshold on the quantity series", () => {
            let seriesSet = GaugeUtil.assembleSeriesSet(
                gaugeConfig,
                GaugeMode.Donut
            );
            let series = seriesSet.find(
                (s) => s.id === GAUGE_QUANTITY_SERIES_ID
            );
            expect(series?.["activeThreshold"].id).toEqual(
                StandardGaugeThresholdId.Warning
            );
            seriesSet = GaugeUtil.update(seriesSet, {
                ...gaugeConfig,
                value: 5,
            });
            series = seriesSet.find((s) => s.id === GAUGE_QUANTITY_SERIES_ID);
            expect(series?.["activeThreshold"].id).toEqual(
                StandardGaugeThresholdId.Critical
            );
        });

        it("should update the default color on the quantity series", () => {
            let seriesSet = GaugeUtil.assembleSeriesSet(
                gaugeConfig,
                GaugeMode.Donut
            );
            let series = seriesSet.find(
                (s) => s.id === GAUGE_QUANTITY_SERIES_ID
            );
            expect(series?.["defaultColor"]).toEqual(StandardGaugeColor.Ok);
            seriesSet = GaugeUtil.update(seriesSet, {
                ...gaugeConfig,
                defaultQuantityColor: "red",
            });
            series = seriesSet.find((s) => s.id === GAUGE_QUANTITY_SERIES_ID);
            expect(series?.["defaultColor"]).toEqual("red");
        });
    });
});
