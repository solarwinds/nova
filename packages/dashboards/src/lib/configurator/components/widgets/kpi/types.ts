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
 * @deprecated - Please use IKpiData instead
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
