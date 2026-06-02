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

/** A single data item in the proportional chart. */
export interface IProportionalDataItem {
    /** Unique identifier for the segment. */
    id: string;
    /** Display name shown in legend. */
    name: string;
    /** Numeric value determining segment size. */
    value: number;
    /** Optional CSS color (hex or token). If not provided, palette is used. */
    color?: string;
    /** Optional icon name displayed in legend. */
    icon?: string;
    /** Optional link for drill-down interaction. */
    link?: string;
}

/** Chart type variants the view supports. */
export type ProportionalChartType = "donut" | "pie" | "verticalBar" | "horizontalBar";

/** Legend placement relative to the chart. */
export type ViewLegendPlacement = "right" | "bottom" | "none";
