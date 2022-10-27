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

import { IChartMarker, IChartPalette, IValueProvider } from "../types";
import { ChartPalette } from "./chart-palette";
import { CHART_MARKERS, CHART_PALETTE_CS1 } from "./palettes";
import { SequentialChartMarkerProvider } from "./sequential-chart-marker-provider";
import { SequentialColorProvider } from "./sequential-color-provider";

export function defaultColorProvider(): IValueProvider<string> {
    return new SequentialColorProvider(CHART_PALETTE_CS1);
}

export function defaultPalette(): IChartPalette {
    return new ChartPalette(defaultColorProvider());
}

export function defaultMarkerProvider(): IValueProvider<IChartMarker> {
    return new SequentialChartMarkerProvider(CHART_MARKERS);
}
