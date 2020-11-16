import { LinearScale } from "./linear-scale";

describe("Linear Scale >", () => {
    describe("isDomainValid", () => {
        it("should return true if the domain is valid", () => {
            const timeScale = new LinearScale();
            expect(timeScale.isDomainValid()).toEqual(true);
        });

        it("should return false if the domain is invalid", () => {
            const timeScale = new LinearScale();
            timeScale.domain([NaN, NaN]);
            expect(timeScale.isDomainValid()).toEqual(false);
        });
    });
});
