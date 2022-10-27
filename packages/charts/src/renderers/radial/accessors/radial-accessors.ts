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

import { defaultColorProvider } from "../../../core/common/palette/default-providers";
import {
    DataAccessor,
    IAccessors,
    SeriesAccessor,
} from "../../../core/common/types";

export interface IRadialDataAccessors {
    value: DataAccessor;
    color?: DataAccessor;
    /** Additional custom keys to match the base interface */
    [key: string]: DataAccessor | undefined;
}

export interface IRadialSeriesAccessors {
    color?: SeriesAccessor;
    /** Additional custom keys to match the base interface */
    [key: string]: SeriesAccessor | undefined;
}

export interface IRadialAccessors extends IAccessors {
    data: IRadialDataAccessors;
    series: IRadialSeriesAccessors;
}

export class RadialAccessors implements IRadialAccessors {
    data: IRadialDataAccessors;
    series: IRadialSeriesAccessors;

    constructor(private colorProvider = defaultColorProvider()) {
        this.data = {
            value: (d: any) => (Number.isFinite(d) ? d : d.value),
        };
        this.series = {
            color: this.colorProvider ? this.colorProvider.get : undefined,
        };
    }
}
