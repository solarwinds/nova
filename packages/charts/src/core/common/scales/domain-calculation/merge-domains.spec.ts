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

import { LinearScale } from "../linear-scale";
import { EMPTY_CONTINUOUS_DOMAIN } from "../types";
import { mergeDomains } from "./merge-domains";

describe("merge domain >", () => {
    it("should grab the max and min out of a two element array", () => {
        const scale = new LinearScale();

        const domains = [EMPTY_CONTINUOUS_DOMAIN, [100, 2], [1, 101]];
        const mergedDomains = mergeDomains(domains, scale);
        expect(mergedDomains[0]).toEqual(1);
        expect(mergedDomains[1]).toEqual(101);
    });

    it("should skip domains that are equal to EMPTY_CONTINUOUS_DOMAIN", () => {
        const scale = new LinearScale();

        const validDomain = [2, 3];
        const domains = [validDomain, EMPTY_CONTINUOUS_DOMAIN];
        const mergedDomains = mergeDomains(domains, scale);
        expect(mergedDomains).toEqual(validDomain);
    });

    it("should return continuous domain when the domains are undefined", () => {
        const scale = new LinearScale();

        const domains = [EMPTY_CONTINUOUS_DOMAIN, EMPTY_CONTINUOUS_DOMAIN];
        const mergedDomains = mergeDomains(domains, scale);
        expect(mergedDomains).toEqual(EMPTY_CONTINUOUS_DOMAIN);
    });
});
