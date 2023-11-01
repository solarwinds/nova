// © 2023 SolarWinds Worldwide, LLC. All rights reserved.
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
    RiskScoreTileComponent,
    NOVA_KPI_DATASOURCE_ADAPTER,
    PizzagnaLayer,
    WellKnownProviders,
} from "@nova-ui/dashboards";

import { HarryPotterAverageRatingDataSource } from "../data/kpi-datasources";

export const riskScoreConfig: IWidget = {
    id: "riskScoreWidgetId",
    type: "risk-score",
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
                    nodes: ["riskScore1"],
                },
            },
            riskScore1: {
                id: "riskScore1",
                componentType: RiskScoreTileComponent.lateLoadKey,
                properties: {
                    widgetData: {
                        minValue: 0,
                        maxValue: 5,
                        label: `Average Rating`,
                        description: `Harry Potter and the Sorcerer's Stone By J. K. Rowling Average Rating Risk Score`,
                    },
                },
                providers: {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "riskScore1"
                        providerId:
                            HarryPotterAverageRatingDataSource.providerId,
                    } as IProviderConfiguration,
                    [WellKnownProviders.Adapter]: {
                        providerId: NOVA_KPI_DATASOURCE_ADAPTER,
                        properties: {
                            componentId: "riskScore1",
                            propertyPath: "widgetData",
                        },
                    } as IProviderConfiguration,
                },
            },
        },
    },
};
