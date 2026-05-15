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

import { ChartPopoverPlugin } from "./chart-popover-plugin";
import { IElementPosition } from "./types";

/**
 * Extends ChartPopoverPlugin to handle popover positioning for radial charts.
 */
export class RadialPopoverPlugin extends ChartPopoverPlugin {
    protected getAbsolutePosition(valArr: any[]): IElementPosition {
        const chartElement: any = this.chart.target?.node()?.parentNode; // the one above svg

        if (!chartElement) {
            throw new Error("Chart parent node is not defined");
        }

        const dataPointsLeft = Math.min(...valArr.map((d) => d.position.x));
        const dataPointsTop = Math.min(...valArr.map((d) => d.position.y));
        const left =
            chartElement.offsetLeft +
            this.chart.getGrid().config().dimension.margin.left +
            dataPointsLeft +
            this.chart.getGrid().config().dimension.width() / 2;
        const top =
            chartElement.offsetTop +
            dataPointsTop +
            this.chart.getGrid().config().dimension.height() / 2;
        return {
            top: top,
            left: left,
            height: 0,
            width: 0,
        };
    }
}
