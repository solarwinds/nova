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

export const TILES_MOCK = [
    {
        id: "kpi1",
        providers: {
            dataSource: {
                providerId: "AcmeKpiDataSource",
            },
            kpiColorPrioritizer: {
                providerId: "NOVA_KPI_COLOR_PRIORITIZER",
                properties: {
                    rules: [
                        {
                            comparisonType: ">",
                            value: 2,
                            color: "var(--nui-color-chart-four)",
                        },
                        {
                            comparisonType: "==",
                            value: 1.5,
                            color: "var(--nui-color-chart-seven)",
                        },
                        {
                            comparisonType: "<",
                            value: 1,
                            color: "var(--nui-color-chart-one)",
                        },
                    ],
                },
            },
        },
        properties: {
            elementClass: "flex-grow-1",
            widgetData: {
                id: "totalStorage",
                value: 0,
                label: "Total storage",
                units: "TB",
                backgroundColor: "blue",
            },
        },
    },
    {
        id: "kpi2",
        providers: {
            dataSource: {
                providerId: "AcmeKpiDataSource2",
                properties: {
                    numberFormat: "1.1-1",
                },
            },
        },
        properties: {
            elementClass: "flex-grow-1",
            widgetData: {
                id: "downloadSpeed",
                value: 0,
                label: "Download SUPER DUPER VERY LONG STRING Speed",
                units: "MB/S",
            },
        },
    },
];

export const TILES_PROVIDERS_MOCK = [
    {
        componentType: "KpiComponent",
        providers: {
            kpiColorPrioritizer: {
                providerId: "NOVA_KPI_COLOR_PRIORITIZER",
                properties: {
                    rules: [
                        {
                            comparisonType: "==",
                            value: 0,
                            color: "red",
                        },
                    ],
                },
            },
            adapter: {
                providerId: "NOVA_KPI_DATASOURCE_ADAPTER",
                properties: {
                    propertyPath: "widgetData",
                },
            },
        },
    },
    {
        componentType: "KpiComponent",
        providers: {
            kpiColorPrioritizer: {
                providerId: "NOVA_KPI_COLOR_PRIORITIZER",
                properties: {
                    rules: [
                        {
                            comparisonType: "==",
                            value: 0,
                            color: "red",
                        },
                    ],
                },
            },
            adapter: {
                providerId: "NOVA_KPI_DATASOURCE_ADAPTER",
                properties: {
                    propertyPath: "widgetData",
                },
            },
        },
    },
];

export const MERGED = [
    {
        componentType: "KpiComponent",
        providers: {
            kpiColorPrioritizer: {
                providerId: "NOVA_KPI_COLOR_PRIORITIZER",
                properties: {
                    rules: [
                        {
                            comparisonType: ">",
                            value: 2,
                            color: "var(--nui-color-chart-four)",
                        },
                        {
                            comparisonType: "==",
                            value: 1.5,
                            color: "var(--nui-color-chart-seven)",
                        },
                        {
                            comparisonType: "<",
                            value: 1,
                            color: "var(--nui-color-chart-one)",
                        },
                    ],
                },
            },
            adapter: {
                providerId: "NOVA_KPI_DATASOURCE_ADAPTER",
                properties: {
                    propertyPath: "widgetData",
                },
            },
            dataSource: {
                providerId: "AcmeKpiDataSource",
            },
        },
        id: "kpi1",
        properties: {
            elementClass: "flex-grow-1",
            widgetData: {
                id: "totalStorage",
                value: 0,
                label: "Total storage",
                units: "TB",
                backgroundColor: "blue",
            },
        },
    },
    {
        componentType: "KpiComponent",
        providers: {
            kpiColorPrioritizer: {
                providerId: "NOVA_KPI_COLOR_PRIORITIZER",
                properties: {
                    rules: [
                        {
                            comparisonType: "==",
                            value: 0,
                            color: "red",
                        },
                    ],
                },
            },
            adapter: {
                providerId: "NOVA_KPI_DATASOURCE_ADAPTER",
                properties: {
                    propertyPath: "widgetData",
                },
            },
            dataSource: {
                providerId: "AcmeKpiDataSource2",
                properties: {
                    numberFormat: "1.1-1",
                },
            },
        },
        id: "kpi2",
        properties: {
            elementClass: "flex-grow-1",
            widgetData: {
                id: "downloadSpeed",
                value: 0,
                label: "Download SUPER DUPER VERY LONG STRING Speed",
                units: "MB/S",
            },
        },
    },
];
