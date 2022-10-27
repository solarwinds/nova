// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
            expect(
                lasagna.getLayerContainer(testLayerName).attr("pointer-events")
            ).toEqual("none");
        });
    });
});
