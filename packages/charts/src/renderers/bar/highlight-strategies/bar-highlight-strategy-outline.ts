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
import isUndefined from "lodash/isUndefined";

import { DATA_POINT_NOT_FOUND } from "../../../constants";
import { IXYScales } from "../../../core/common/scales/types";

import { IRectangleAccessors } from "../../accessors/rectangle-accessors";
import { IRenderSeries, RenderLayerName } from "../../types";
import { BarRenderer } from "../bar-renderer";
import {
    BarHighlightStrategy,
    SelectedDatPointIdxFn,
} from "./bar-highlight-strategy";

// creates an outline element that is used to highlight hovered parts of the chart
export class BarHighlightStrategyOutline extends BarHighlightStrategy {
    private outlineAdd = 6;

    /**
     * @param scaleKey scale that will be used for searching for the data point that will be highlighted
     * @param levels for band scales, how many levels deep do we go to compare values
     */
    constructor(
        scaleKey: keyof IXYScales,
        levels = 1,
        selectedDataPointIdxFn?: SelectedDatPointIdxFn
    ) {
        super(scaleKey, levels, selectedDataPointIdxFn);
    }

    public highlightDataPoint(
        renderer: BarRenderer,
        renderSeries: IRenderSeries<IRectangleAccessors>,
        dataPointIndex: number
    ): void {
        const target = renderSeries.containers[RenderLayerName.data];
        const selectedDataPointIdx = !isUndefined(this.selectedDataPointIdxFn)
            ? this.selectedDataPointIdxFn(renderSeries.dataSeries.id)
            : DATA_POINT_NOT_FOUND;

        const gNodes = target
            .selectAll(`g.${renderer.barContainerClass}`)
            .nodes();
        const emphasizedNode =
            gNodes[dataPointIndex] || gNodes[selectedDataPointIdx];

        if (!renderSeries.parentContainer) {
            return;
        }

        // needs to replace all '.' from  the serie id as the dot would be treated as a class name in the query selector
        const outlineRectClass =
            `${renderer.barContainerClass}-outline-${renderSeries.dataSeries.id}`
                .split(".")
                .join("-");
        let outlineRect = renderSeries.parentContainer.select(
            `rect.${outlineRectClass}`
        );

        if (outlineRect.empty()) {
            // creates a rect element that will be used as a outline
            const rect = renderSeries.parentContainer.append("rect");
            rect.classed(outlineRectClass, true);
        }

        if (emphasizedNode) {
            // position the outline element on the position of the emphasized element and updates its attributes
            const emphasizedRect = select(emphasizedNode).select("rect");

            const x =
                parseFloat(emphasizedRect.attr("x")) - this.outlineAdd / 2;
            const y =
                parseFloat(emphasizedRect.attr("y")) - this.outlineAdd / 2;
            const width =
                parseFloat(emphasizedRect.attr("width")) + this.outlineAdd;
            const height =
                parseFloat(emphasizedRect.attr("height")) + this.outlineAdd;

            outlineRect.attr("x", x);
            outlineRect.attr("y", y);
            outlineRect.attr("width", width);
            outlineRect.attr("height", height);
            outlineRect.style("fill", emphasizedRect.style("fill"));
            outlineRect.style("display", "inline");
        }

        if (!emphasizedNode && !outlineRect.empty()) {
            // hides outline element when there is no emphasized element
            outlineRect.style("display", "none");
        }
    }
}
