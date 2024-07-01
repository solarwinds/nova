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

import { IWidget, ScrollType } from "@nova-ui/dashboards";
import { DEFAULT_PIZZAGNA_ROOT } from "../../../../services/types";
import { PizzagnaLayer } from "../../../../types";

export const TABLE_WIDGET_PREVIEW_PIZZAGNA = {
    id: "widget4",
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
                    dataSource: {
                        providerId: "WIDGET_TABLE_DATA_SOURCE",
                    },
                },
                properties: {
                    configuration: {
                        columns: [
                            {
                                id: "column1",
                                label: "No",
                                isActive: true,
                                dataFieldIds: ["position"],
                                formatterId: "RawFormatterComponent",
                            },
                            {
                                id: "column2",
                                label: "Name",
                                isActive: true,
                                dataFieldIds: ["name"],
                                formatterId: "RawFormatterComponent",
                            },
                        ],
                        sorterConfiguration: {
                            descendantSorting: true,
                            sortBy: "column1",
                        },
                        scrollType: ScrollType.paginator,
                        paginatorConfiguration: {
                            pageSize: 10,
                            pageSizeSet: [10, 20, 30],
                        },
                        hasVirtualScroll: false,
                        // hasVirtualScroll: true,
                    },
                },
            },
        },
    },
};

export const EDITOR_PIZZAGNA = {
    [PizzagnaLayer.Structure]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            id: DEFAULT_PIZZAGNA_ROOT,
            componentType: "FormStackComponent",
            properties: {
                elementClass: "flex-grow-1 overflow-auto nui-scroll-shadows",
                nodes: ["presentation", "columns"],
            },
        },
        presentation: {
            id: "presentation",
            componentType: "WidgetConfiguratorSectionComponent",
            properties: {
                headerText: "Presentation",
                nodes: [
                    "titleAndDescription",
                    "dataSource",
                    "filters",
                    "scrollType",
                ],
            },
        },
        titleAndDescription: {
            id: "titleAndDescription",
            componentType: "TitleAndDescriptionConfigurationComponent",
            providers: {
                TITLE_AND_DESCRIPTION_CONVERTER: {
                    providerId: "TITLE_AND_DESCRIPTION_CONVERTER",
                },
            },
        },
        dataSource: {
            id: "dataSource",
            componentType: "DataSourceConfigurationComponent",
            properties: {
                dataSourceProviders: ["WIDGET_TABLE_DATA_SOURCE"],
            },
            providers: {
                DATA_SOURCE_CONVERTER: {
                    providerId: "DATA_SOURCE_CONVERTER",
                    properties: {
                        componentName: "table",
                    },
                },
            },
        },
        filters: {
            id: "filters",
            componentType: "TableFiltersEditorComponent",
            providers: {
                TABLE_FILTERS_TRANSFORMER: {
                    providerId: "TABLE_FILTERS_TRANSFORMER",
                },
            },
        },
        scrollType: {
            id: "scrollType",
            componentType: "TableScrollTypeEditorComponent",
            providers: {
                NOVA_TABLE_SCROLL_TYPE_CONVERTER: {
                    providerId: "NOVA_TABLE_SCROLL_TYPE_CONVERTER",
                },
            },
        },
        columns: {
            id: "columns",
            componentType: "TableColumnsConfigurationComponent",
            providers: {
                columnsTransformer: {
                    providerId: "TABLE_COLUMNS_TRANSFORMER",
                },
            },
        },
    },
};
