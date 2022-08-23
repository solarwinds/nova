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
