import {
    IProportionalWidgetChartOptions,
    IProviderConfiguration,
    IWidget,
    LegendPlacement,
    LinkFormatterComponent,
    PizzagnaLayer,
    ProportionalWidgetChartTypes,
    WellKnownProviders,
} from "@solarwinds/nova-dashboards";
import { GridsterItem } from "angular-gridster2";

import { TestProportionalDataSource, TestProportionalDataSource3 } from "../../data/proportional-data-sources";

export const positions: Record<string, GridsterItem> = {
    "widget1": {
        "cols": 6,
        "rows": 4,
        "x": 0,
        "y": 0,
    },
    "widget2": {
        "cols": 7,
        "rows": 8,
        "x": 0,
        "y": 6,
    },
    "widget3": {
        "cols": 6,
        "rows": 4,
        "x": 6,
        "y": 0,
    },
    "widget4": {
        "cols": 5,
        "rows": 8,
        "x": 7,
        "y": 6,
    },
};

export const widgets: IWidget[] = [
    {
        id: "widget1",
        type: "proportional",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "Proportional Widget!",
                        "subtitle": "Proportional widget with legend formatters",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": TestProportionalDataSource3.providerId,
                        } as IProviderConfiguration,
                    },
                    "properties": {
                        "configuration": {
                            "chartOptions": {
                                "type": ProportionalWidgetChartTypes.PieChart,
                                "legendPlacement": LegendPlacement.Right,
                                "legendFormatter": {
                                    "componentType": LinkFormatterComponent.lateLoadKey,
                                },
                            } as IProportionalWidgetChartOptions,
                        },
                    },
                },
            },
        },
    },
    {
        id: "widget2",
        type: "proportional",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "Proportional Widget!",
                        "subtitle": "Proportional widget with legend formatters",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": TestProportionalDataSource3.providerId,
                        } as IProviderConfiguration,
                    },
                    "properties": {
                        "configuration": {
                            "chartOptions": {
                                "type": ProportionalWidgetChartTypes.VerticalBarChart,
                                "legendPlacement": LegendPlacement.Bottom,
                            } as IProportionalWidgetChartOptions,
                        },
                    },
                },
            },
        },
    },
    {
        id: "widget3",
        type: "proportional",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "Proportional Widget!",
                        "subtitle": "Proportional widget with legend formatters",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": TestProportionalDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                    "properties": {
                        "configuration": {
                            "chartOptions": {
                                "type": ProportionalWidgetChartTypes.HorizontalBarChart,
                                "legendPlacement": LegendPlacement.Right,
                                "legendFormatter": {
                                    "componentType": LinkFormatterComponent.lateLoadKey,
                                },
                            } as IProportionalWidgetChartOptions,
                        },
                    },
                },
            },
        },
    },
    {
        id: "widget4",
        type: "proportional",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "Proportional Widget!",
                        "subtitle": "Proportional widget with legend formatters",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": TestProportionalDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                    "properties": {
                        "configuration": {
                            "chartOptions": {
                                "type": ProportionalWidgetChartTypes.DonutChart,
                                "legendPlacement": LegendPlacement.Bottom,
                            } as IProportionalWidgetChartOptions,
                        },
                    },
                },
            },
        },
    },
];
