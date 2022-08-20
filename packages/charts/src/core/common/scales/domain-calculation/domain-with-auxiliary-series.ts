import { IChartSeries } from "../../types";
import { DomainCalculator, IScale } from "../types";

/**
 * Domain calculator that adds given series to the domain calculation
 *
 * @param additionalSeriesFn this function returns series to be added
 * @param domainCalculator
 */
export const domainWithAuxiliarySeries =
    (
        additionalSeriesFn: () => IChartSeries<any>[],
        domainCalculator: DomainCalculator
    ) =>
    (
        chartSeriesSet: IChartSeries<any>[],
        scaleId: string,
        scale: IScale<any>
    ) =>
        domainCalculator(
            additionalSeriesFn().concat(chartSeriesSet),
            scaleId,
            scale
        );
