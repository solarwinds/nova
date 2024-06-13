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
    IProportionalWidgetChartOptions,
    IProportionalWidgetConfig,
    IProviderConfiguration,
    ISerializableTimeframe,
    ITableWidgetConfig,
    ITimeseriesItemConfiguration,
    ITimeseriesWidgetConfig,
    IWidget,
    LegendPlacement,
    NOVA_URL_INTERACTION_HANDLER,
    PizzagnaLayer,
    ProportionalWidgetChartTypes,
    RawFormatterComponent,
    WellKnownProviders,
} from "@nova-ui/dashboards";

import { AcmeProportionalDataSource } from "../data/proportional-datasources";
import { AcmeTableMockDataSource } from "../data/table/acme-table-mock-data-source.service";
import { AcmeTimeseriesDataSource } from "../data/timeseries-data-sources";

export const positions: Record<string, GridsterItem> = {
    widget1: {
        cols: 10,
        rows: 12,
        y: 0,
        x: 0,
    },
    widget2: {
        cols: 7,
        rows: 6,
        y: 0,
        x: 5,
    },
    widget3: {
        cols: 6,
        rows: 6,
        y: 6,
        x: 0,
    },
    widget4: {
        cols: 6,
        rows: 6,
        y: 6,
        x: 6,
    },
    widget5: {
        cols: 7,
        rows: 6,
        y: 12,
        x: 5,
    },
    widget6: {
        cols: 5,
        rows: 6,
        y: 12,
        x: 0,
    },
    widget7: {
        cols: 6,
        rows: 6,
        y: 18,
        x: 0,
    },
    widget8: {
        cols: 6,
        rows: 6,
        y: 18,
        x: 6,
    },
};

