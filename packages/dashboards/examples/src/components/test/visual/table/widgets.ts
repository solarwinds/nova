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
    IProviderConfiguration,
    ITableWidgetColumnConfig,
    ITableWidgetSorterConfig,
    IWidget,
    LinkFormatterComponent,
    PizzagnaLayer,
    RawFormatterComponent,
    WellKnownProviders,
} from "@nova-ui/dashboards";

import {
    TestTableDataSource,
    TestTableDataSource2,
} from "../../data/table-datasources";

export const positions: Record<string, GridsterItem> = {
    widget1: {
        cols: 6,
        rows: 6,
        x: 0,
        y: 0,
    },
    widget2: {
        cols: 6,
        rows: 6,
        x: 6,
        y: 0,
    },
    widget3: {
        cols: 6,
        rows: 6,
        x: 0,
        y: 6,
    },
};

export const widgets: IWidget[] = [
    {
        id: "widget1",
        type: "table",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                header: {
                    properties: {
                        title: "Table Widget!",
                        subtitle: "Basic table widget",
                    },
                },
                table: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestTableDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                    properties: {
                        configuration: {
                            columns: [
                                {
                                    id: "column1",
                                    label: "No",
                                    isActive: true,
                                    width: 100,
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
                                    label: "Location",
                                    isActive: true,
                                    width: 100,
                                    formatter: {
                                        componentType:
                                            LinkFormatterComponent.lateLoadKey,
                                        properties: {
                                            dataFieldIds: {
                                                value: "firstUrlLabel",
                                                link: "firstUrl",
                                            },
                                        },
                                    },
                                },
                            ] as ITableWidgetColumnConfig[],
                            sorterConfiguration: {
                                descendantSorting: true,
                                sortBy: "column1",
                            } as ITableWidgetSorterConfig,
                            hasVirtualScroll: true,
                        },
                    },
                },
            },
        },
    },
    {
        id: "widget2",
        type: "table",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                header: {
                    properties: {
                        title: "An Empty Table Widget!",
                        subtitle: "Empty table widget",
                    },
                },
                table: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestTableDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                    properties: {
                        configuration: {
                            columns: [] as ITableWidgetColumnConfig[],
                            sorterConfiguration: {
                                descendantSorting: true,
                                sortBy: "column1",
                            } as ITableWidgetSorterConfig,
                            hasVirtualScroll: true,
                        },
                    },
                },
            },
        },
    },
    {
        id: "widget3",
        type: "table",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                header: {
                    properties: {
                        title: "Another Table Widget!",
                        subtitle: "Basic table widget",
                    },
                },
                table: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestTableDataSource2.providerId,
                        } as IProviderConfiguration,
                    },
                    properties: {
                        configuration: {
                            columns: [
                                {
                                    id: "column1",
                                    label: "No",
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
                            ] as ITableWidgetColumnConfig[],
                            sorterConfiguration: {
                                descendantSorting: true,
                                sortBy: "column1",
                            } as ITableWidgetSorterConfig,
                            hasVirtualScroll: true,
                        },
                    },
                },
            },
        },
    },
];
