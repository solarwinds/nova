import { LinearScale } from "../linear-scale";
import { EMPTY_CONTINUOUS_DOMAIN } from "../types";

import { mergeDomains } from "./merge-domains";

fdescribe("merge domain >", () => {
    it("should skip domains that are equal to EMPTY_CONTINUOUS_DOMAIN", () => {
        const scale = new LinearScale();

        const emptyArr = [EMPTY_CONTINUOUS_DOMAIN, EMPTY_CONTINUOUS_DOMAIN];
        const mergedDomains = mergeDomains(emptyArr, scale);
        expect(mergedDomains[0]).toBeUndefined();
        expect(mergedDomains[1]).toBeUndefined();
    });

});
