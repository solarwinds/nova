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

import { GridsterItem } from "angular-gridster2";

import { IWidget } from "@nova-ui/dashboards";

import { kpiConfig } from "../widget-configs/kpi";
import { proportionalConfig } from "../widget-configs/proportional";
import { tableConfig } from "../widget-configs/table";
import { timeseriesConfig } from "../widget-configs/timeseries";

export const positions: Record<string, GridsterItem> = {
    [tableConfig.id]: {
        cols: 7,
        rows: 7,
        y: 0,
        x: 0,
    },
    [proportionalConfig.id]: {
        cols: 5,
        rows: 7,
        y: 0,
        x: 7,
    },
    [kpiConfig.id]: {
        cols: 6,
        rows: 7,
        y: 7,
        x: 0,
    },
    [timeseriesConfig.id]: {
        cols: 6,
        rows: 7,
        y: 7,
        x: 6,
    },
};

export const widgets: IWidget[] = [
    {
        ...tableConfig,
    },
    {
        ...proportionalConfig,
    },
    {
        ...kpiConfig,
    },
    {
        ...timeseriesConfig,
    },
];
