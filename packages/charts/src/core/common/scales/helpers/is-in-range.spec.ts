import { LinearScale } from "../linear-scale";
import { isInRange } from "./is-in-range";

describe("isInRange", () => {
    it("works one way", () => {
        const scale = new LinearScale();
        scale.range([0, 100]);

        expect(isInRange(scale, 50)).toBe(true);
    });

    it("works the other way too", () => {
        const scale = new LinearScale();
        scale.range([100, 0]);

        expect(isInRange(scale, 50)).toBe(true);
    });
});
