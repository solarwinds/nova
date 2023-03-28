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

import cloneDeep from "lodash/cloneDeep";
import moment from "moment/moment";

import { ITimeseriesWidgetSeriesData } from "../types";

export function transformFloatingAverage(
    data: ITimeseriesWidgetSeriesData[],
    hasPercentile?: boolean
): ITimeseriesWidgetSeriesData[] {
    const transformed = cloneDeep(data);

    function getAverageFromLastHour(
        data: ITimeseriesWidgetSeriesData[],
        index: number
    ) {
        let sum = 0.0;
        let count = 0;

        const dateTime = moment(data[index].x);
        while (
            index >= 0 &&
            dateTime.diff(moment(data[index].x), "minutes") <= 60
        ) {
            count++;
            sum += data[index].y;
            index--;
        }
        return sum / count;
    }

    transformed.forEach((value: ITimeseriesWidgetSeriesData, index: number) => {
        transformed[index].y = getAverageFromLastHour(transformed, index);
    });

    return transformed;
}
