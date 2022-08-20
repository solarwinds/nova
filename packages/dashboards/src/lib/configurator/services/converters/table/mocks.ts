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
                        hasVirtualScroll: true,
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
                nodes: ["titleAndDescription", "dataSource", "filters"],
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
