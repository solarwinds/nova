import { max, min, Numeric } from "d3-array";
import flatten from "lodash/flatten";
import uniq from "lodash/uniq";

import { EMPTY_CONTINUOUS_DOMAIN, IScale } from "../types";

/**
 * Merge given domains
 *
 * @param domains collected from dataSeries on the chart
 * @param scale that owns the domains
 */
export function mergeDomains(domains: any[][], scale: IScale<any>): any[] {
    if (scale.isContinuous()) {
        const nonEmptyDomains = domains.filter(
            (d) => d !== EMPTY_CONTINUOUS_DOMAIN
        );

        if (nonEmptyDomains.length === 0) {
            return EMPTY_CONTINUOUS_DOMAIN;
        }

        const domainMin = min<Numeric>(
            nonEmptyDomains
                .filter((e) => typeof e[0] !== undefined)
                .map((e) => e[0])
        );
        const domainMax = max<Numeric>(
            nonEmptyDomains
                .filter((e) => typeof e[1] !== undefined)
                .map((e) => e[1])
        );

        return [domainMin, domainMax];
    }

    const maxLength = Math.max(...domains.map((d) => d.length));
    return Array.from(Array(maxLength)).map((e, i) => {
        const scalesDomains = domains.map((d) => (i < d.length ? d[i] : []));
        return uniq(flatten(scalesDomains));
    });
}
