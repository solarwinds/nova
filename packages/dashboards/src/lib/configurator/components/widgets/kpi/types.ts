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

import { IKpiData } from "../../../../components/kpi-widget/types";
import { IProviderConfiguration } from "../../../../types";
import { IItemConfiguration } from "../../types";

export interface IKpiItemConfiguration extends IItemConfiguration {
    widgetData: IKpiData;
    thresholds: IKpiThresholdsConfig;
    dataSource: IProviderConfiguration;
}

export interface IKpiThresholdsConfig {
    showThresholds: boolean;
    reversedThresholds: boolean;
    warningThresholdValue?: number;
    criticalThresholdValue: number;
    backgroundColor?: string;
}

/**
 * @deprecated - Please use IKpiData instead - NUI-5853
 */
export interface IKpiWidgetIndicatorData extends IKpiData {
    description?: string;
}

/** @ignore */
export enum KpiWidgetThresholdColors {
    Warning = "var(--nui-color-semantic-warning)",
    Critical = "var(--nui-color-semantic-critical)",
}

export enum KpiWidgetFontSizes {
    Small = "24px",
    Medium = "48px",
    Large = "72px",
    ExtraLarge = "120px",
}
