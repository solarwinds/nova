import {
    IProviderConfiguration,
    ITableWidgetColumnConfig,
    ITableWidgetSorterConfig,
    IWidget,
    LinkFormatterComponent,
    PizzagnaLayer,
    RawFormatterComponent,
    WellKnownProviders
} from "@solarwinds/nova-dashboards";
import { GridsterItem } from "angular-gridster2";

import { TestTableDataSource, TestTableDataSource2 } from "../../data/table-datasources";

export const positions: Record<string, GridsterItem> = {
    "widget1": {
        "cols": 6,
        "rows": 6,
        "x": 0,
        "y": 0,
    },
    "widget2": {
        "cols": 6,
        "rows": 6,
        "x": 6,
        "y": 0,
    },
    "widget3": {
        "cols": 6,
        "rows": 6,
        "x": 0,
        "y": 6,
    },
};

export const widgets: IWidget[] = [
    {
        id: "widget1",
        type: "table",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    properties: {
                        title: "Table Widget!",
                        subtitle: "Basic table widget",
                    },
                },
                "table": {
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
                                    formatter: {
                                        componentType: RawFormatterComponent.lateLoadKey,
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
                                        componentType: RawFormatterComponent.lateLoadKey,
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
                                    formatter: {
                                        componentType: LinkFormatterComponent.lateLoadKey,
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
                "header": {
                    properties: {
                        title: "An Empty Table Widget!",
                        subtitle: "Empty table widget",
                    },
                },
                "table": {
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
                "header": {
                    properties: {
                        title: "Table Widget!",
                        subtitle: "Basic table widget",
                    },
                },
                "table": {
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
                                        componentType: RawFormatterComponent.lateLoadKey,
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
                                        componentType: RawFormatterComponent.lateLoadKey,
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
