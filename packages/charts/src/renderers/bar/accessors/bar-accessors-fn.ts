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

import { IChartMarker, IValueProvider } from "../../../core/common/types";
import { IBarChartConfig } from "../types";
import { IBarAccessors } from "./bar-accessors";
import { HorizontalBarAccessors } from "./horizontal-bar-accessors";
import { VerticalBarAccessors } from "./vertical-bar-accessors";

/**
 * Creates {@link VerticalBarAccessors} or {@link VerticalBarAccessors}
 * using {@link IBarChartConfig#horizontal} horizontal property. Default orientation is **vertical**.
 *
 * @param {IBarChartConfig} [config]
 * @param {IValueProvider<string>} [colorProvider]
 * @param {IValueProvider<IChartMarker>} [markerProvider]
 * @returns {IBarAccessors}
 */
export function barAccessors(
    config?: IBarChartConfig,
    colorProvider?: IValueProvider<string>,
    markerProvider?: IValueProvider<IChartMarker>
): IBarAccessors {
    return config && config.horizontal
        ? new HorizontalBarAccessors(colorProvider, markerProvider)
        : new VerticalBarAccessors(colorProvider, markerProvider);
}
