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

import { Duration } from "moment/moment";

import { TimeIntervalScale } from "../../core/common/scales/time-interval-scale";
import { IAccessors, IDataSeries } from "../../core/common/types";

/**
 * This function adds data points indicating that there is an interruption in the data.
 *
 * @param dataSeries
 * @param accessorKey
 * @param interval
 */
export function calculateMissingData(
    dataSeries: IDataSeries<IAccessors>,
    accessorKey: string,
    interval: Duration
): any[] {
    const dataAccessors = dataSeries.accessors.data;
    const data = dataSeries.data;
    const accessor = dataAccessors?.[accessorKey];
    if (!accessor) {
        throw new Error("Accessor " + accessorKey + " not defined!");
    }
    const minValue = accessor(data[0], 0, data, dataSeries);
    const maxValue = accessor(
        data[data.length - 1],
        data.length - 1,
        data,
        dataSeries
    );
    if (!minValue || !maxValue) {
        throw new Error("First or last values not defined!");
    }

    const scale = new TimeIntervalScale(interval);
    scale.domain([
        // @ts-ignore
        scale.truncToInterval(minValue, scale.interval()),
        // @ts-ignore
        scale.truncToInterval(maxValue, scale.interval()),
    ]);
    const bands = scale.getBands();

    const newData: any[] = [];
    let b = 0; // band iterator index
    for (let i = 0; i < data.length; i++) {
        const value = accessor(data[i], i, data, dataSeries);
        const truncD = scale.truncToInterval(value, scale.interval());
        // if current data point value skipped a band, we'll insert missing data points and iterate bands to catch up
        if (truncD && truncD > bands[b]) {
            newData.push({ ...data[i - 1], defined: false });
            newData.push({ ...data[i], defined: false });
            while (bands[b] < value) {
                b++;
            }
        }
        newData.push(data[i]);
        b++;
    }

    return newData;
}
