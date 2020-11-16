import { PointScale } from "./point-scale";

describe("Point Scale >", () => {
    describe("invert method", () => {
        it("works for domains with several values and 0 padding", () => {
            const pointScale = new PointScale();
            // by default padding is 0
            pointScale.domain(["up", "down", "warning"]);
            pointScale.range([0, 100]);
            expect(pointScale.invert(0)).toBe("up");
            expect(pointScale.invert(20)).toBe("up");
            expect(pointScale.invert(30)).toBe("down");
            expect(pointScale.invert(74)).toBe("down");
            expect(pointScale.invert(76)).toBe("warning");
        });
        it("works for domains with both negative and positive values and 0 padding", () => {
            const pointScale = new PointScale();
            pointScale.domain(["up", "down", "warning", "unknown"]);
            pointScale.range([-200, 100]);
            expect(pointScale.invert(-200)).toBe("up");
            expect(pointScale.invert(-120)).toBe("down");
            expect(pointScale.invert(0)).toBe("warning");
            expect(pointScale.invert(25)).toBe("warning");
            expect(pointScale.invert(99)).toBe("unknown");
            expect(pointScale.invert(199)).toBe("unknown");
        });
        it("works for domains with both negative and positive values and 50% padding", () => {
            const pointScale = new PointScale();
            // by default padding is 0
            pointScale.padding(0.5);
            pointScale.domain(["up", "down", "warning", "unknown"]);
            pointScale.range([-250, 150]);
            expect(pointScale.invert(-200)).toBe("up");
            expect(pointScale.invert(-120)).toBe("down");
            expect(pointScale.invert(0)).toBe("warning");
            expect(pointScale.invert(25)).toBe("warning");
            expect(pointScale.invert(99)).toBe("unknown");
            expect(pointScale.invert(199)).toBe("unknown");
        });
    });
});
