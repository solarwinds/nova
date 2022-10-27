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

import { defaultTextOverflowHandler } from "../default-text-overflow-handler";
import { IAxisConfig, ITickLabelConfig } from "../types";

/** See {@link IAxisConfig} */
export class AxisConfig implements IAxisConfig {
    /** See {@link IAxisConfig#visible} */
    public visible: boolean = true;

    /** See {@link IAxisConfig#gridTicks} */
    public gridTicks: boolean = false;

    /** See {@link IAxisConfig#tickSize} */
    public tickSize: number = 5;

    /** See {@link IAxisConfig#tickLabel} */
    public tickLabel: ITickLabelConfig = {
        horizontalPadding: 0,
        overflowHandler: defaultTextOverflowHandler,
    };

    /** See {@link IAxisConfig#fit} */
    public fit: boolean = false;

    private _approximateTicks: number = 5;

    /** See {@link IAxisConfig#approximateTicks} */
    get approximateTicks(): any {
        return this._approximateTicks;
    }

    /** See {@link IAxisConfig#approximateTicks} */
    set approximateTicks(ticks: any) {
        this._approximateTicks = parseInt(ticks, 10);
    }

    public padding: number = 0;
}
