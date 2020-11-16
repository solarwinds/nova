import { BandScale } from "./band-scale";

describe("Band Scale >", () => {
    describe("invert method", () => {
        it("works for domains with several values and 0 padding", () => {
            const bandScale = new BandScale();
            // by default padding is 0
            bandScale.domain(["up", "down", "warning"]);
            bandScale.range([0, 100]);
            expect(bandScale.invert(0)).toBe("up");
            expect(bandScale.invert(32)).toBe("up");
            expect(bandScale.invert(35)).toBe("down");
            expect(bandScale.invert(65)).toBe("down");
            expect(bandScale.invert(76)).toBe("warning");
        });
        it("works for domains with both negative and positive values and 0 padding", () => {
            const bandScale = new BandScale();
            // by default padding is 0
            bandScale.domain(["up", "down", "warning", "unknown"]);
            bandScale.range([-300, 100]);
            expect(bandScale.invert(-301)).toBe("up");
            expect(bandScale.invert(-201)).toBe("up");
            expect(bandScale.invert(-120)).toBe("down");
            expect(bandScale.invert(-99)).toBe("warning");
            expect(bandScale.invert(-2)).toBe("warning");
            expect(bandScale.invert(5)).toBe("unknown");
            expect(bandScale.invert(99)).toBe("unknown");
            expect(bandScale.invert(199)).toBe("unknown");
        });
        it("works for domains with both negative and positive values and 50% padding", () => {
            const bandScale = new BandScale();
            bandScale.padding(0.5);
            bandScale.domain(["up", "down", "warning", "unknown"]);
            // padding 0.5 sets outer padding to 0.25 which is 25px in this case
            bandScale.range([-300, 100]);
            expect(bandScale.invert(-301)).toBe("up");
            expect(bandScale.invert(-201)).toBe("up");
            expect(bandScale.invert(-120)).toBe("down");
            expect(bandScale.invert(-99)).toBe("warning");
            expect(bandScale.invert(-2)).toBe("warning");
            expect(bandScale.invert(5)).toBe("unknown");
            expect(bandScale.invert(99)).toBe("unknown");
            expect(bandScale.invert(199)).toBe("unknown");
        });
    });
    describe("convert method", () => {
        it("returns center of a band", () => {
            const bandScale = new BandScale();
            bandScale.padding(0.5);
            bandScale.domain(["up", "down", "warning", "unknown"]);
            bandScale.range([-300, 100]);

            expect(bandScale.convert("up")).toBe(-250);
            expect(bandScale.convert("unknown")).toBe(50);
        });
    });

    describe("step method", () => {
        it("should return the expected value", () => {
            const bandScale = new BandScale();
            bandScale.domain(["up", "down"]);
            bandScale.range([0, 100]);

            expect(bandScale.step()).toEqual(50);
        });

        it("should return 0 if the domain length is 0", () => {
            const bandScale = new BandScale();
            bandScale.domain([]);
            bandScale.range([0, 100]);

            expect(bandScale.step()).toEqual(0);
        });
    });
});
