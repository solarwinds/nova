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

import { IBarChartConfig } from "./types";
import { BandScale } from "../../core/common/scales/band-scale";
import { LinearScale } from "../../core/common/scales/linear-scale";
import { IXYScales } from "../../core/common/scales/types";

/**
 * Generates scales definition to be used with category+value based bar charts
 *
 * @param config
 * @param valueScale
 */
export function barScales(
    config?: IBarChartConfig,
    valueScale = new LinearScale()
): IXYScales {
    const bandScale = new BandScale();
    if (config && config.grouped) {
        bandScale.padding(0.25);
        bandScale.innerScale = new BandScale();
    }
    let scales: IXYScales;
    if (!config || !config.horizontal) {
        scales = {
            x: bandScale,
            y: valueScale,
        };
    } else {
        bandScale.reverse();
        scales = {
            x: valueScale,
            y: bandScale,
        };
    }
    return scales;
}
