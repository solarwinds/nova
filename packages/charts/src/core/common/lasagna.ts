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

import orderBy from "lodash/orderBy";

import { D3Selection, ILasagnaLayer } from "./types";

/** @ignore */
export class Lasagna {
    public static CONTAINER_CLASS = "lasagna-container";
    public static LAYER_CLASS = "lasagna-layer";

    public layers: ILasagnaLayer[] = [];
    private readonly container: D3Selection<SVGGElement>;

    constructor(
        target: D3Selection<SVGSVGElement>,
        private readonly clipPath: string
    ) {
        this.container = target
            .append("g")
            .attr("class", `${Lasagna.CONTAINER_CLASS} pointer-events`);
    }

    public addLayer(layer: ILasagnaLayer): D3Selection {
        this.layers = orderBy(this.layers.concat(layer), "order");

        this.update();

        return this.getLayerContainer(layer.name);
    }

    public removeLayer(layerName: string): void {
        const index = this.layers.findIndex(
            (layer) => layer.name === layerName
        );
        if (index === -1) {
            return;
        }

        this.layers.splice(index, 1);
        this.update();
    }

    public getLayerContainer(name: string): D3Selection {
        return this.container.select(`.${Lasagna.LAYER_CLASS}-${name}`);
    }

    public getContainer(): D3Selection<SVGGElement> {
        return this.container;
    }

    private update() {
        const layerContainers = this.container
            .selectAll<SVGElement, ILasagnaLayer>(`g.${Lasagna.LAYER_CLASS}`)
            .data(this.layers, (d: ILasagnaLayer) => d.name)
            .order();

        layerContainers
            .enter()
            .append("g")
            .attrs({
                class: (d: ILasagnaLayer) =>
                    `${Lasagna.LAYER_CLASS} ${Lasagna.LAYER_CLASS}-${d.name}`,
                "clip-path": (d: ILasagnaLayer) =>
                    d.clipped ? `url(#${this.clipPath})` : "",
                "pointer-events": "none",
            });

        layerContainers.exit().remove();
    }
}
