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
    IBrokerUserConfig,
    IKpiColorRules,
    IKpiConfiguration,
    IProviderConfiguration,
    KpiFormatterTypes,
    NOVA_KPI_COLOR_PRIORITIZER,
    NOVA_KPI_DATASOURCE_ADAPTER,
    NOVA_KPI_SCALE_SYNC_BROKER,
    SiUnitsFormatterComponent,
    WellKnownProviders,
} from "@nova-ui/dashboards";

import { TestKpiDataSource } from "../../data/kpi-data-sources";

interface IKpiNodeConfig {
    id: string;
    ds?: any;
    formatter?: boolean;
    colorPrioritizer?: boolean;
    color?: string;
    title?: string;
    units?: string;
}

export function getKpiNode(cfg: IKpiNodeConfig) {
    return {
        id: cfg.id,
        providers: {
            [WellKnownProviders.DataSource]: {
                providerId: cfg.ds?.providerId || TestKpiDataSource.providerId,
            } as IProviderConfiguration,
            [WellKnownProviders.Adapter]: {
                providerId: NOVA_KPI_DATASOURCE_ADAPTER,
                properties: {
                    componentId: cfg.id,
                    propertyPath: "widgetData",
                },
            } as IProviderConfiguration,
            [WellKnownProviders.KpiColorPrioritizer]: {
                providerId: NOVA_KPI_COLOR_PRIORITIZER,
                properties: cfg.colorPrioritizer ? getColorPrioritizer() : {},
            } as IProviderConfiguration,
        },
        properties: {
            configuration: {
                formatters: cfg.formatter ? getFormatter() : {},
            } as IKpiConfiguration,

            widgetData: {
                id: "totalStorage",
                value: 0,
                label: cfg.title
                    ? "Test Label"
                    : "Lack_of_white_spaces_often_break_the_markup",
                units: "Bytes",
                backgroundColor: cfg.color || "skyblue",
                icon: "state_ok",
                link: "http://www.google.com",
            },
        },
    };
}

export function getFormatter() {
    return {
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
    };
}

export function getColorPrioritizer() {
    return {
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
        ] as IKpiColorRules[],
    };
}

export function getScaleBroker() {
    return {
        kpiScaleSyncBroker: {
            providerId: NOVA_KPI_SCALE_SYNC_BROKER,
            properties: {
                scaleSyncConfig: [
                    { id: "value", type: "min" } as IBrokerUserConfig,
                    { id: "label", type: "min" } as IBrokerUserConfig,
                    { id: "units", type: "min" } as IBrokerUserConfig,
                ],
            },
        },
    };
}
