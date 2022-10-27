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

import { IAllAround, IAxisConfig, IXYGridConfig } from "../types";
import { AxisConfig } from "./axis-config";
import { BorderConfig } from "./border-config";
import { GridConfig } from "./grid-config";

export class XYGridConfig extends GridConfig implements IXYGridConfig {
    /** The default margin */
    public static readonly DEFAULT_MARGIN: IAllAround<number> = {
        top: 0,
        right: 5,
        bottom: 20,
        left: 30,
    };

    public static readonly DEFAULT_PADDING: IAllAround<number> = {
        left: 0,
        right: 0,
        top: 5,
        bottom: 5,
    };

    public axis: IAllAround<IAxisConfig> = {
        top: new AxisConfig(),
        right: new AxisConfig(),
        bottom: new AxisConfig(),
        left: new AxisConfig(),
    };

    // We should avoid this kind of option in future versions of XYGrid and XYGridConfig
    // because ideally all plugins should be added manually (NUI-3304).
    public interactionPlugins = true;

    constructor() {
        super();

        this.dimension.padding = Object.assign(
            {},
            XYGridConfig.DEFAULT_PADDING
        );
        this.dimension.margin = Object.assign({}, XYGridConfig.DEFAULT_MARGIN);

        this.borders.bottom = new BorderConfig(
            "nui-chart-border nui-chart-border--thick"
        );
        this.borders.left = new BorderConfig(
            "nui-chart-border nui-chart-border--thick"
        );
        this.borders.left.visible = false; // TODO: figure out if this is the valid default

        this.axis.left.gridTicks = true;
        this.axis.left.tickSize = 0;
        this.axis.left.padding = 10;

        this.axis.right.fit = true;
        this.axis.right.tickSize = 0;
        this.axis.right.padding = 10;

        this.axis.bottom.tickLabel.horizontalPadding = 5;
    }
}
