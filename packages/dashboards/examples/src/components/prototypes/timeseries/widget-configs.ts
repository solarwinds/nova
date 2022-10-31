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
import moment from "moment/moment";

import {
    DEFAULT_PIZZAGNA_ROOT,
    IProviderConfiguration,
    ISerializableTimeframe,
    ITimeseriesScaleConfig,
    ITimeseriesWidgetConfig,
    IWidget,
    LegendPlacement,
    NOVA_URL_INTERACTION_HANDLER,
    PizzagnaLayer,
    TimeseriesChartPreset,
    TimeseriesScaleType,
    WellKnownProviders,
} from "@nova-ui/dashboards";

import {
    AcmeTimeseriesDataSource,
    AcmeTimeseriesStatusDataSource,
    AcmeTimeseriesStatusIntervalDataSource,
} from "../data/timeseries-data-sources";

export const positions: Record<string, GridsterItem> = {
    widget1: {
        cols: 6,
        rows: 6,
        y: 0,
        x: 0,
    },
    "widget1-interval": {
        cols: 6,
        rows: 6,
        y: 0,
        x: 6,
    },
    widget2: {
        cols: 6,
        rows: 6,
        y: 6,
        x: 0,
    },
    "widget2-interval": {
        cols: 6,
        rows: 6,
        y: 6,
        x: 6,
    },
    widget3: {
        cols: 6,
        rows: 6,
        y: 12,
        x: 0,
    },
    "widget3-interval": {
        cols: 6,
        rows: 6,
        y: 12,
        x: 6,
    },
    widget4: {
        cols: 6,
        rows: 6,
        y: 18,
        x: 0,
    },
    "widget4-interval": {
        cols: 6,
        rows: 6,
        y: 18,
        x: 6,
    },
    widget5: {
        cols: 6,
        rows: 6,
        y: 24,
        x: 0,
    },
    "widget5-interval": {
        cols: 6,
        rows: 6,
        y: 24,
        x: 6,
    },
};

export const widgetConfigs: IWidget[] = [
    {
        id: "widget1",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: AcmeTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.InteractionHandler]: {
                            providerId: NOVA_URL_INTERACTION_HANDLER,
                            properties: {
                                url: "${data.link}",
                            },
                        },
                    },
                },
                header: {
                    properties: {
                        title: "Line chart",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
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
                            interaction: "series",
                            legendPlacement: LegendPlacement.Right,
                            enableZoom: true,
                            leftAxisLabel: "Utilization (%)",
                            preset: TimeseriesChartPreset.Line,
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            selectedPresetId: "last7Days",
                        } as ISerializableTimeframe,
                        maxDate: moment().format(),
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
                            providerId: AcmeTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.InteractionHandler]: {
                            providerId: NOVA_URL_INTERACTION_HANDLER,
                            properties: {
                                url: "${data.link}",
                            },
                        },
                    },
                },
                header: {
                    properties: {
                        title: "Line chart",
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
                            preset: TimeseriesChartPreset.Line,
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
                            selectedPresetId: "last7Days",
                        } as ISerializableTimeframe,
                        maxDate: moment().format(),
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
                            providerId: AcmeTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Area chart",
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
                            preset: TimeseriesChartPreset.StackedArea,
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            selectedPresetId: "last7Days",
                        } as ISerializableTimeframe,
                        maxDate: moment().format(),
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
                            providerId: AcmeTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Area chart",
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
                            selectedPresetId: "last7Days",
                        } as ISerializableTimeframe,
                        maxDate: moment().format(),
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
                            providerId: AcmeTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Stacked percentage area",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
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
                            preset: TimeseriesChartPreset.StackedPercentageArea,
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            selectedPresetId: "last7Days",
                        } as ISerializableTimeframe,
                        maxDate: moment().format(),
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
                            providerId: AcmeTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Stacked percentage area",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
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
                            selectedPresetId: "last7Days",
                        } as ISerializableTimeframe,
                        maxDate: moment().format(),
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
                            providerId: AcmeTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Bar chart",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
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
                            preset: TimeseriesChartPreset.StackedBar,
                            scales: {},
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            selectedPresetId: "last7Days",
                        } as ISerializableTimeframe,
                        maxDate: moment().format(),
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
                            providerId: AcmeTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Bar chart",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
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
                            preset: TimeseriesChartPreset.StackedBar,
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
                            selectedPresetId: "last7Days",
                        } as ISerializableTimeframe,
                        maxDate: moment().format(),
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
                                AcmeTimeseriesStatusDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Status chart",
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
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            selectedPresetId: "last7Days",
                        } as ISerializableTimeframe,
                        maxDate: moment().format(),
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
                                AcmeTimeseriesStatusIntervalDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Status chart",
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
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            selectedPresetId: "last7Days",
                        } as ISerializableTimeframe,
                        maxDate: moment().format(),
                    },
                },
            },
        },
    },
];
