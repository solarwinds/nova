import { max, min, Numeric } from "d3-array";
import flatten from "lodash/flatten";
import uniq from "lodash/uniq";

import { IScale } from "../types";

/**
 * Merge given domains
 *
 * @param domains collected from dataSeries on the chart
 * @param scale that owns the domains
 */
export function mergeDomains(domains: any[][], scale: IScale<any>): any[] {
    if (scale.isContinuous()) {
        const domainMin = min<Numeric>(domains.filter(e => typeof e[0] !== undefined).map(e => e[0]));
        const domainMax = max<Numeric>(domains.filter(e => typeof e[1] !== undefined).map(e => e[1]));

        return [domainMin, domainMax];
    }

    const maxLength = Math.max(...domains.map(d => d.length));
    return Array.from(Array(maxLength)).map((e, i) => {
        const scalesDomains = domains.map(d => i < d.length ? d[i] : []);
        return uniq(flatten(scalesDomains));
    });
}
