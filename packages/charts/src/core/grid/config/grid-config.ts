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

import {
    IAllAround,
    IBorderConfig,
    IDimensionConfig,
    IGridConfig,
} from "../types";
import { DimensionConfig } from "./dimension-config";

/** See {@link IGridConfig} */
export class GridConfig implements IGridConfig {
    // We should avoid this kind of option in future versions of GridConfig
    // because ideally all plugins should be added manually (NUI-3304).
    /** See {@link IGridConfig#interactive} */
    public interactive: boolean = true;

    /** See {@link IGridConfig#dimension} */
    public dimension: IDimensionConfig = new DimensionConfig();
    /** See {@link IGridConfig#borders} */
    public borders: IAllAround<IBorderConfig> = {
        // TODO: Review this
        // @ts-ignore
        top: undefined,
        // @ts-ignore
        bottom: undefined,
        // @ts-ignore
        left: undefined,
        // @ts-ignore
        right: undefined,
    };
    /** See {@link IGridConfig#cursor} */
    public cursor = "crosshair";
    /** See {@link IGridConfig#disableRenderAreaHeightCorrection} */
    public disableRenderAreaHeightCorrection = false;
    /** See {@link IGridConfig#disableRenderAreaWidthCorrection} */
    public disableRenderAreaWidthCorrection = false;
}
