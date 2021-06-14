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

        const emptyArr = [EMPTY_CONTINUOUS_DOMAIN];
        const mergedDomains = mergeDomains(emptyArr, scale);
        expect(mergedDomains[0]).toBeDefined();
    });

    it("should return continuous domain when the domains are undefined", () => {
        const scale = new LinearScale();

        const emptyArr: any[] = [];
        const mergedDomains = mergeDomains(emptyArr, scale);
        expect(mergedDomains).toBe(EMPTY_CONTINUOUS_DOMAIN);
    });

});
