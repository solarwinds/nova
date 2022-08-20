import {
    DEFAULT_PIZZAGNA_ROOT,
    IProportionalWidgetChartOptions,
    IProviderConfiguration,
    ISerializableTimeframe,
    ITableWidgetColumnConfig,
    ITableWidgetSorterConfig,
    ITimeseriesItemConfiguration,
    ITimeseriesWidgetConfig,
    IWidget,
    KpiComponent,
    LegendPlacement,
    LinkFormatterComponent,
    NOVA_KPI_DATASOURCE_ADAPTER,
    PizzagnaLayer,
    ProportionalWidgetChartTypes,
    RawFormatterComponent,
    WellKnownProviders,
} from "@nova-ui/dashboards";
import { GridsterItem } from "angular-gridster2";

import {
    TestKpiDataSource,
    TestKpiDataSource2,
} from "../../data/kpi-data-sources";
import { TestProportionalDataSource2 } from "../../data/proportional-data-sources";
import { TestTableDataSource } from "../../data/table-datasources";
import { TestTimeseriesDataSource } from "../../data/timeseries-data-sources";
import { frozenTime } from "../../data/widget-data";

export const positions: Record<string, GridsterItem> = {
    widget1: {
        cols: 6,
        rows: 6,
        y: 0,
        x: 0,
    },
    widget2: {
        cols: 6,
        rows: 6,
        y: 0,
        x: 6,
    },
    widget3: {
        cols: 7,
        rows: 6,
        y: 6,
        x: 0,
    },
    widget4: {
        cols: 5,
        rows: 6,
        y: 6,
        x: 7,
    },
};

export const widgets: IWidget[] = [
    {
        id: "widget1",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                header: {
                    properties: {
                        title: "KPI Widget!",
                        subtitle: "A bunch of number boxes",
                    },
                },
                tiles: {
                    properties: {
                        nodes: ["kpi1", "kpi2"],
                    },
                },
                kpi1: {
                    id: "kpi1",
                    componentType: KpiComponent.lateLoadKey,
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestKpiDataSource.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            providerId: NOVA_KPI_DATASOURCE_ADAPTER,
                            properties: {
                                componentId: "kpi1",
                                propertyPath: "widgetData",
                                thresholds: {
                                    showThresholds: true,
                                    warningThresholdValue: 5,
                                    criticalThresholdValue: 8,
                                },
                            },
                        } as IProviderConfiguration,
                    },
                    properties: {
                        elementClass: "flex-grow-1",
                        widgetData: {
                            id: "totalStorage",
                            value: 0,
                            label: "Total storage",
                        },
                    },
                },
                kpi2: {
                    id: "kpi2",
                    componentType: KpiComponent.lateLoadKey,
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestKpiDataSource2.providerId,
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            providerId: NOVA_KPI_DATASOURCE_ADAPTER,
                            properties: {
                                componentId: "kpi2",
                                propertyPath: "widgetData",
                                thresholds: {
                                    warningThresholdValue: 120,
                                    criticalThresholdValue: 150,
                                },
                            },
                        } as IProviderConfiguration,
                    },
                    properties: {
                        elementClass: "flex-grow-1",
                        widgetData: {
                            id: "downloadSpeed",
                            value: 0,
                            label: "Download speed",
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
                            providerId: TestProportionalDataSource2.providerId,
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
        id: "widget3",
        type: "timeseries",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                [DEFAULT_PIZZAGNA_ROOT]: {
                    providers: {
                        [WellKnownProviders.DataSource]: {
                            providerId: TestTimeseriesDataSource.providerId,
                        } as IProviderConfiguration,
                    },
                },
                header: {
                    properties: {
                        title: "Timeseries Widget!",
                        subtitle: "Basic timeseries widget",
                    },
                },
                chart: {
                    providers: {
                        [WellKnownProviders.Adapter]: {
                            properties: {
                                series: [
                                    {
                                        id: "series-1",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-1",
                                    },
                                    {
                                        id: "series-2",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-2",
                                    },
                                    {
                                        id: "series-3",
                                        label: "Average CPU Load",
                                        selectedSeriesId: "series-3",
                                    },
                                ] as ITimeseriesItemConfiguration[],
                            },
                        } as Partial<IProviderConfiguration>,
                    },
                    properties: {
                        configuration: {
                            legendPlacement: LegendPlacement.Right,
                            enableZoom: true,
                            leftAxisLabel: "Utilization (%)",
                        } as ITimeseriesWidgetConfig,
                    },
                },
                timeframeSelection: {
                    properties: {
                        timeframe: {
                            startDatetime: frozenTime()
                                .subtract(7, "day")
                                .format(),
                            endDatetime: frozenTime().format(),
                            selectedPresetId: null,
                        } as unknown as ISerializableTimeframe,
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
];
