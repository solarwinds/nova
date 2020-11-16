import {
    DEFAULT_PIZZAGNA_ROOT,
    IProportionalWidgetChartOptions,
    IProviderConfiguration,
    IWidget,
    LegendPlacement,
    PizzagnaLayer,
    ProportionalWidgetChartTypes,
    WellKnownProviders
} from "@solarwinds/nova-dashboards";

import { BeerReviewCountsByCityMockDataSource } from "../data/proportional-datasources";

export const proportionalConfig: IWidget = {
    id: "proportionalWidgetId",
    type: "proportional",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                "providers": {
                    [WellKnownProviders.Refresher]: {
                        "properties": {
                            "interval": 0,
                        },
                    },
                },
            },
            "header": {
                "properties": {
                    "title": "Beer Review Tally by City",
                    "subtitle": "These People Love Beer",
                },
            },
            "chart": {
                "providers": {
                    [WellKnownProviders.DataSource]: {
                        "providerId": BeerReviewCountsByCityMockDataSource.providerId,
                    } as IProviderConfiguration,
                },
                "properties": {
                    "configuration": {
                        "chartOptions": {
                            "type": ProportionalWidgetChartTypes.DonutChart,
                            "legendPlacement": LegendPlacement.Right,
                        } as IProportionalWidgetChartOptions,
                    },
                },
            },
        },
    },
};
