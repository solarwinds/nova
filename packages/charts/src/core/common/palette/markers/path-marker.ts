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

import { IChartMarker } from "../../types";

/**
 * This class creates a ChartMarker based on provided data for svg path
 */
export class PathMarker implements IChartMarker {
    /** Resulting <path> HTMLElement */
    public element: HTMLElement;
    protected svg: string;

    /**
     * Creates an instance of PathMarker.
     * @param {string} d value that has to be assigned to 'd' attribute of 'path' element in svg
     * @memberof PathMarker
     */
    constructor(d: string) {
        this.element = document.createElement("path");

        this.setAttributes({
            class: "nui-chart-element-marker nui-chart--path__outline",
            "vector-effect": "non-scaling-stroke",
            d: d,
        });
    }

    public setColor(color: string): void {
        this.setAttributes({ fill: color });
    }

    private setAttributes(attrs: { [key: string]: string }) {
        for (const attr of Object.keys(attrs)) {
            this.element.setAttribute(attr, attrs[attr]);
        }

        this.updateSvg();
    }

    public getSvg(): string {
        return this.svg;
    }

    protected updateSvg() {
        this.svg = this.element.outerHTML;
    }
}
