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

import zipObject from "lodash/zipObject";

import {
    CHART_PALETTE_CS3,
    CHART_PALETTE_CS_S_EXTENDED,
} from "@nova-ui/charts";

export const CHART_PALETTE_CS3_ALTERNATIVE_NAMES = [
    $localize`Blue`,
    $localize`Blue Light`,
    $localize`Blue Dark`,
    $localize`Pink`,
    $localize`Pink Light`,
    $localize`Pink Dark`,
    $localize`Sea Green`,
    $localize`Sea Green Light`,
    $localize`Sea Green Dark`,
    $localize`Violet`,
    $localize`Violet Light`,
    $localize`Violet Dark`,
    $localize`Lime Green`,
    $localize`Lime Green Light`,
    $localize`Lime Green Dark`,
    $localize`Orange`,
    $localize`Orange Light`,
    $localize`Orange Dark`,
    $localize`Ultramarine`,
    $localize`Ultramarine Light`,
    $localize`Ultramarine Dark`,
    $localize`Bordeaux`,
    $localize`Bordeaux Light`,
    $localize`Bordeaux Dark`,
    $localize`Ochroid`,
    $localize`Ochroid Light`,
    $localize`Ochroid Dark`,
    $localize`Anthracite`,
    $localize`Anthracite Light`,
    $localize`Anthracite Dark`,
];

export const CHART_PALETTE_CS_S_EXTENDED_ALTERNATIVE_NAMES = [
    $localize`Down`,
    $localize`Down Light`,
    $localize`Critical`,
    $localize`Critical Light`,
    $localize`Warning`,
    $localize`Warning Light`,
    $localize`Unknown`,
    $localize`Unknown Light`,
    $localize`Ok`,
    $localize`Ok Light`,
    $localize`Info`,
    $localize`Info Light`,
];

export const chartPaletteColorMap: Record<string, string> = zipObject(
    [...CHART_PALETTE_CS3, ...CHART_PALETTE_CS_S_EXTENDED],
    [
        ...CHART_PALETTE_CS3_ALTERNATIVE_NAMES,
        ...CHART_PALETTE_CS_S_EXTENDED_ALTERNATIVE_NAMES,
    ]
);

export const DEFAULT_KPI_TILE_COLOR = "var(--nui-color-bg-secondary)";
export const DEFAULT_KPI_BACKGROUND_COLORS = [
    ...CHART_PALETTE_CS3,
    ...CHART_PALETTE_CS_S_EXTENDED,
].map((color) => ({
    color,
    label: chartPaletteColorMap[color],
}));
