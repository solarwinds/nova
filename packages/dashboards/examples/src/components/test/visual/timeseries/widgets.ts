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
    WellKnownProviders
} from "@nova-ui/dashboards";
import { GridsterItem } from "angular-gridster2";

import {
    TestTimeseriesDataSource,
    TestTimeseriesDataSource2,
    TestTimeseriesStatusDataSource,
    TestTimeseriesStatusIntervalDataSource
} from "../../data/timeseries-data-sources";
import { frozenTime } from "../../data/widget-data";

export interface IImageDef {
    svgFile: string;
    name: string;
    brushType: string;
    code: string;
}

export const positions: Record<string, GridsterItem> = {
    "widget1": {
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
    "widget2": {
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
    "widget3": {
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
    "widget4": {
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
    "widget5": {
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

export const widgetConfigs: IWidget[] = [
    {
        id: "widget1",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": TestTimeseriesDataSource2.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Line chart",
                        "subtitle": "Basic timeseries widget",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                "series": [
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
                    "properties": {
                        "configuration": {
                            "interaction": "series",
                            "legendPlacement": LegendPlacement.Bottom,
                            "enableZoom": true,
                            "leftAxisLabel": "Utilization (%)",
                            preset: TimeseriesChartPreset.Line,
                        } as ITimeseriesWidgetConfig,
                    },
                },
                "timeframeSelection": {
                    "properties": {
                        "timeframe": {
                            startDatetime: frozenTime().subtract(7, "day").format(),
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
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": TestTimeseriesDataSource2.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Line chart",
                        "subtitle": "Basic timeseries widget",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                "series": [
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
                    "properties": {
                        "configuration": {
                            "legendPlacement": LegendPlacement.Bottom,
                            "enableZoom": true,
                            "leftAxisLabel": "Utilization (%)",
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
                "timeframeSelection": {
                    "properties": {
                        "timeframe": {
                            startDatetime: frozenTime().subtract(7, "day").format(),
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
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": TestTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Area chart",
                        "subtitle": "Basic timeseries widget",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                "series": [
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
                    "properties": {
                        "configuration": {
                            "legendPlacement": LegendPlacement.Right,
                            "enableZoom": true,
                            "leftAxisLabel": "Utilization (%)",
                            preset: TimeseriesChartPreset.StackedArea,
                        } as ITimeseriesWidgetConfig,
                    },
                },
                "timeframeSelection": {
                    "properties": {
                        "timeframe": {
                            startDatetime: frozenTime().subtract(7, "day").format(),
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
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": TestTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Area chart",
                        "subtitle": "Basic timeseries widget",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                "series": [
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
                    "properties": {
                        "configuration": {
                            "legendPlacement": LegendPlacement.Right,
                            "enableZoom": true,
                            "leftAxisLabel": "Utilization (%)",
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
                "timeframeSelection": {
                    "properties": {
                        "timeframe": {
                            startDatetime: frozenTime().subtract(7, "day").format(),
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
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": TestTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Stacked percentage area",
                        "subtitle": "Basic timeseries widget",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                "series": [
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
                    "properties": {
                        "configuration": {
                            "legendPlacement": LegendPlacement.Right,
                            "enableZoom": true,
                            "leftAxisLabel": "Utilization (%)",
                            preset: TimeseriesChartPreset.StackedPercentageArea,
                        } as ITimeseriesWidgetConfig,
                    },
                },
                "timeframeSelection": {
                    "properties": {
                        "timeframe": {
                            startDatetime: frozenTime().subtract(7, "day").format(),
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
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": TestTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Stacked percentage area",
                        "subtitle": "Basic timeseries widget",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                "series": [
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
                    "properties": {
                        "configuration": {
                            "legendPlacement": LegendPlacement.Right,
                            "enableZoom": true,
                            "leftAxisLabel": "Utilization (%)",
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
                "timeframeSelection": {
                    "properties": {
                        "timeframe": {
                            startDatetime: frozenTime().subtract(7, "day").format(),
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
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": TestTimeseriesDataSource2.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Bar chart",
                        "subtitle": "Basic timeseries widget",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                "series": [
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
                    "properties": {
                        "configuration": {
                            "legendPlacement": LegendPlacement.Right,
                            "enableZoom": true,
                            "leftAxisLabel": "Utilization (%)",
                            preset: TimeseriesChartPreset.StackedBar,
                        } as Partial<ITimeseriesWidgetConfig>,
                    },
                },
                "timeframeSelection": {
                    "properties": {
                        "timeframe": {
                            startDatetime: frozenTime().subtract(7, "day").format(),
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
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": TestTimeseriesDataSource2.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Bar chart",
                        "subtitle": "Basic timeseries widget",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                "series": [
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
                    "properties": {
                        "configuration": {
                            "legendPlacement": LegendPlacement.Right,
                            "enableZoom": true,
                            "leftAxisLabel": "Utilization (%)",
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
                "timeframeSelection": {
                    "properties": {
                        "timeframe": {
                            startDatetime: frozenTime().subtract(7, "day").format(),
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
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": TestTimeseriesStatusDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Status chart",
                        "subtitle": "Basic timeseries widget",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                "series": [
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
                    "properties": {
                        "configuration": {
                            "legendPlacement": LegendPlacement.Right,
                            "enableZoom": true,
                            "leftAxisLabel": "Utilization (%)",
                            preset: TimeseriesChartPreset.StatusBar,
                        } as ITimeseriesWidgetConfig,
                    },
                },
                "timeframeSelection": {
                    "properties": {
                        "timeframe": {
                            startDatetime: frozenTime().subtract(14, "day").format(),
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
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": TestTimeseriesStatusIntervalDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                "header": {
                    "properties": {
                        "title": "Status chart",
                        "subtitle": "Basic timeseries widget",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                "series": [
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
                    "properties": {
                        "configuration": {
                            "legendPlacement": LegendPlacement.Right,
                            "enableZoom": true,
                            "leftAxisLabel": "Utilization (%)",
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
                "timeframeSelection": {
                    "properties": {
                        "timeframe": {
                            startDatetime: frozenTime().subtract(14, "day").format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
                    },
                },
            },
        },
    },
];
