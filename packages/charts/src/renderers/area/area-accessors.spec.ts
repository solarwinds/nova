import { AreaAccessors } from "./area-accessors";

const RANDOM_NUMBER = 4;

describe("Area Accessors >", () => {
    it("falls back to x if x0 / x1 is not defined", () => {
        const accessors = new AreaAccessors();
        accessors.data.x = () => RANDOM_NUMBER;
        // @ts-ignore: Disabled for testing purposes
        expect(accessors.data.x0(null, null, null, null)).toBe(RANDOM_NUMBER);
        // @ts-ignore: Disabled for testing purposes
        expect(accessors.data.x1(null, null, null, null)).toBe(RANDOM_NUMBER);
    });

    it("falls back to y if y0 / y1 is not defined", () => {
        const accessors = new AreaAccessors();
        accessors.data.y = () => RANDOM_NUMBER;

        // @ts-ignore: Disabled for testing purposes
        expect(accessors.data.y0(null, null, null, null)).toBe(RANDOM_NUMBER);
        // @ts-ignore: Disabled for testing purposes
        expect(accessors.data.y1(null, null, null, null)).toBe(RANDOM_NUMBER);
    });
});
