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
