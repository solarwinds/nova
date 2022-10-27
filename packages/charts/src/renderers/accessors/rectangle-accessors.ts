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
    DataAccessor,
    IAccessors,
    IDataAccessors,
    ISeriesAccessors,
    SeriesAccessor,
} from "../../core/common/types";

export interface IStartEndRangeAccessors extends IDataAccessors {
    start: DataAccessor;
    end: DataAccessor;
}

export interface IValueThicknessAccessors extends IDataAccessors {
    value: DataAccessor;
    thickness: DataAccessor;
}

export interface IRectangleDataAccessors extends IDataAccessors {
    startX?: DataAccessor;
    endX?: DataAccessor;
    thicknessX?: DataAccessor;

    startY?: DataAccessor;
    endY?: DataAccessor;
    thicknessY?: DataAccessor;
}

export interface IRectangleSeriesAccessors extends ISeriesAccessors {
    color?: SeriesAccessor;
    marker?: SeriesAccessor;
}

export interface IRectangleAccessors extends IAccessors {
    data: IRectangleDataAccessors;
    series: IRectangleSeriesAccessors;
}

export class RectangleAccessors implements IRectangleAccessors {
    data: IRectangleDataAccessors;
    series: IRectangleSeriesAccessors;

    constructor() {}
}
