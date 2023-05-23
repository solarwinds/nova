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

import { GridsterItem } from "angular-gridster2";

import {
    DEFAULT_PIZZAGNA_ROOT,
    IProviderConfiguration,
    ISerializableTimeframe,
    ITimeseriesScaleConfig,
    ITimeseriesWidgetConfig,
    IWidget,
    LegendPlacement,
    PizzagnaLayer,
    TimeseriesChartPreset, TimeseriesChartTypes,
    TimeseriesScaleType,
    TimeseriesWidgetProjectType,
    WellKnownProviders,
} from "@nova-ui/dashboards";

import {
    TestTimeseriesDataSource,
    TestTimeseriesDataSource2,
    TestTimeseriesEventsDataSource,
    TestTimeseriesStatusDataSource,
    TestTimeseriesStatusIntervalDataSource,
} from "../../data/timeseries-data-sources";
import { frozenTime } from "../../data/widget-data";
export const positions: Record<string, GridsterItem> = {
    widget1: {
        cols: 6,
        rows: 7,
        y: 0,
        x: 0,
    },
    "widget1-interval": {
        cols: 6,
        rows: 7,
        y: 0,
        x: 6,
    },
    widget2: {
        cols: 6,
        rows: 7,
        y: 7,
        x: 0,
    },
    "widget2-interval": {
        cols: 6,
        rows: 7,
        y: 7,
        x: 6,
    },
    widget3: {
        cols: 6,
        rows: 7,
        y: 14,
        x: 0,
    },
    "widget3-interval": {
        cols: 6,
        rows: 7,
        y: 14,
        x: 6,
    },
    widget4: {
        cols: 6,
        rows: 7,
        y: 21,
        x: 0,
    },
    "widget4-interval": {
        cols: 6,
        rows: 7,
        y: 21,
        x: 6,
    },
    widget5: {
        cols: 6,
        rows: 7,
        y: 28,
        x: 0,
    },
    "widget5-interval": {
        cols: 6,
        rows: 7,
        y: 28,
        x: 6,
    },
    widget6: {
        cols: 6,
        rows: 7,
        y: 35,
        x: 0,
    },
    "widget6-perfstack": {
        cols: 6,
        rows: 7,
        y: 35,
        x: 6,
    },
    widget7: {
        cols: 6,
        rows: 7,
        y: 42,
        x: 0,
    },
};

const collectionId1 = "test-collection-left";
const collectionId2 = "test-collection-right";

