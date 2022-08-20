import { SvgMarker } from "./svg-marker";

describe("SvgMarker >", () => {
    let marker: SvgMarker;

    beforeEach(() => {
        marker = new SvgMarker("xxx");
    });

    it("setColor", () => {
        marker.setColor("red");

        expect(marker.getSvg()).toBe(`<g fill="red">xxx</g>`);
    });
});
