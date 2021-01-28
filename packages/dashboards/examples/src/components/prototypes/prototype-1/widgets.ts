import {
    DEFAULT_PIZZAGNA_ROOT,
    IconFormatterComponent,
    IKpiColorRules,
    IKpiConfiguration,
    IProportionalWidgetChartOptions,
    IProportionalWidgetConfig,
    IProviderConfiguration,
    ISerializableTimeframe,
    ITableWidgetConfig,
    ITimeseriesItemConfiguration,
    ITimeseriesWidgetConfig,
    IWidget,
    KpiFormatterTypes,
    LegendPlacement,
    NOVA_KPI_COLOR_PRIORITIZER,
    NOVA_KPI_DATASOURCE_ADAPTER,
    NOVA_URL_INTERACTION_HANDLER,
    PizzagnaLayer,
    ProportionalWidgetChartTypes,
    RawFormatterComponent,
    SiUnitsFormatterComponent,
    WellKnownProviders
} from "@nova-ui/dashboards";
import { GridsterItem } from "angular-gridster2";
import moment from "moment/moment";

import { AcmeKpiDataSource, AcmeKpiDataSource2, AcmeKpiDataSource3 } from "../data/kpi-datasources";
import { AcmeProportionalDataSource, AcmeProportionalDataSource2 } from "../data/proportional-datasources";
import { AcmeTableDataSource } from "../data/table/acme-table-data-source.service";
import { AcmeTimeseriesDataSource } from "../data/timeseries-data-sources";

export const positions: Record<string, GridsterItem> = {
    "widget1": {
        "cols": 5,
        "rows": 6,
        "y": 0,
        "x": 0,
    },
    "widget2": {
        "cols": 7,
        "rows": 6,
        "y": 0,
        "x": 5,
    },
    "widget3": {
        "cols": 6,
        "rows": 6,
        "y": 6,
        "x": 0,
    },
    "widget4": {
        "cols": 6,
        "rows": 6,
        "y": 6,
        "x": 6,
    },
    "widget5": {
        "cols": 6,
        "rows": 6,
        "y": 12,
        "x": 0,
    },
};

