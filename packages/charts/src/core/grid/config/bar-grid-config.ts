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

import { XYGridConfig } from "./xy-grid-config";

/**
 * Pre-defined and conforming Nova UX standards configuration of XYGrid for bar chart
 */
export class BarGridConfig extends XYGridConfig {
    constructor() {
        super();

        this.interactionPlugins = false;

        this.axis.left.gridTicks = true;
        this.axis.left.tickSize = 5;
        this.axis.bottom.gridTicks = false;
        this.axis.left.fit = true;
        this.axis.bottom.tickSize = 5;
        this.axis.left.tickSize = 0;
        this.dimension.margin.right = 0;
        this.dimension.padding.bottom = 2; // 2 for border
    }
}
