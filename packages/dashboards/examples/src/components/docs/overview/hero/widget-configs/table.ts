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
    ITableWidgetColumnConfig,
    ITableWidgetSorterConfig,
    IWidget,
    PizzagnaLayer,
    RawFormatterComponent,
    WellKnownProviders,
} from "@nova-ui/dashboards";

import { BeerDataSource } from "../data/table/beer-data-source";

export const tableConfig: IWidget = {
    id: "tableWidgetId",
    type: "table",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            header: {
                properties: {
                    title: "Stupendous Suds",
                    subtitle: "Try These Brilliant Brews",
                },
            },
            table: {
                providers: {
                    [WellKnownProviders.DataSource]: {
                        providerId: BeerDataSource.providerId,
                    },
                },
                properties: {
                    configuration: {
                        columns: [
                            {
                                id: "column1",
                                label: "Beer Name",
                                isActive: true,
                                width: 185,
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
                                id: "column2",
                                label: "Tagline",
                                isActive: true,
                                width: 250,
                                formatter: {
                                    componentType:
                                        RawFormatterComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            value: "tagline",
                                        },
                                    },
                                },
                            },
                            {
                                id: "column3",
                                label: "First Brewed",
                                isActive: true,
                                formatter: {
                                    componentType:
                                        RawFormatterComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            value: "first_brewed",
                                        },
                                    },
                                },
                            },
                            {
                                id: "column4",
                                label: "Description",
                                isActive: true,
                                width: 275,
                                formatter: {
                                    componentType:
                                        RawFormatterComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            value: "description",
                                        },
                                    },
                                },
                            },
                        ] as ITableWidgetColumnConfig[],
                        sorterConfiguration: {
                            descendantSorting: false,
                            sortBy: "",
                        } as ITableWidgetSorterConfig,
                        hasVirtualScroll: true,
                    },
                },
            },
        },
    },
};
