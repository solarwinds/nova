import { BandScale } from "../band-scale";
import { LinearScale } from "../linear-scale";
import { invert } from "./invert";

describe("invert", () => {
    it("should return undefined if the inverted value is undefined", () => {
        const scale = new BandScale();
        // @ts-ignore: Disabled for testing purposes
        spyOn(scale, "invert").and.returnValue(undefined);
        const inverted = invert(scale, 0);
        expect(inverted).toBeUndefined();
    });

    it("should return 0 if the scale is null", () => {
        // @ts-ignore: Disabled for testing purposes
        const inverted = invert(null, 0);
        expect(inverted).toEqual(0);
    });

    it("should return the correct value if the scale is not a band scale", () => {
        const scale = new LinearScale();
        spyOn(scale, "invert").and.returnValue(42);
        const inverted = invert(scale, 0);
        expect(inverted).toEqual(42);
    });

    it("should return the correct value if a band scale doesn't have an inner scale", () => {
        const scale = new BandScale();
        // @ts-ignore: Disabled for testing purposes
        scale.innerScale = undefined;
        spyOn(scale, "invert").and.returnValue("42");
        const inverted = invert(scale, 0);
        expect(inverted).toEqual("42");
    });
    // TODO: Fix this one
    xit("should return the correct value if a band scale has an inner scale", () => {
        const scale = new BandScale();
        scale.innerScale = new BandScale();
        spyOn(scale, "invert").and.returnValue("42");
        spyOn(scale.innerScale, "invert").and.returnValue("43");
        const inverted = invert(scale, 0);
        expect(inverted).toEqual(["42", "43"]);
    });

    it("should return the correct value if a band scale's inverted value is an array", () => {
        const scale = new BandScale();
        scale.innerScale = new BandScale();
        spyOn(scale, "invert").and.returnValue("42");
        spyOn(scale.innerScale, "invert").and.returnValue(["43", "44"]);
        const inverted = invert(scale, 0);
        expect(inverted).toEqual(["42", "43", "44"]);
    });
});
