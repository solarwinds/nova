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
    IProportionalWidgetChartOptions,
    IProviderConfiguration,
    IWidget,
    LegendPlacement,
    LinkFormatterComponent,
    percentageAggregator,
    PercentageFormatterComponent,
    PizzagnaLayer,
    ProportionalWidgetChartTypes,
    SiUnitsFormatterComponent,
    sumAggregator,
    WellKnownProviders,
} from "@nova-ui/dashboards";

import {
    TestProportionalDataSource,
    TestProportionalDataSource3,
    TestProportionalDataSource4,
} from "../../data/proportional-data-sources";

export const positions: Record<string, GridsterItem> = {
    widget1: {
        cols: 4,
        rows: 4,
        x: 0,
        y: 0,
    },
    widget2: {
        cols: 5,
        rows: 8,
        x: 0,
        y: 4,
    },
    widget3: {
        cols: 4,
        rows: 4,
        x: 4,
        y: 0,
    },
    widget4: {
        cols: 3,
        rows: 8,
        x: 4,
        y: 4,
    },
    widget5: {
        cols: 4,
        rows: 6,
        x: 5,
        y: 0,
    },
    widget6: {
        cols: 4,
        rows: 6,
        x: 6,
        y: 4,
    },
};

export const widgets: IWidget[] = [
    {
        id: "widget1",
        type: "proportional",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                header: {
                    properties: {
                        title: "Proportional Widget!",
                        subtitle: "Proportional widget with legend formatters",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestProportionalDataSource3.providerId,
                        } as IProviderConfiguration,
                    },
                    properties: {
                        configuration: {
                            chartOptions: {
                                type: ProportionalWidgetChartTypes.PieChart,
                                legendPlacement: LegendPlacement.Right,
                                legendFormatter: {
                                    componentType:
                                        LinkFormatterComponent.lateLoadKey,
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
                header: {
                    properties: {
                        title: "Proportional Widget!",
                        subtitle: "Proportional widget with legend formatters",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestProportionalDataSource3.providerId,
                        } as IProviderConfiguration,
                    },
                    properties: {
                        configuration: {
                            chartOptions: {
                                type: ProportionalWidgetChartTypes.VerticalBarChart,
                                legendPlacement: LegendPlacement.Bottom,
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
                header: {
                    properties: {
                        title: "Proportional Widget!",
                        subtitle: "Proportional widget with legend formatters",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestProportionalDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                    properties: {
                        configuration: {
                            chartOptions: {
                                type: ProportionalWidgetChartTypes.HorizontalBarChart,
                                legendPlacement: LegendPlacement.Right,
                                legendFormatter: {
                                    componentType:
                                        LinkFormatterComponent.lateLoadKey,
                                },
                                horizontalBarTickLabelConfig: {
                                    maxWidth: {
                                        left: 55,
                                    },
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
                header: {
                    properties: {
                        title: "Proportional Widget!",
                        subtitle: "Proportional widget with legend formatters",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestProportionalDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                    properties: {
                        configuration: {
                            chartDonutContentLabel: "Some label",
                            chartDonutContentIcon: "printer",
                            chartOptions: {
                                type: ProportionalWidgetChartTypes.DonutChart,
                                legendPlacement: LegendPlacement.Bottom,
                            } as IProportionalWidgetChartOptions,
                        },
                    },
                },
            },
        },
    },
    {
        id: "widget5",
        type: "proportional",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                header: {
                    properties: {
                        title: "Proportional Widget!",
                        subtitle: "Proportional widget with legend formatters",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestProportionalDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                    properties: {
                        configuration: {
                            chartOptions: {
                                type: ProportionalWidgetChartTypes.DonutChart,
                                legendPlacement: LegendPlacement.Bottom,
                                donutContentConfig: {
                                    formatter: {
                                        componentType:
                                            PercentageFormatterComponent.lateLoadKey,
                                    },
                                    aggregator: {
                                        aggregatorType:
                                            percentageAggregator.aggregatorType,
                                    },
                                },
                            } as IProportionalWidgetChartOptions,
                        },
                    },
                },
            },
        },
    },
    {
        id: "widget6",
        type: "proportional",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                header: {
                    properties: {
                        title: "Proportional Widget!",
                        subtitle: "Proportional widget with legend formatters",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestProportionalDataSource4.providerId,
                        } as IProviderConfiguration,
                    },
                    properties: {
                        configuration: {
                            chartOptions: {
                                type: ProportionalWidgetChartTypes.DonutChart,
                                legendPlacement: LegendPlacement.Right,
                                donutContentConfig: {
                                    formatter: {
                                        componentType:
                                            SiUnitsFormatterComponent.lateLoadKey,
                                    },
                                    aggregator: {
                                        aggregatorType:
                                            sumAggregator.aggregatorType,
                                    },
                                },
                            } as IProportionalWidgetChartOptions,
                        },
                    },
                },
            },
        },
    },
];
