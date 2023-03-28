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
    TimeseriesChartPreset,
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

export interface IImageDef {
    svgFile: string;
    name: string;
    brushType: string;
    code: string;
}

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
                            allowLegendMenu: true,
                            projectType:
                                TimeseriesWidgetProjectType.PerfstackApp,
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
                            projectType:
                                TimeseriesWidgetProjectType.PerfstackApp,
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
                            allowLegendMenu: true,
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
];
