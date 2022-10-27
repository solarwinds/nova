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
} from "../../../core/common/palette/default-providers";
import {
    DataAccessor,
    IAccessors,
    IDataSeries,
} from "../../../core/common/types";
import {
    IRectangleDataAccessors,
    IRectangleSeriesAccessors,
    RectangleAccessors,
} from "../../accessors/rectangle-accessors";

export interface IBarDataAccessors extends IRectangleDataAccessors {
    category: DataAccessor;
    start: DataAccessor;
    end: DataAccessor;
    thickness?: DataAccessor;
    value?: DataAccessor;
    color?: DataAccessor;
    marker?: DataAccessor;
    cssClass?: DataAccessor<any, string>;
}

export interface IBarAccessors extends IAccessors {
    data: IBarDataAccessors;
    series: IRectangleSeriesAccessors;
}

export abstract class BarAccessors
    extends RectangleAccessors
    implements IBarAccessors
{
    data: IBarDataAccessors;
    series: IRectangleSeriesAccessors;

    constructor(
        private colorProvider = defaultColorProvider(),
        private markerProvider = defaultMarkerProvider()
    ) {
        super();

        this.data = {
            value: (data: any) => data.value,
            category: (
                d,
                i,
                series: any[],
                dataSeries: IDataSeries<IAccessors>
            ) => {
                if (d.category) {
                    return d.category;
                }

                if (this.series.category) {
                    return this.series.category(dataSeries.id, dataSeries);
                }

                return null;
            },
            start: (
                data: any,
                index: number,
                series: any[],
                dataSeries: IDataSeries<IAccessors>
            ) => {
                if (data.__bar) {
                    return data.__bar.start;
                }
                if (typeof data.start !== "undefined") {
                    return data.start;
                }

                const value = this.getSingleValue(
                    data,
                    index,
                    series,
                    dataSeries
                );
                if (Number.isFinite(value)) {
                    return Math.min(0, value);
                }

                return null;
            },
            end: (
                data: any,
                index: number,
                series: any[],
                dataSeries: IDataSeries<IAccessors>
            ) => {
                if (data.__bar) {
                    return data.__bar.end;
                }
                if (typeof data.end !== "undefined") {
                    return data.end;
                }

                const value = this.getSingleValue(
                    data,
                    index,
                    series,
                    dataSeries
                );
                if (Number.isFinite(value)) {
                    return Math.max(0, value);
                }

                return null;
            },
        };

        this.series = {
            color: this.colorProvider ? this.colorProvider.get : undefined,
            marker: this.markerProvider ? this.markerProvider.get : undefined,
            category: (seriesId, series) => series.name || series.id,
        };
    }

    private getSingleValue(
        data: any,
        index: number,
        series: any[],
        dataSeries: IDataSeries<IAccessors>
    ) {
        let value: any;
        if (this.data.value) {
            // try to use the value accessor to retrieve value
            value = this.data.value(data, index, series, dataSeries);
            // if it fails to retrieve a valid value, then we consider the data point to be a primitive value that is returned directly
            if (typeof value === "undefined") {
                value = data;
            }
        }
        return value;
    }
}
