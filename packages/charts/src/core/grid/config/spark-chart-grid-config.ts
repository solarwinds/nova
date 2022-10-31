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

import { BorderConfig } from "./border-config";
import { XYGridConfig } from "./xy-grid-config";

/**
 * Applies spark chart specific grid configuration
 *
 * @param c
 * @param showBottomAxis
 * @param showTopBorder
 */
export function sparkChartGridConfig(
    c: XYGridConfig = new XYGridConfig(),
    showBottomAxis: boolean = false,
    showTopBorder: boolean = true
): XYGridConfig {
    c.interactionPlugins = false;

    c.axis.left.visible = false;
    c.axis.left.gridTicks = false;
    c.dimension.margin.left = 5;
    c.dimension.margin.right = 5;
    c.dimension.margin.bottom = showBottomAxis ? c.dimension.margin.bottom : 0;
    c.dimension.padding.top = 5;
    c.dimension.padding.bottom = 5;
    c.dimension.autoHeight = false;

    // TODO: avoid magic number
    // Hard-coded value stands for the height of rich legend tile when there are 2 rows of description.
    // We need to figure out how to make a better layout that will not require magic numbers.
    c.dimension.height(36);

    if (showTopBorder) {
        c.borders.top = new BorderConfig();
    }
    if (!showBottomAxis) {
        c.borders.bottom.visible = false;
    }

    return c;
}
