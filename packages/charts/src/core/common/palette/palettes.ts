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

import { SvgMarker } from "./markers/svg-marker";

/** Default single-shade color sequence for charts */
export const CHART_PALETTE_CS1: string[] = [
    "var(--nui-color-chart-one)",
    "var(--nui-color-chart-two)",
    "var(--nui-color-chart-three)",
    "var(--nui-color-chart-four)",
    "var(--nui-color-chart-five)",
    "var(--nui-color-chart-six)",
    "var(--nui-color-chart-seven)",
    "var(--nui-color-chart-eight)",
    "var(--nui-color-chart-nine)",
    "var(--nui-color-chart-ten)",
];

/** Default two-shade color sequence for charts */
export const CHART_PALETTE_CS2: string[] = [
    "var(--nui-color-chart-one)",
    "var(--nui-color-chart-one-light)",
    "var(--nui-color-chart-two)",
    "var(--nui-color-chart-two-light)",
    "var(--nui-color-chart-three)",
    "var(--nui-color-chart-three-light)",
    "var(--nui-color-chart-four)",
    "var(--nui-color-chart-four-light)",
    "var(--nui-color-chart-five)",
    "var(--nui-color-chart-five-light)",
    "var(--nui-color-chart-six)",
    "var(--nui-color-chart-six-light)",
    "var(--nui-color-chart-seven)",
    "var(--nui-color-chart-seven-light)",
    "var(--nui-color-chart-eight)",
    "var(--nui-color-chart-eight-light)",
    "var(--nui-color-chart-nine)",
    "var(--nui-color-chart-nine-light)",
    "var(--nui-color-chart-ten)",
    "var(--nui-color-chart-ten-light)",
];

/** Default three-shade color sequence for charts */
export const CHART_PALETTE_CS3: string[] = [
    "var(--nui-color-chart-one)",
    "var(--nui-color-chart-one-light)",
    "var(--nui-color-chart-one-dark)",
    "var(--nui-color-chart-two)",
    "var(--nui-color-chart-two-light)",
    "var(--nui-color-chart-two-dark)",
    "var(--nui-color-chart-three)",
    "var(--nui-color-chart-three-light)",
    "var(--nui-color-chart-three-dark)",
    "var(--nui-color-chart-four)",
    "var(--nui-color-chart-four-light)",
    "var(--nui-color-chart-four-dark)",
    "var(--nui-color-chart-five)",
    "var(--nui-color-chart-five-light)",
    "var(--nui-color-chart-five-dark)",
    "var(--nui-color-chart-six)",
    "var(--nui-color-chart-six-light)",
    "var(--nui-color-chart-six-dark)",
    "var(--nui-color-chart-seven)",
    "var(--nui-color-chart-seven-light)",
    "var(--nui-color-chart-seven-dark)",
    "var(--nui-color-chart-eight)",
    "var(--nui-color-chart-eight-light)",
    "var(--nui-color-chart-eight-dark)",
    "var(--nui-color-chart-nine)",
    "var(--nui-color-chart-nine-light)",
    "var(--nui-color-chart-nine-dark)",
    "var(--nui-color-chart-ten)",
    "var(--nui-color-chart-ten-light)",
    "var(--nui-color-chart-ten-dark)",
];

/** @deprecated
 * Will be removed in v.12
 * https://jira.solarwinds.com/browse/NUI-4296?jql=text%20~%20%22v11%22
 *
 * Default status color sequence for charts */
export const CHART_PALETTE_CS_S: string[] = [
    "var(--nui-color-semantic-down)",
    "var(--nui-color-semantic-critical)",
    "var(--nui-color-semantic-warning)",
    "var(--nui-color-semantic-unknown)",
    "var(--nui-color-semantic-ok)",
    "var(--nui-color-semantic-info)",
];

/** Extended status color sequence for charts
 * It will substitute the default one above in v.12
 * https://jira.solarwinds.com/browse/NUI-5367
 */
export const CHART_PALETTE_CS_S_EXTENDED: string[] = [
    "var(--nui-color-semantic-down)",
    "var(--nui-color-semantic-down-bg)",
    "var(--nui-color-semantic-critical)",
    "var(--nui-color-semantic-critical-bg)",
    "var(--nui-color-semantic-warning)",
    "var(--nui-color-semantic-warning-bg)",
    "var(--nui-color-semantic-unknown)",
    "var(--nui-color-semantic-unknown-bg)",
    "var(--nui-color-semantic-ok)",
    "var(--nui-color-semantic-ok-bg)",
    "var(--nui-color-semantic-info)",
    "var(--nui-color-semantic-info-bg)",
];

/* eslint-disable max-len */
/** Standard shapes for chart markers */
const regularShapes: string[] = [
    "m0 0m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0z", // circle
    "m-4,-4l8,0l0,8l-8,0l0,-8z", // square
    "m0-4 4 8-8 0z", // triangle up
    "m0-4.95 4.95 4.95-4.95 4.95-4.95-4.95 4.95-4.95z", // diamond
    "m0 4-4-8 8 0z", // triangle down
    "m0-3.805 4.001 2.907-1.528 4.703-4.945 0-1.528-4.703z", // pentagon
];

/** Standard open shapes for chart markers */
const emptyShapes: string[] = [
    "m0 2c1.105 0 2-.895 2-2 0-1.105-.895-2-2-2-1.105 0-2 .895-2 2 0 1.105.895 2 2 2zm0 2c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4 2.209 0 4 1.791 4 4 0 2.209-1.791 4-4 4z", // circle empty
    "m-2-2 0 4 4 0 0-4-4 0zm-2-2 8 0 0 8-8 0 0-8z", // square empty
    "m0-4-4 8 8.001 0-4.001-8zm0 3.354 1.573 3.146-3.145 0 1.572-3.146z", // triangle up empty
    "m0-2.121-2.121 2.121 2.121 2.121 2.121-2.121-2.121-2.121zm0-2.828 4.95 4.95-4.95 4.95-4.95-4.95 4.95-4.95z", // diamond empty
    "m0 4-4-8 8.001 0-4.001 8zm0-3.354 1.573-3.146-3.145 0 1.572 3.146z", // triangle down empty
    "m0-1.951-2.237 1.626.855 2.63 2.766 0 .855-2.63-2.237-1.626zm0-1.854 4.001 2.907-1.528 4.703-4.945 0-1.528-4.703 4.001-2.907z", // pentagon empty
];
/* eslint-enable max-len */

/** Default chart marker set */
export const CHART_MARKERS: SvgMarker[] = [
    ...regularShapes.map(
        (s) => `<path class="nui-chart--path__outline" d="${s}"></path>`
    ),
    ...emptyShapes.map(
        (s, i) =>
            `<path class="nui-chart--path__outline-fill" stroke="none" d="${regularShapes[i]}"></path>
            <path class="nui-chart--path__outline" d="${s}"></path>`
    ),
].map((s) => new SvgMarker(s));