export const widgets: IWidget[] = [
    {
        id: "widget1",
        type: "table",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.InteractionHandler]: {
                            providerId: NOVA_URL_INTERACTION_HANDLER,
                        },
                        // [WellKnownProviders.EventBusDebugger]: {
                        //     providerId: NOVA_EVENT_BUS_DEBUGGER,
                        // },
                    },
                },
                header: {
                    properties: {
                        title: "Table Widget!",
                        subtitle: "Basic table widget",
                        collapsible: true,
                    },
                },
                table: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: AcmeTableMockDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                    properties: {
                        configuration: {
                            interactive: true,
                            columns: [
                                {
                                    id: "column1",
                                    label: "No.",
                                    isActive: true,
                                    formatter: {
                                        componentType:
                                            RawFormatterComponent.lateLoadKey,
                                        properties: {
                                            dataFieldIds: {
                                                value: "position",
                                            },
                                        },
                                    },
                                },
                                {
                                    id: "column2",
                                    label: "Name",
                                    isActive: true,
                                    formatter: {
                                        componentType:
                                            RawFormatterComponent.lateLoadKey,
                                        properties: {
                                            dataFieldIds: {
                                                value: "name",
                                            },
                                        },
                                    },
                                },
                                {
                                    id: "column3",
                                    label: "Status",
                                    isActive: true,
                                    formatter: {
                                        componentType:
                                            RawFormatterComponent.lateLoadKey,
                                        properties: {
                                            dataFieldIds: {
                                                value: "status",
                                            },
                                        },
                                    },
                                },
                            ],
                            sorterConfiguration: {
                                descendantSorting: false,
                                sortBy: "column1",
                            },
                            paginatorConfiguration: {
                                enabled: true,
                            },
                            hasVirtualScroll: false,
                            searchConfiguration: {
                                enabled: true,
                            },
                        } as ITableWidgetConfig,
                    },
                },
            },
        },
    },
    // {
    //     id: "widget2",
    //     type: "proportional",
    //     pizzagna: {
    //         [PizzagnaLayer.Configuration]: {
    //             [DEFAULT_PIZZAGNA_ROOT]: {
    //                 providers: {
    //                     // [WellKnownProviders.EventBusDebugger]: {
    //                     //     providerId: NOVA_EVENT_BUS_DEBUGGER,
    //                     // },
    //                     [WellKnownProviders.InteractionHandler]: {
    //                         providerId: NOVA_URL_INTERACTION_HANDLER,
    //                         properties: {
    //                             url: "${data.link}",
    //                         },
    //                     },
    //                 },
    //             },
    //             header: {
    //                 properties: {
    //                     title: "Proportional Widget!",
    //                     subtitle: "Proportional widget with legend formatters",
    //                 },
    //             },
    //             chart: {
    //                 providers: {
    //                     [WellKnownProviders.DataSource]: {
    //                         providerId: AcmeProportionalDataSource.providerId,
    //                     } as IProviderConfiguration,
    //                     [WellKnownProviders.Adapter]: {
    //                         properties: {
    //                             [WellKnownProviders.DataSource]: {
    //                                 properties: {
    //                                     isEuropeOnly: false,
    //                                 },
    //                             },
    //                         },
    //                     } as Partial<IProviderConfiguration>,
    //                 },
    //                 properties: {
    //                     configuration: {
    //                         interactive: true,
    //                         chartDonutContentLabel: "Some label",
    //                         chartDonutContentIcon: "printer",
    //                         chartOptions: {
    //                             type: ProportionalWidgetChartTypes.VerticalBarChart,
    //                             legendPlacement: LegendPlacement.Right,
    //                         } as IProportionalWidgetChartOptions,
    //                         chartColors: [
    //                             "var(--nui-color-chart-eight)",
    //                             "var(--nui-color-chart-nine)",
    //                             "var(--nui-color-chart-ten)",
    //                         ],
    //                     } as IProportionalWidgetConfig,
    //                 },
    //             },
    //         },
    //     },
    // },
    // {
    //     id: "widget3",
    //     type: "timeseries",
    //     pizzagna: {
    //         [PizzagnaLayer.Configuration]: {
    //             [DEFAULT_PIZZAGNA_ROOT]: {
    //                 providers: {
    //                     [WellKnownProviders.DataSource]: {
    //                         providerId: AcmeTimeseriesDataSource.providerId,
    //                     } as IProviderConfiguration,
    //                     [WellKnownProviders.InteractionHandler]: {
    //                         providerId: NOVA_URL_INTERACTION_HANDLER,
    //                     },
    //                     // [WellKnownProviders.EventBusDebugger]: {
    //                     //     providerId: NOVA_EVENT_BUS_DEBUGGER,
    //                     // },
    //                 },
    //             },
    //             header: {
    //                 properties: {
    //                     title: "Timeseries Widget!",
    //                     subtitle: "Basic timeseries widget",
    //                 },
    //             },
    //             chart: {
    //                 providers: {
    //                     [WellKnownProviders.Adapter]: {
    //                         properties: {
    //                             series: [
    //                                 {
    //                                     id: "series-2",
    //                                     label: "Average CPU Load",
    //                                     selectedSeriesId: "series-2",
    //                                 },
    //                             ] as ITimeseriesItemConfiguration[],
    //                         },
    //                     } as Partial<IProviderConfiguration>,
    //                 },
    //                 properties: {
    //                     configuration: {
    //                         legendPlacement: LegendPlacement.Right,
    //                         enableZoom: true,
    //                         leftAxisLabel: "Utilization (%)",
    //                         chartColors: [
    //                             "var(--nui-color-chart-eight)",
    //                             "var(--nui-color-chart-nine)",
    //                             "var(--nui-color-chart-ten)",
    //                         ],
    //                     } as ITimeseriesWidgetConfig,
    //                 },
    //             },
    //             timeframeSelection: {
    //                 properties: {
    //                     timeframe: {
    //                         selectedPresetId: "last7Days",
    //                     } as ISerializableTimeframe,
    //                     minDate: moment().subtract(10, "days").format(),
    //                     maxDate: moment().format(),
    //                 },
    //             },
    //         },
    //     },
    // },
    // {
    //     id: "widget4",
    //     type: "table",
    //     pizzagna: {
    //         [PizzagnaLayer.Configuration]: {
    //             [DEFAULT_PIZZAGNA_ROOT]: {
    //                 providers: {
    //                     [WellKnownProviders.InteractionHandler]: {
    //                         providerId: NOVA_URL_INTERACTION_HANDLER,
    //                     },
    //                     // [WellKnownProviders.EventBusDebugger]: {
    //                     //     providerId: NOVA_EVENT_BUS_DEBUGGER,
    //                     // },
    //                 },
    //             },
    //             header: {
    //                 properties: {
    //                     title: "Table Widget!",
    //                     subtitle: "Basic table widget",
    //                     collapsible: true,
    //                 },
    //             },
    //             table: {
    //                 providers: {
    //                     [WellKnownProviders.DataSource]: {
    //                         providerId: AcmeTableMockDataSource.providerId,
    //                     } as IProviderConfiguration,
    //                 },
    //                 properties: {
    //                     configuration: {
    //                         interactive: true,
    //                         columns: [
    //                             {
    //                                 id: "column1",
    //                                 label: "No.",
    //                                 isActive: true,
    //                                 formatter: {
    //                                     componentType:
    //                                         RawFormatterComponent.lateLoadKey,
    //                                     properties: {
    //                                         dataFieldIds: {
    //                                             value: "position",
    //                                         },
    //                                     },
    //                                 },
    //                             },
    //                             {
    //                                 id: "column2",
    //                                 label: "Name",
    //                                 isActive: true,
    //                                 formatter: {
    //                                     componentType:
    //                                         RawFormatterComponent.lateLoadKey,
    //                                     properties: {
    //                                         dataFieldIds: {
    //                                             value: "name",
    //                                         },
    //                                     },
    //                                 },
    //                             },
    //                             {
    //                                 id: "column3",
    //                                 label: "Status",
    //                                 isActive: true,
    //                                 formatter: {
    //                                     componentType:
    //                                         RawFormatterComponent.lateLoadKey,
    //                                     properties: {
    //                                         dataFieldIds: {
    //                                             value: "status",
    //                                         },
    //                                     },
    //                                 },
    //                             },
    //                         ],
    //                         sorterConfiguration: {
    //                             descendantSorting: false,
    //                             sortBy: "column1",
    //                         },
    //                         hasVirtualScroll: true,
    //                         searchConfiguration: {
    //                             enabled: true,
    //                         },
    //                     } as ITableWidgetConfig,
    //                 },
    //             },
    //         },
    //     },
    // },
    // {
    //     id: "widget5",
    //     type: "proportional",
    //     pizzagna: {
    //         [PizzagnaLayer.Configuration]: {
    //             [DEFAULT_PIZZAGNA_ROOT]: {
    //                 providers: {
    //                     // [WellKnownProviders.EventBusDebugger]: {
    //                     //     providerId: NOVA_EVENT_BUS_DEBUGGER,
    //                     // },
    //                     [WellKnownProviders.InteractionHandler]: {
    //                         providerId: NOVA_URL_INTERACTION_HANDLER,
    //                         properties: {
    //                             url: "${data.link}",
    //                         },
    //                     },
    //                 },
    //             },
    //             header: {
    //                 properties: {
    //                     title: "Proportional Widget!",
    //                     subtitle: "Proportional widget with legend formatters",
    //                 },
    //             },
    //             chart: {
    //                 providers: {
    //                     [WellKnownProviders.DataSource]: {
    //                         providerId: AcmeProportionalDataSource.providerId,
    //                     } as IProviderConfiguration,
    //                     [WellKnownProviders.Adapter]: {
    //                         properties: {
    //                             [WellKnownProviders.DataSource]: {
    //                                 properties: {
    //                                     isEuropeOnly: false,
    //                                 },
    //                             },
    //                         },
    //                     } as Partial<IProviderConfiguration>,
    //                 },
    //                 properties: {
    //                     configuration: {
    //                         interactive: true,
    //                         chartDonutContentLabel: "Some label",
    //                         chartDonutContentIcon: "printer",
    //                         chartOptions: {
    //                             type: ProportionalWidgetChartTypes.VerticalBarChart,
    //                             legendPlacement: LegendPlacement.Right,
    //                         } as IProportionalWidgetChartOptions,
    //                         chartColors: [
    //                             "var(--nui-color-chart-eight)",
    //                             "var(--nui-color-chart-nine)",
    //                             "var(--nui-color-chart-ten)",
    //                         ],
    //                     } as IProportionalWidgetConfig,
    //                 },
    //             },
    //         },
    //     },
    // },
    // {
    //     id: "widget6",
    //     type: "table",
    //     pizzagna: {
    //         [PizzagnaLayer.Configuration]: {
    //             [DEFAULT_PIZZAGNA_ROOT]: {
    //                 providers: {
    //                     [WellKnownProviders.InteractionHandler]: {
    //                         providerId: NOVA_URL_INTERACTION_HANDLER,
    //                     },
    //                     // [WellKnownProviders.EventBusDebugger]: {
    //                     //     providerId: NOVA_EVENT_BUS_DEBUGGER,
    //                     // },
    //                 },
    //             },
    //             header: {
    //                 properties: {
    //                     title: "Table Widget!",
    //                     subtitle: "Basic table widget",
    //                     collapsible: true,
    //                 },
    //             },
    //             table: {
    //                 providers: {
    //                     [WellKnownProviders.DataSource]: {
    //                         providerId: AcmeTableMockDataSource.providerId,
    //                     } as IProviderConfiguration,
    //                 },
    //                 properties: {
    //                     configuration: {
    //                         interactive: true,
    //                         columns: [
    //                             {
    //                                 id: "column1",
    //                                 label: "No.",
    //                                 isActive: true,
    //                                 formatter: {
    //                                     componentType:
    //                                         RawFormatterComponent.lateLoadKey,
    //                                     properties: {
    //                                         dataFieldIds: {
    //                                             value: "position",
    //                                         },
    //                                     },
    //                                 },
    //                             },
    //                             {
    //                                 id: "column2",
    //                                 label: "Name",
    //                                 isActive: true,
    //                                 formatter: {
    //                                     componentType:
    //                                         RawFormatterComponent.lateLoadKey,
    //                                     properties: {
    //                                         dataFieldIds: {
    //                                             value: "name",
    //                                         },
    //                                     },
    //                                 },
    //                             },
    //                             {
    //                                 id: "column3",
    //                                 label: "Status",
    //                                 isActive: true,
    //                                 formatter: {
    //                                     componentType:
    //                                         RawFormatterComponent.lateLoadKey,
    //                                     properties: {
    //                                         dataFieldIds: {
    //                                             value: "status",
    //                                         },
    //                                     },
    //                                 },
    //                             },
    //                         ],
    //                         sorterConfiguration: {
    //                             descendantSorting: false,
    //                             sortBy: "column1",
    //                         },
    //                         hasVirtualScroll: true,
    //                         searchConfiguration: {
    //                             enabled: true,
    //                         },
    //                     } as ITableWidgetConfig,
    //                 },
    //             },
    //         },
    //     },
    // },
    // {
    //     id: "widget7",
    //     type: "timeseries",
    //     pizzagna: {
    //         [PizzagnaLayer.Configuration]: {
    //             [DEFAULT_PIZZAGNA_ROOT]: {
    //                 providers: {
    //                     [WellKnownProviders.DataSource]: {
    //                         providerId: AcmeTimeseriesDataSource.providerId,
    //                     } as IProviderConfiguration,
    //                     [WellKnownProviders.InteractionHandler]: {
    //                         providerId: NOVA_URL_INTERACTION_HANDLER,
    //                     },
    //                     // [WellKnownProviders.EventBusDebugger]: {
    //                     //     providerId: NOVA_EVENT_BUS_DEBUGGER,
    //                     // },
    //                 },
    //             },
    //             header: {
    //                 properties: {
    //                     title: "Timeseries Widget!",
    //                     subtitle: "Basic timeseries widget",
    //                 },
    //             },
    //             chart: {
    //                 providers: {
    //                     [WellKnownProviders.Adapter]: {
    //                         properties: {
    //                             series: [
    //                                 {
    //                                     id: "series-2",
    //                                     label: "Average CPU Load",
    //                                     selectedSeriesId: "series-2",
    //                                 },
    //                             ] as ITimeseriesItemConfiguration[],
    //                         },
    //                     } as Partial<IProviderConfiguration>,
    //                 },
    //                 properties: {
    //                     configuration: {
    //                         legendPlacement: LegendPlacement.Right,
    //                         enableZoom: true,
    //                         leftAxisLabel: "Utilization (%)",
    //                         chartColors: [
    //                             "var(--nui-color-chart-eight)",
    //                             "var(--nui-color-chart-nine)",
    //                             "var(--nui-color-chart-ten)",
    //                         ],
    //                     } as ITimeseriesWidgetConfig,
    //                 },
    //             },
    //             timeframeSelection: {
    //                 properties: {
    //                     timeframe: {
    //                         selectedPresetId: "last7Days",
    //                     } as ISerializableTimeframe,
    //                     minDate: moment().subtract(10, "days").format(),
    //                     maxDate: moment().format(),
    //                 },
    //             },
    //         },
    //     },
    // },
    // {
    //     id: "widget8",
    //     type: "table",
    //     pizzagna: {
    //         [PizzagnaLayer.Configuration]: {
    //             [DEFAULT_PIZZAGNA_ROOT]: {
    //                 providers: {
    //                     [WellKnownProviders.InteractionHandler]: {
    //                         providerId: NOVA_URL_INTERACTION_HANDLER,
    //                     },
    //                     // [WellKnownProviders.EventBusDebugger]: {
    //                     //     providerId: NOVA_EVENT_BUS_DEBUGGER,
    //                     // },
    //                 },
    //             },
    //             header: {
    //                 properties: {
    //                     title: "Table Widget!",
    //                     subtitle: "Basic table widget",
    //                     collapsible: true,
    //                 },
    //             },
    //             table: {
    //                 providers: {
    //                     [WellKnownProviders.DataSource]: {
    //                         providerId: AcmeTableMockDataSource.providerId,
    //                     } as IProviderConfiguration,
    //                 },
    //                 properties: {
    //                     configuration: {
    //                         interactive: true,
    //                         columns: [
    //                             {
    //                                 id: "column1",
    //                                 label: "No.",
    //                                 isActive: true,
    //                                 formatter: {
    //                                     componentType:
    //                                         RawFormatterComponent.lateLoadKey,
    //                                     properties: {
    //                                         dataFieldIds: {
    //                                             value: "position",
    //                                         },
    //                                     },
    //                                 },
    //                             },
    //                             {
    //                                 id: "column2",
    //                                 label: "Name",
    //                                 isActive: true,
    //                                 formatter: {
    //                                     componentType:
    //                                         RawFormatterComponent.lateLoadKey,
    //                                     properties: {
    //                                         dataFieldIds: {
    //                                             value: "name",
    //                                         },
    //                                     },
    //                                 },
    //                             },
    //                             {
    //                                 id: "column3",
    //                                 label: "Status",
    //                                 isActive: true,
    //                                 formatter: {
    //                                     componentType:
    //                                         RawFormatterComponent.lateLoadKey,
    //                                     properties: {
    //                                         dataFieldIds: {
    //                                             value: "status",
    //                                         },
    //                                     },
    //                                 },
    //                             },
    //                         ],
    //                         sorterConfiguration: {
    //                             descendantSorting: false,
    //                             sortBy: "column1",
    //                         },
    //                         hasVirtualScroll: true,
    //                         searchConfiguration: {
    //                             enabled: true,
    //                         },
    //                     } as ITableWidgetConfig,
    //                 },
    //             },
    //         },
    //     },
    // },
];
