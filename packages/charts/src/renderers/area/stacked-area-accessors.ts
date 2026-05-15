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

import { AreaAccessors, IAreaAccessors } from "./area-accessors";
import { IChartMarker, IValueProvider } from "../../core/common/types";

export function stackedAreaAccessors(
    colorProvider?: IValueProvider<string>,
    markerProvider?: IValueProvider<IChartMarker>
): IAreaAccessors {
    const areaAccessors = new AreaAccessors(colorProvider, markerProvider);

    areaAccessors.data.x = (d) => d.x;
    areaAccessors.data.y = areaAccessors.data.absoluteY1;
    areaAccessors.data.y0 = () => 0;
    areaAccessors.data.y1 = (d) => d.y;

    return areaAccessors;
}
