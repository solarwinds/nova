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

import {
    GaugeMode,
    StandardLinearGaugeThickness,
} from "../../../gauge/constants";
import { DimensionConfig } from "./dimension-config";
import { XYGridConfig } from "./xy-grid-config";

/**
 * Assembles a linear-gauge-specific grid configuration
 *
 * @param mode vertical or horizontal
 * @param thickness The thickness of the gauge
 *
 * @returns {XYGridConfig} A linear gauge grid configuration
 */
export function linearGaugeGridConfig(
    mode: GaugeMode.Vertical | GaugeMode.Horizontal,
    thickness = StandardLinearGaugeThickness.Large
): XYGridConfig {
    const gridConfig = new XYGridConfig();
    gridConfig.interactionPlugins = false;
    gridConfig.disableRenderAreaHeightCorrection = true;

    gridConfig.axis.bottom.visible = false;
    gridConfig.axis.bottom.gridTicks = false;

    gridConfig.axis.left.visible = false;
    gridConfig.axis.left.gridTicks = false;

    gridConfig.borders.left.visible = false;
    gridConfig.borders.bottom.visible = false;

    // reset the dimension config with zero margins and zero padding
    gridConfig.dimension = new DimensionConfig();

    // set the gauge's thickness
    if (mode === GaugeMode.Vertical) {
        gridConfig.dimension.autoWidth = false;
        gridConfig.dimension.width(thickness);
    } else {
        gridConfig.dimension.autoHeight = false;
        gridConfig.dimension.height(thickness);
    }

    return gridConfig;
}
