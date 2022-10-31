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

export class BarStatusGridConfig extends XYGridConfig {
    constructor(
        config: { showBottomAxis: boolean } = { showBottomAxis: true }
    ) {
        super();

        this.interactive = true;
        this.interactionPlugins = false;
        if (!config.showBottomAxis) {
            this.axis.bottom.visible = false;
            this.borders.bottom.visible = false;
        }
        this.axis.left.visible = false;
        this.axis.left.gridTicks = false;
        this.borders.left.visible = false;

        this.dimension.autoHeight = false;
        this.dimension.margin.top = 0;
        if (!config.showBottomAxis) {
            this.dimension.margin.bottom = 0;
        }
        this.dimension.height(30); // TODO: solve magic number together with spark chart
    }
}
