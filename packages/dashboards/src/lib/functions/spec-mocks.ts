export const TILES_MOCK = [
    {
        "id": "kpi1",
        "providers": {
            "dataSource": {
                "providerId": "AcmeKpiDataSource",
            },
            "kpiColorPrioritizer": {
                "providerId": "NOVA_KPI_COLOR_PRIORITIZER",
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
                    ],
                },
            },
        },
        "properties": {
            "elementClass": "flex-grow-1",
            "widgetData": {
                "id": "totalStorage",
                "value": 0,
                "label": "Total storage",
                "units": "TB",
                "backgroundColor": "blue",
            },
        },
    },
    {
        "id": "kpi2",
        "providers": {
            "dataSource": {
                "providerId": "AcmeKpiDataSource2",
                "properties": {
                    "numberFormat": "1.1-1",
                },
            },
        },
        "properties": {
            "elementClass": "flex-grow-1",
            "widgetData": {
                "id": "downloadSpeed",
                "value": 0,
                "label": "Download SUPER DUPER VERY LONG STRING Speed",
                "units": "MB/S",
            },
        },
    },
];

export const TILES_PROVIDERS_MOCK = [
    {
        componentType: "KpiComponent",
        "providers": {
            kpiColorPrioritizer: {
                "providerId": "NOVA_KPI_COLOR_PRIORITIZER",
                "properties": {
                    "rules": [
                        {
                            "comparisonType": "==",
                            "value": 0,
                            "color": "red",
                        },
                    ],
                },
            },
            adapter: {
                "providerId": "NOVA_KPI_DATASOURCE_ADAPTER",
                "properties": {
                    "propertyPath": "widgetData",
                },
            },
        },
    },
    {
        componentType: "KpiComponent",
        "providers": {
            kpiColorPrioritizer: {
                "providerId": "NOVA_KPI_COLOR_PRIORITIZER",
                "properties": {
                    "rules": [
                        {
                            "comparisonType": "==",
                            "value": 0,
                            "color": "red",
                        },
                    ],
                },
            },
            adapter: {
                "providerId": "NOVA_KPI_DATASOURCE_ADAPTER",
                "properties": {
                    "propertyPath": "widgetData",
                },
            },
        },
    },
];

export const MERGED = [
    {
        "componentType": "KpiComponent",
        "providers": {
            "kpiColorPrioritizer": {
                "providerId": "NOVA_KPI_COLOR_PRIORITIZER",
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
                    ],
                },
            },
            "adapter": {
                "providerId": "NOVA_KPI_DATASOURCE_ADAPTER",
                "properties": {
                    "propertyPath": "widgetData",
                },
            },
            "dataSource": {
                "providerId": "AcmeKpiDataSource",
            },
        },
        "id": "kpi1",
        "properties": {
            "elementClass": "flex-grow-1",
            "widgetData": {
                "id": "totalStorage",
                "value": 0,
                "label": "Total storage",
                "units": "TB",
                "backgroundColor": "blue",
            },
        },
    },
    {
        "componentType": "KpiComponent",
        "providers": {
            "kpiColorPrioritizer": {
                "providerId": "NOVA_KPI_COLOR_PRIORITIZER",
                "properties": {
                    "rules": [
                        {
                            "comparisonType": "==",
                            "value": 0,
                            "color": "red",
                        },
                    ],
                },
            },
            "adapter": {
                "providerId": "NOVA_KPI_DATASOURCE_ADAPTER",
                "properties": {
                    "propertyPath": "widgetData",
                },
            },
            "dataSource": {
                "providerId": "AcmeKpiDataSource2",
                "properties": {
                    "numberFormat": "1.1-1",
                },
            },
        },
        "id": "kpi2",
        "properties": {
            "elementClass": "flex-grow-1",
            "widgetData": {
                "id": "downloadSpeed",
                "value": 0,
                "label": "Download SUPER DUPER VERY LONG STRING Speed",
                "units": "MB/S",
            },
        },
    },
];
