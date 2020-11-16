import { select } from "d3-selection";

import { Lasagna } from "./lasagna";
import { D3Selection, ILasagnaLayer } from "./types";

describe("Lasagna >", () => {
    // Using any for testing purposes
    let svg: D3Selection<SVGSVGElement> | any;
    let lasagna: Lasagna;

    beforeEach(() => {
        svg = select(document.createElement("div")).append("svg");
        lasagna = new Lasagna(svg, "");
    });

    describe("instantiation", () => {
        it("should add the correct classes to the target", () => {
            const container = svg.select(`g.${Lasagna.CONTAINER_CLASS}`);
            expect(container.node()).not.toBeNull();
            expect(container.attr("class")).toContain("pointer-events");
        });
    });

    describe("adding a new layer", () => {
        it("should set the layer container pointer-events property to 'none'", () => {
            const testLayerName = "test_layer";
            const newLayer: ILasagnaLayer = {
                name: testLayerName,
                order: 1,
                clipped: true,
            };
            lasagna.addLayer(newLayer);
            expect(lasagna.getLayerContainer(testLayerName).attr("pointer-events")).toEqual("none");
        });
    });

});
