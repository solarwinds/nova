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
    DEFAULT_PIZZAGNA_ROOT,
    IProviderConfiguration,
    IRefresherProperties,
    IWidget,
    KpiComponent,
    NOVA_KPI_DATASOURCE_ADAPTER,
    PizzagnaLayer,
    WellKnownProviders,
} from "@nova-ui/dashboards";

import {
    HarryPotterAverageRatingDataSource,
    HarryPotterRatingsCountDataSource,
} from "../data/kpi-datasources";

export const kpiConfig: IWidget = {
    id: "kpiWidgetId",
    type: "kpi",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                providers: {
                    [WellKnownProviders.Refresher]: {
                        properties: {
                            // Configuring the refresher interval so that our data source is invoked every ten minutes
                            interval: 60 * 10,
                            enabled: true,
                        } as IRefresherProperties,
                    } as Partial<IProviderConfiguration>,
                },
            },
            header: {
                properties: {
                    title: "Harry Potter and the Sorcerer's Stone",
                    subtitle: "By J. K. Rowling",
                },
            },
            tiles: {
                properties: {
                    nodes: ["kpi1", "kpi2"],
                },
            },
            kpi1: {
                id: "kpi1",
                componentType: KpiComponent.lateLoadKey,
                properties: {
                    widgetData: {
                        label: "Average Rating",
                        backgroundColor: "var(--nui-color-chart-three)",
                        units: "out of 5 Stars",
                    },
                },
                providers: {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "kpi1"
                        providerId:
                            HarryPotterAverageRatingDataSource.providerId,
                    } as IProviderConfiguration,
                    [WellKnownProviders.Adapter]: {
                        providerId: NOVA_KPI_DATASOURCE_ADAPTER,
                        properties: {
                            componentId: "kpi1",
                            propertyPath: "widgetData",
                        },
                    } as IProviderConfiguration,
                },
            },
            kpi2: {
                id: "kpi2",
                componentType: KpiComponent.lateLoadKey,
                properties: {
                    widgetData: {
                        label: "Reader Feedback",
                        units: "Ratings",
                    },
                },
                providers: {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "kpi"
                        providerId:
                            HarryPotterRatingsCountDataSource.providerId,
                    } as IProviderConfiguration,
                    [WellKnownProviders.Adapter]: {
                        providerId: NOVA_KPI_DATASOURCE_ADAPTER,
                        properties: {
                            componentId: "kpi2",
                            propertyPath: "widgetData",
                        },
                    } as IProviderConfiguration,
                },
            },
        },
    },
};
