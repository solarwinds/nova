import { LinearScale } from "../linear-scale";
import { EMPTY_CONTINUOUS_DOMAIN } from "../types";

import { mergeDomains } from "./merge-domains";

describe("merge domain >", () => {

    it("have a top and bottom domain", () => {
        const scale = new LinearScale();

        const domains = [[100, 2], [1, 101]];
        const mergedDomains = mergeDomains(domains, scale);
        expect(mergedDomains[0]).toEqual(1);
        expect(mergedDomains[1]).toEqual(101);
    });

    it("should skip domains that are equal to EMPTY_CONTINUOUS_DOMAIN", () => {
        const scale = new LinearScale();

        const emptyArr = [EMPTY_CONTINUOUS_DOMAIN, EMPTY_CONTINUOUS_DOMAIN];
        const mergedDomains = mergeDomains(emptyArr, scale);
        expect(mergedDomains[0]).toBeUndefined();
        expect(mergedDomains[1]).toBeUndefined();
    });

});