export const widgetConfigs: IWidget[] = [
    {
        id: "widget1",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId:
                                TestTimeseriesEventsDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Line Chart with Standard Time Scale",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
                                    {
                                        id: "series-a",
                                        label: "Events",
                                        selectedSeriesId: "series-a",
                                    },
                                    {
                                        id: "series-b",
                                        label: "Events",
                                        selectedSeriesId: "series-b",
                                    },
                                    {
                                        id: "series-c",
                                        label: "Events",
                                        selectedSeriesId: "series-c",
                                    },
                                ],
                            },
                        } as Partial<IProviderConfiguration> as any,
                    },
                    properties: {
                        configuration: {
                            interaction: "series",
                            legendPlacement: LegendPlacement.Bottom,
                            enableZoom: true,
                            preset: TimeseriesChartPreset.Line,
                            collectionId: collectionId1,
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            startDatetime: frozenTime()
                                .subtract(7, "day")
                                .format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
                    },
                },
            },
        },
    },
    {
        id: "widget1-interval",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestTimeseriesDataSource2.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Line Chart with Time Interval Scale",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
                                    {
                                        id: "series-a",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-a",
                                    },
                                    {
                                        id: "series-b",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-b",
                                    },
                                    {
                                        id: "series-c",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-c",
                                    },
                                ],
                            },
                        } as Partial<IProviderConfiguration> as any,
                    },
                    properties: {
                        configuration: {
                            legendPlacement: LegendPlacement.Bottom,
                            enableZoom: true,
                            leftAxisLabel: "Utilization (%)",
                            preset: TimeseriesChartPreset.Line,
                            scales: {
                                x: {
                                    type: TimeseriesScaleType.TimeInterval,
                                    properties: {
                                        interval: 24 * 60 * 60,
                                    },
                                } as ITimeseriesScaleConfig,
                            },
                            collectionId: collectionId1,
                            allowLegendMenu: true,
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            startDatetime: frozenTime()
                                .subtract(7, "day")
                                .format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
                    },
                },
            },
        },
    },
    {
        id: "widget2",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Area Chart with Standard Time Scale",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
                                    {
                                        id: "series-1",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-2",
                                    },
                                    {
                                        id: "series-3",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-3",
                                    },
                                    {
                                        id: "series-4",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-4",
                                    },
                                ],
                            },
                        } as Partial<IProviderConfiguration> as any,
                    },
                    properties: {
                        configuration: {
                            legendPlacement: LegendPlacement.Right,
                            enableZoom: true,
                            leftAxisLabel: "Utilization (%)",
                            preset: TimeseriesChartPreset.StackedArea,
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            startDatetime: frozenTime()
                                .subtract(7, "day")
                                .format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
                    },
                },
            },
        },
    },
    {
        id: "widget2-interval",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Area Chart with Time Interval Scale",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
                                    {
                                        id: "series-1",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-2",
                                    },
                                    {
                                        id: "series-3",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-3",
                                    },
                                    {
                                        id: "series-4",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-4",
                                    },
                                ],
                            },
                        } as Partial<IProviderConfiguration> as any,
                    },
                    properties: {
                        configuration: {
                            legendPlacement: LegendPlacement.Right,
                            enableZoom: true,
                            leftAxisLabel: "Utilization (%)",
                            preset: TimeseriesChartPreset.StackedArea,
                            scales: {
                                x: {
                                    type: TimeseriesScaleType.TimeInterval,
                                    properties: {
                                        interval: 24 * 60 * 60,
                                    },
                                } as ITimeseriesScaleConfig,
                            },
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            startDatetime: frozenTime()
                                .subtract(7, "day")
                                .format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
                    },
                },
            },
        },
    },
    {
        id: "widget3",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Stacked Percentage Area Chart with Standard Time Scale",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
                                    {
                                        id: "series-1",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-2",
                                    },
                                    {
                                        id: "series-3",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-3",
                                    },
                                    {
                                        id: "series-4",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-4",
                                    },
                                ],
                            },
                        } as Partial<IProviderConfiguration> as any,
                    },
                    properties: {
                        configuration: {
                            legendPlacement: LegendPlacement.Right,
                            enableZoom: true,
                            leftAxisLabel: "Utilization (%)",
                            preset: TimeseriesChartPreset.StackedPercentageArea,
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            startDatetime: frozenTime()
                                .subtract(7, "day")
                                .format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
                    },
                },
            },
        },
    },
    {
        id: "widget3-interval",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Stacked Percentage Area Chart with Time Interval Scale",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
                                    {
                                        id: "series-1",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-2",
                                    },
                                    {
                                        id: "series-3",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-3",
                                    },
                                    {
                                        id: "series-4",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-4",
                                    },
                                ],
                            },
                        } as Partial<IProviderConfiguration> as any,
                    },
                    properties: {
                        configuration: {
                            legendPlacement: LegendPlacement.Right,
                            enableZoom: true,
                            leftAxisLabel: "Utilization (%)",
                            preset: TimeseriesChartPreset.StackedPercentageArea,
                            scales: {
                                x: {
                                    type: TimeseriesScaleType.TimeInterval,
                                    properties: {
                                        interval: 24 * 60 * 60,
                                    },
                                } as ITimeseriesScaleConfig,
                            },
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            startDatetime: frozenTime()
                                .subtract(7, "day")
                                .format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
                    },
                },
            },
        },
    },
    {
        id: "widget4",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestTimeseriesDataSource2.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Bar Chart with Standard Time Scale",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
                                    {
                                        id: "series-a",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-a",
                                    },
                                    {
                                        id: "series-b",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-b",
                                    },
                                    {
                                        id: "series-c",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-c",
                                    },
                                ],
                            },
                        } as Partial<IProviderConfiguration> as any,
                    },
                    properties: {
                        configuration: {
                            legendPlacement: LegendPlacement.Right,
                            enableZoom: true,
                            leftAxisLabel: "Utilization (%)",
                            preset: TimeseriesChartPreset.StackedBar,
                        } as Partial<ITimeseriesWidgetConfig>,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            startDatetime: frozenTime()
                                .subtract(7, "day")
                                .format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
                    },
                },
            },
        },
    },
    {
        id: "widget4-interval",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestTimeseriesDataSource2.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Bar Chart with Time Interval Scale",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
                                    {
                                        id: "series-a",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-a",
                                    },
                                    {
                                        id: "series-b",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-b",
                                    },
                                    {
                                        id: "series-c",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-c",
                                    },
                                ],
                            },
                        } as Partial<IProviderConfiguration> as any,
                    },
                    properties: {
                        configuration: {
                            legendPlacement: LegendPlacement.Right,
                            enableZoom: true,
                            leftAxisLabel: "Utilization (%)",
                            preset: TimeseriesChartPreset.StackedBar,
                            scales: {
                                x: {
                                    type: TimeseriesScaleType.TimeInterval,
                                    properties: {
                                        interval: 24 * 60 * 60,
                                    },
                                } as ITimeseriesScaleConfig,
                            },
                        } as Partial<ITimeseriesWidgetConfig>,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            startDatetime: frozenTime()
                                .subtract(7, "day")
                                .format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
                    },
                },
            },
        },
    },
    {
        id: "widget5",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId:
                                TestTimeseriesStatusDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Status Chart with Standard Time Scale",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
                                    {
                                        id: "series-1",
                                        label: "Average GPU Load",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-2",
                                    },
                                ],
                            },
                        } as Partial<IProviderConfiguration> as any,
                    },
                    properties: {
                        configuration: {
                            legendPlacement: LegendPlacement.Right,
                            enableZoom: true,
                            leftAxisLabel: "Utilization (%)",
                            preset: TimeseriesChartPreset.StatusBar,
                            collectionId: collectionId2,
                        },
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            startDatetime: frozenTime()
                                .subtract(14, "day")
                                .format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
                    },
                },
            },
        },
    },
    {
        id: "widget5-interval",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId:
                                TestTimeseriesStatusIntervalDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Status Chart with Time Interval Scale",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
                                    {
                                        id: "series-1",
                                        label: "Average GPU Load",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-2",
                                    },
                                ],
                            },
                        } as Partial<IProviderConfiguration> as any,
                    },
                    properties: {
                        configuration: {
                            legendPlacement: LegendPlacement.Right,
                            enableZoom: true,
                            leftAxisLabel: "Utilization (%)",
                            preset: TimeseriesChartPreset.StatusBar,
                            scales: {
                                x: {
                                    type: TimeseriesScaleType.TimeInterval,
                                    properties: {
                                        interval: 24 * 60 * 60,
                                    },
                                } as ITimeseriesScaleConfig,
                            },
                            collectionId: collectionId2,
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            startDatetime: frozenTime()
                                .subtract(14, "day")
                                .format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
                    },
                },
            },
        },
    },
    {
        id: "widget6",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId:
                                TestTimeseriesEventsDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Line Chart in PerfStack",
                        subtitle: "Basic timeseries widget with legend actions",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
                                    {
                                        id: "series-a",
                                        label: "Events",
                                        selectedSeriesId: "series-a",
                                    },
                                    {
                                        id: "series-b",
                                        label: "Events",
                                        selectedSeriesId: "series-b",
                                    },
                                    {
                                        id: "series-c",
                                        label: "Events",
                                        selectedSeriesId: "series-c",
                                    },
                                ],
                            },
                        } as Partial<IProviderConfiguration> as any,
                    },
                    properties: {
                        configuration: {
                            legendPlacement: LegendPlacement.Right,
                            enableZoom: true,
                            interaction: "series",
                            preset: TimeseriesChartPreset.Line,
                            collectionId: collectionId2,
                            allowLegendMenu: true,
                            projectType:
                                TimeseriesWidgetProjectType.PerfstackApp,
                            gridConfig: {
                                fixedLayout: true,
                            },
                        },
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            startDatetime: frozenTime()
                                .subtract(7, "day")
                                .format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
                    },
                },
            },
        },
    },
    {
        id: "widget6-perfstack",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId:
                                TestTimeseriesStatusDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Status Chart in PerfStack",
                        subtitle: "Basic timeseries widget with legend actions",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
                                    {
                                        id: "series-1",
                                        label: "Average GPU Load",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-2",
                                    },
                                ],
                            },
                        } as Partial<IProviderConfiguration> as any,
                    },
                    properties: {
                        configuration: {
                            legendPlacement: LegendPlacement.Right,
                            enableZoom: true,
                            leftAxisLabel: "Utilization (%)",
                            preset: TimeseriesChartPreset.StatusBar,
                            collectionId: collectionId2,
                            allowLegendMenu: true,
                            projectType:
                                TimeseriesWidgetProjectType.PerfstackApp,
                            gridConfig: {
                                fixedLayout: true,
                            },
                        },
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            startDatetime: frozenTime()
                                .subtract(14, "day")
                                .format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
                    },
                },
            },
        },
    },
    {
        id: "widget7",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId:
                            TestTimeseriesEventsDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Bits per second Chart",
                        subtitle: "Bits per second Chart in PerfStack",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
                                    {
                                        id: "series-a",
                                        label: "Events",
                                        selectedSeriesId: "series-a",
                                    },
                                    {
                                        id: "series-b",
                                        label: "Events",
                                        selectedSeriesId: "series-b",
                                    },
                                    {
                                        id: "series-c",
                                        label: "Events",
                                        selectedSeriesId: "series-c",
                                    },
                                ],
                            },
                        } as Partial<IProviderConfiguration> as any,
                    },
                    properties: {
                        configuration: {
                            displayedSeries: [],
                            enableZoom: true,
                            interaction: null,
                            legendPlacement: LegendPlacement.Right,
                            preset: TimeseriesChartPreset.Line,
                            scales: {
                                x: {
                                    type: TimeseriesScaleType.Time,
                                    properties: {
                                        timeInterval: {
                                            startDatetime: frozenTime()
                                                .subtract(7, "day")
                                                .format(),
                                            endDatetime: frozenTime().format(),
                                        },
                                    },
                                },
                                y: {
                                    type: TimeseriesScaleType.Linear,
                                    properties: {
                                        axisUnits: "bitsPerSecond",
                                        domain: {
                                            min: 0,
                                            max: 200000
                                        },
                                    },
                                },
                                yRight: {
                                    type: TimeseriesScaleType.Linear,
                                    properties: {
                                        axisUnits: "bitsPerSecond",
                                        domain: {
                                            min: 0,
                                            max: 200000
                                        },
                                    },
                                },
                            },
                            allowLegendMenu: true,
                            gridConfig: {
                                hideYAxisLabel: true,
                                xAxisTicksCount: 10,
                                sideMarginLocked: true,
                                sideMargin: 50,
                                fixedLayout: true,
                            },
                            projectType: TimeseriesWidgetProjectType.ModernDashboard, // maybe change this to PerfstackApp?
                            leftAxisLabel: "Average Receive (bps)",
                            type: TimeseriesChartTypes.line,
                            units: "bitsPerSecond",

                        },
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            startDatetime: frozenTime()
                                .subtract(7, "day")
                                .format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
                    },
                },
            },
        },
    },
];