export const widgets: IWidget[] = [
    {
        id: "widget1",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "KPI Widget!",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        interaction: {
                            providerId: NOVA_URL_INTERACTION_HANDLER,
                            properties: {
                                url: "${data.link}",
                            },
                        },
                        // Uncomment the code below to make use of the Kpi Scale Sync Broker
                        // kpiScaleSyncBroker: {
                        //     providerId: NOVA_KPI_SCALE_SYNC_BROKER,
                        //     properties: {
                        //         scaleSyncConfig: [
                        //             { id: "value", type: "min" } as IBrokerUserConfig,
                        //             { id: "label", type: "min" } as IBrokerUserConfig,
                        //             { id: "units", type: "min" } as IBrokerUserConfig,
                        //         ],
                        //     },
                        // },
                    },
                    "properties": {
                        "nodes": [
                            "kpi1",
                            "kpi2",
                            "kpi3",
                        ],
                    },
                },
                "kpi1": {
                    "id": "kpi1",
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": AcmeKpiDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                            "properties": {
                                "componentId": "kpi1",
                                "propertyPath": "widgetData",
                            },
                        } as IProviderConfiguration,
                        [WellKnownProviders.KpiColorPrioritizer]: {
                            "providerId": NOVA_KPI_COLOR_PRIORITIZER,
                            "properties": {
                                "rules": [
                                    {
                                        "comparisonType": ">",
                                        "value": 2,
                                        "color": "var(--nui-color-chart-four)",
                                    },
                                    {
                                        "comparisonType": "==",
                                        "value": 1.5,
                                        "color": "var(--nui-color-chart-seven)",
                                    },
                                    {
                                        "comparisonType": "<",
                                        "value": 1,
                                        "color": "var(--nui-color-chart-one)",
                                    },
                                ] as IKpiColorRules[],
                            },
                        } as IProviderConfiguration,
                    },
                    "properties": {
                        configuration: {
                            formatters: {
                                [KpiFormatterTypes.Value]: {
                                    formatter: {
                                        componentType: SiUnitsFormatterComponent.lateLoadKey,
                                        properties: {
                                            dataFieldIds: {
                                                value: "value",
                                            },
                                        },
                                    },
                                },
                            },
                        } as IKpiConfiguration,

                        "widgetData": {
                            "id":  "totalStorage",
                            "value": 0,
                            "label": "Total storage",
                            "units": "Bytes",
                            // "backgroundColor": "blue",
                            "icon": "state_ok",
                            "link": "http://www.google.com",
                        },
                    },
                },
                "kpi2": {
                    "id": "kpi2",
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": AcmeKpiDataSource2.providerId,
                            "properties": {
                                "numberFormat": "1.1-1",
                            },
                        } as IProviderConfiguration,
                    },
                    "properties": {
                        configuration: {
                            formatters: {
                                // can be used for testing in the future
                                [KpiFormatterTypes.Value]: {
                                    formatter: {
                                        componentType: IconFormatterComponent.lateLoadKey,
                                        properties: {
                                            dataFieldIds: {
                                                value: "icon",
                                            },
                                        },
                                    },
                                },
                            },
                        } as IKpiConfiguration,
                        "widgetData": {
                            "id": "downloadSpeed",
                            "value": 0,
                            "label": "Download SUPER DUPER VERY LONG STRING Speed",
                            "icon": "state_ok",
                            "units": "MB/S",
                        },
                    },
                },
                "kpi3": {
                    "id": "kpi3",
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": AcmeKpiDataSource3.providerId,
                        } as IProviderConfiguration,
                    },
                    "properties": {
                        configuration: {
                            formatters: {
                                [KpiFormatterTypes.Value]: {
                                    formatter: {
                                        componentType: RawFormatterComponent.lateLoadKey,
                                        properties: {
                                            dataFieldIds: {
                                                value: "value",
                                            },
                                        },
                                    },
                                },
                            },
                        } as IKpiConfiguration,
                        "widgetData": {
                            "id": "uploadSpeed",
                            "value": 0,
                            "label": "Upload Speed",
                            "units": "MB/S",
                            // "backgroundColor": "salmon",
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
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        // [WellKnownProviders.EventBusDebugger]: {
                        //     providerId: NOVA_EVENT_BUS_DEBUGGER,
                        // },
                        [WellKnownProviders.InteractionHandler]: {
                            providerId: NOVA_URL_INTERACTION_HANDLER,
                            properties: {
                                url: "${data.link}",
                            },
                        },
                    },
                },
                "header": {
                    "properties": {
                        "title": "Proportional Widget!",
                        "subtitle": "Proportional widget with legend formatters",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": AcmeProportionalDataSource2.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                [WellKnownProviders.DataSource]: {
                                    "properties": {
                                        "isEuropeOnly": false,
                                    },
                                },
                            },
                        } as Partial<IProviderConfiguration>,
                    },
                    "properties": {
                        "configuration": {
                            interactive: true,
                            chartDonutContentLabel: "Some label",
                            chartDonutContentIcon: "printer",
                            "chartOptions": {
                                "type": ProportionalWidgetChartTypes.VerticalBarChart,
                                "legendPlacement": LegendPlacement.Right,
                            } as IProportionalWidgetChartOptions,
                            "chartColors": [
                                "gray",
                                "orange",
                                "black",
                            ],
                            // "chartColors": {
                            //     "Down": "var(--nui-color-chart-three)",
                            //     "Critical": "var(--nui-color-chart-two)",
                            //     "Warning": "var(--nui-color-chart-one)",
                            // },
                            // prioritizeWidgetColors: true,
                        } as IProportionalWidgetConfig,
                    },
                },
            },
        },
    },
    {
        id: "widget3",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": AcmeTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.InteractionHandler]: {
                            providerId: NOVA_URL_INTERACTION_HANDLER,
                        },
                        // [WellKnownProviders.EventBusDebugger]: {
                        //     providerId: NOVA_EVENT_BUS_DEBUGGER,
                        // },
                    },
                },
                "header": {
                    "properties": {
                        "title": "Timeseries Widget!",
                        "subtitle": "Basic timeseries widget",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                "series": [
                                    {
                                        id: "series-2",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-2",
                                    },
                                ] as ITimeseriesItemConfiguration[],
                            },
                        } as Partial<IProviderConfiguration>,
                    },
                    "properties": {
                        "configuration": {
                            "legendPlacement": LegendPlacement.Right,
                            "enableZoom": true,
                            "leftAxisLabel": "Utilization (%)",
                            "chartColors": [
                                "var(--nui-color-chart-eight)",
                                "var(--nui-color-chart-nine)",
                                "var(--nui-color-chart-ten)",
                            ],
                        } as ITimeseriesWidgetConfig,
                    },
                },
                "timeframeSelection": {
                    "properties": {
                        "timeframe": {
                            "selectedPresetId": "last7Days",
                        } as ISerializableTimeframe,
                        "minDate": moment().subtract(10, "days").format(),
                        "maxDate": moment().format(),
                    },
                },
            },
        },
    },
    {
        id: "widget4",
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
                "header": {
                    properties: {
                        title: "Table Widget!",
                        subtitle: "Basic table widget",
                        collapsible: true,
                    },
                },
                "table": {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: AcmeTableDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                    properties: {
                        configuration: {
                            interactive: true,
                            columns: [
                                {
                                    id: "column1",
                                    label: "No",
                                    isActive: true,
                                    formatter: {
                                        componentType: RawFormatterComponent.lateLoadKey,
                                        properties: {
                                            dataFieldIds: {
                                                value: "no",
                                            },
                                        },
                                    },
                                },
                                {
                                    id: "column2",
                                    label: "Title",
                                    isActive: true,
                                    formatter: {
                                        componentType: RawFormatterComponent.lateLoadKey,
                                        properties: {
                                            dataFieldIds: {
                                                value: "nameTitle",
                                            },
                                        },
                                    },
                                },
                                {
                                    id: "column3",
                                    label: "First Name",
                                    isActive: true,
                                    formatter: {
                                        componentType: RawFormatterComponent.lateLoadKey,
                                        properties: {
                                            dataFieldIds: {
                                                value: "nameFirst",
                                            },
                                        },
                                    },
                                },
                                {
                                    id: "column4",
                                    label: "Last Name",
                                    isActive: true,
                                    formatter: {
                                        componentType: RawFormatterComponent.lateLoadKey,
                                        properties: {
                                            dataFieldIds: {
                                                value: "nameLast",
                                            },
                                        },
                                    },
                                },
                                {
                                    id: "column5",
                                    label: "E-Mail",
                                    isActive: true,
                                    formatter: {
                                        componentType: RawFormatterComponent.lateLoadKey,
                                        properties: {
                                            dataFieldIds: {
                                                value: "email",
                                            },
                                        },
                                    },
                                },
                            ],
                            sorterConfiguration: {
                                descendantSorting: true,
                                sortBy: "column4",
                            },
                            hasVirtualScroll: true,
                            searchConfiguration: {
                                enabled: true,
                            },
                        } as ITableWidgetConfig,
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
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        // [WellKnownProviders.EventBusDebugger]: {
                        //     providerId: NOVA_EVENT_BUS_DEBUGGER,
                        // },
                        [WellKnownProviders.InteractionHandler]: {
                            providerId: NOVA_URL_INTERACTION_HANDLER,
                            properties: {
                                url: "${data.link}",
                            },
                        },
                    },
                },
                "header": {
                    "properties": {
                        "title": "Proportional Widget!",
                        "subtitle": "Proportional widget with legend formatters and tick label max width",
                    },
                },
                "chart": {
                    "providers": {
                        [WellKnownProviders.DataSource]: {
                            "providerId": AcmeProportionalDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            "properties": {
                                [WellKnownProviders.DataSource]: {
                                    "properties": {
                                        "isEuropeOnly": false,
                                    },
                                },
                            },
                        } as Partial<IProviderConfiguration>,
                    },
                    "properties": {
                        "configuration": {
                            interactive: true,
                            chartDonutContentLabel: "Some label",
                            chartDonutContentIcon: "printer",
                            "chartOptions": {
                                "type": ProportionalWidgetChartTypes.HorizontalBarChart,
                                "legendPlacement": LegendPlacement.Right,
                                "tickLabelConfig": {
                                    maxWidth: {
                                        left: 50,
                                    },
                                }
                            } as IProportionalWidgetChartOptions,
                            "chartColors": [
                                "grey",
                                "teal",
                                "purple",
                            ],
                        } as IProportionalWidgetConfig,
                    },
                },
            },
        },
    },
];
