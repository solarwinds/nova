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
    defaultColorProvider,
    defaultMarkerProvider,
} from "../../core/common/palette/default-providers";
import {
    DataAccessor,
    IAccessors,
    SeriesAccessor,
} from "../../core/common/types";
import { IXYDataAccessors, XYAccessors } from "../accessors/xy-accessors";

export interface ILineDataAccessors extends IXYDataAccessors {
    defined?: DataAccessor<any, boolean>;
}

/**
 * Series accessors used in {@link LineAccessors}.
 */
export interface ILineSeriesAccessors {
    /** Color of the series */
    color?: SeriesAccessor;
    /** Marker for the series */
    marker?: SeriesAccessor;
    /** Additional custom keys to match the base interface */
    [key: string]: SeriesAccessor | undefined;
}

export interface ILineAccessors extends IAccessors {
    data: ILineDataAccessors;
    /** Series level accessors - e.g. for colors, markers, etc. */
    series: ILineSeriesAccessors;
}

/**
 * Accessor class supporting the {@link LineRenderer}, that defines required inputs acquired from data points.
 * This class includes default behavior for all required fields. It's using properties of the same name for data accessors.
 * <p>
 * If colorProvider or markerProvider is not defined in the constructor, every new instance of LineAccessors will instantiate it's own, so that has to be
 * kept in mind when configuring charts as it could cause potential color synchronization problems.
 *
 * <p>See referenced <code>data</code> and <code>series</code> interfaces for required properties.</p>
 */
export class LineAccessors extends XYAccessors implements ILineAccessors {
    public declare data: ILineDataAccessors;
    public series: ILineSeriesAccessors;

    constructor(
        public colorProvider = defaultColorProvider(),
        public markerProvider = defaultMarkerProvider()
    ) {
        super();

        this.data.defined = (d: any, i) =>
            d.hasOwnProperty("defined") ? d.defined : true;

        this.series = {
            color: this.colorProvider ? this.colorProvider.get : undefined,
            marker: this.markerProvider ? this.markerProvider.get : undefined,
        };
    }
}
