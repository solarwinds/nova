import cloneDeep from "lodash/cloneDeep";

import { IAxisConfig } from "../../../grid/types";
import { IAccessors, IChartSeries } from "../../types";
import { domain } from "../helpers/domain";
import { DomainCalculator, IDomainWithTicksCalculator, IScale } from "../types";

export const getAutomaticDomainWithTicks = (
    config: IAxisConfig,
    axisGenerator: any,
    domainCalculator: DomainCalculator
): IDomainWithTicksCalculator => {
    const result: IDomainWithTicksCalculator = (
        chartSeriesSet: IChartSeries<IAccessors>[],
        scaleKey: string,
        scale: IScale<any>
    ): any[] => {
        const mergedDomains = domainCalculator(chartSeriesSet, scaleKey, scale);
        const clonedScale = cloneDeep(scale);
        domain(clonedScale, mergedDomains);
        const tickAxis: any = axisGenerator(clonedScale.d3Scale);
        const ticks = tickAxis.scale().ticks(config.approximateTicks);
        if (ticks.length <= 1) {
            return mergedDomains;
        }
        const ticksAverage = ticks[1] - ticks[0];
        if (ticks[0] > mergedDomains[0]) {
            mergedDomains[0] = ticks[0] - ticksAverage;
        }
        if (ticks[ticks.length - 1] < mergedDomains[1]) {
            mergedDomains[1] = ticks[ticks.length - 1] + ticksAverage;
        }
        return mergedDomains;
    };
    result.domainWithTicks = true;
    return result;
};
