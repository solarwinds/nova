import { TimeScale } from "./time-scale";

describe("Time Scale >", () => {
    describe("invert", () => {
        it("should return a Date if the domain is valid", () => {
            const timeScale = new TimeScale();
            expect(timeScale.invert(3)?.getTime).toBeDefined();
        });

        it("should return undefined if the domain is invalid", () => {
            const timeScale = new TimeScale();
            // @ts-ignore: Disabled for testing purposes
            timeScale.domain([undefined, undefined]);
            expect(timeScale.invert(3)).toBeUndefined();
        });
    });

    describe("isDomainValid", () => {
        it("should return true if the domain is valid", () => {
            const timeScale = new TimeScale();
            expect(timeScale.isDomainValid()).toEqual(true);
        });

        it("should return false if the domain is invalid", () => {
            const timeScale = new TimeScale();
            // @ts-ignore: Disabled for testing purposes
            timeScale.domain([undefined, undefined]);
            expect(timeScale.isDomainValid()).toEqual(false);
        });
    });
});
