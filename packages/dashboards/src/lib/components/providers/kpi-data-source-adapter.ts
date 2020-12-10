import { DecimalPipe } from "@angular/common";
import { Inject, Optional } from "@angular/core";
import { EventBus, IDataSource, IEvent } from "@nova-ui/bits";
import _isNil from "lodash/isNil";

import { IKpiThresholdsConfig, KpiWidgetThresholdColors } from "../../configurator/components/widgets/kpi/types";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../types";
import { IKpiData } from "../kpi-widget/types";

import { DataSourceAdapter } from "./data-source-adapter";

export interface IKpiDataSourceAdapterConfiguration {
    thresholds: IKpiThresholdsConfig;
}

export class KpiDataSourceAdapter extends DataSourceAdapter<IKpiData> {
    private thresholds: IKpiThresholdsConfig;

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        @Optional() @Inject(DATA_SOURCE) dataSource: IDataSource,
        pizzagnaService: PizzagnaService,
        private numberPipe: DecimalPipe) {
        super(eventBus, dataSource, pizzagnaService);
    }

    public updateConfiguration(properties: IKpiDataSourceAdapterConfiguration) {
        this.thresholds = properties.thresholds;

        super.updateConfiguration(properties);
    }

    protected processOutput(data: IKpiData): IKpiData {
        const processedValue = this.processThresholds(data);
        // processNumberFormat changes data.value to a string which is why this function needs to be run after processThresholds.
        return this.processNumberFormat(processedValue);
    }

    protected setComponent(component: any, componentId: string) {
        if (componentId) {
            this.componentId = componentId;
        }
    }

    private getThresholdColor(thresholdsConfig: IKpiThresholdsConfig, indicatorData: IKpiData, defaultColor: string | undefined) {
        const thresholdChecks = this.getThresholdChecks(thresholdsConfig, indicatorData, thresholdsConfig.reversedThresholds);
        if (thresholdChecks.warningCheck) {
            return KpiWidgetThresholdColors.Warning;
        }
        if (thresholdChecks.criticalCheck) {
            return KpiWidgetThresholdColors.Critical;
        }
        return defaultColor;
    }

    private getThresholdChecks(indicatorConfig: IKpiThresholdsConfig, indicatorData: IKpiData, isReversed: boolean) {
        const warningThreshold = indicatorConfig.warningThresholdValue;
        const criticalThreshold = indicatorConfig.criticalThresholdValue;
        const reversedWarningCheck = !_isNil(warningThreshold) && (indicatorData.value <= warningThreshold) && (indicatorData.value > criticalThreshold);
        const reversedCriticalCheck = indicatorData.value <= criticalThreshold;
        const normalWarningCheck = !_isNil(warningThreshold) && (indicatorData.value >= warningThreshold) && (indicatorData.value < criticalThreshold);
        const normalCriticalCheck = indicatorData.value >= criticalThreshold;
        return {
            warningCheck: isReversed ? reversedWarningCheck : normalWarningCheck,
            criticalCheck: isReversed ? reversedCriticalCheck : normalCriticalCheck,
        };
    }

    private processThresholds(data: IKpiData) {
        if (!data || !this.thresholds?.showThresholds || typeof data.value !== "number") {
            return data;
        }
        const thresholdColor = this.getThresholdColor(this.thresholds, data, data.backgroundColor);
        return {
            ...data,
            backgroundColor: thresholdColor,
        };
    }

    private processNumberFormat(data: IKpiData) {
        if (typeof data?.value !== "number" || !data?.numberFormat) {
            return data;
        }
        const numValue = this.numberPipe.transform(data.value, data.numberFormat);
        return {
            ...data,
            value: numValue,
        };
    }
}
