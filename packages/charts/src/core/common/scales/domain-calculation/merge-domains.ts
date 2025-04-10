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

import { max, min, Numeric } from "d3";
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
                .filter((e) => typeof e[0] !== "undefined")
                .map((e) => e[0])
        );
        const domainMax = max<Numeric>(
            nonEmptyDomains
                .filter((e) => typeof e[1] !== "undefined")
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
