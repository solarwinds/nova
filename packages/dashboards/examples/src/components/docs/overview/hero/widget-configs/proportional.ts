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
    IProportionalWidgetChartOptions,
    IProviderConfiguration,
    IWidget,
    LegendPlacement,
    PizzagnaLayer,
    ProportionalWidgetChartTypes,
    WellKnownProviders,
} from "@nova-ui/dashboards";

import { BeerReviewCountsByCityMockDataSource } from "../data/proportional-datasources";

export const proportionalConfig: IWidget = {
    id: "proportionalWidgetId",
    type: "proportional",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                providers: {
                    [WellKnownProviders.Refresher]: {
                        properties: {
                            interval: 0,
                        },
                    },
                },
            },
            header: {
                properties: {
                    title: "Beer Review Tally by City",
                    subtitle: "These People Love Beer",
                },
            },
            chart: {
                providers: {
                    [WellKnownProviders.DataSource]: {
                        providerId:
                            BeerReviewCountsByCityMockDataSource.providerId,
                    } as IProviderConfiguration,
                },
                properties: {
                    configuration: {
                        chartOptions: {
                            type: ProportionalWidgetChartTypes.DonutChart,
                            legendPlacement: LegendPlacement.Right,
                        } as IProportionalWidgetChartOptions,
                    },
                },
            },
        },
    },
};
