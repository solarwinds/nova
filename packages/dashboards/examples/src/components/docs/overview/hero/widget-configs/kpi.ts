import {
    DEFAULT_PIZZAGNA_ROOT,
    IProviderConfiguration,
    IRefresherProperties,
    IWidget,
    KpiComponent,
    NOVA_KPI_DATASOURCE_ADAPTER,
    PizzagnaLayer,
    WellKnownProviders,
} from "@nova-ui/dashboards";

import { HarryPotterAverageRatingDataSource, HarryPotterRatingsCountDataSource } from "../data/kpi-datasources";

export const kpiConfig: IWidget = {
    id: "kpiWidgetId",
    type: "kpi",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                "providers": {
                    [WellKnownProviders.Refresher]: {
                        "properties": {
                            // Configuring the refresher interval so that our data source is invoked every ten minutes
                            "interval": 60 * 10,
                            "enabled": true,
                        } as IRefresherProperties,
                    } as Partial<IProviderConfiguration>,
                },
            },
            "header": {
                "properties": {
                    "title": "Harry Potter and the Sorcerer's Stone",
                    "subtitle": "By J. K. Rowling",
                },
            },
            "tiles": {
                "properties": {
                    "nodes": ["kpi1", "kpi2"],
                },
            },
            "kpi1": {
                "id": "kpi1",
                "componentType": KpiComponent.lateLoadKey,
                "properties": {
                    "widgetData": {
                        "label": "Average Rating",
                        "backgroundColor": "var(--nui-color-chart-three)",
                        "units": "out of 5 Stars",
                    },
                },
                "providers": {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "kpi1"
                        "providerId": HarryPotterAverageRatingDataSource.providerId,
                    } as IProviderConfiguration,
                    [WellKnownProviders.Adapter]: {
                        "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                        "properties": {
                            "componentId": "kpi1",
                            "propertyPath": "widgetData",
                        },
                    } as IProviderConfiguration,
                },
            },
            "kpi2": {
                "id": "kpi2",
                "componentType": KpiComponent.lateLoadKey,
                "properties": {
                    "widgetData": {
                        "label": "Reader Feedback",
                        "units": "Ratings",
                    },
                },
                "providers": {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "kpi"
                        "providerId": HarryPotterRatingsCountDataSource.providerId,
                    } as IProviderConfiguration,
                    [WellKnownProviders.Adapter]: {
                        "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                        "properties": {
                            "componentId": "kpi2",
                            "propertyPath": "widgetData",
                        },
                    } as IProviderConfiguration,
                },
            },
        },
    },
};
