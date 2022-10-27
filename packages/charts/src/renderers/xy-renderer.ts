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

import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";

import { DATA_POINT_INTERACTION_RESET } from "../constants";
import { Renderer } from "../core/common/renderer";
import { Scales } from "../core/common/scales/types";
import {
    IAccessors,
    IDataSeries,
    IPosition,
    IRendererEventPayload,
} from "../core/common/types";
import { UtilityService } from "../core/common/utility.service";
import { IRenderSeries } from "./types";

export class XYRenderer<TA extends IAccessors> extends Renderer<TA> {
    // This is empty to allow this renderer to be used for series that represent metadata that may be shown in the legend but not visualized on the chart.
    /** See {@link Renderer#draw} */
    public draw(
        renderSeries: IRenderSeries<TA>,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {}

    /** See {@link Renderer#getDataPointPosition} */
    public getDataPointPosition(
        dataSeries: IDataSeries<TA>,
        index: number,
        scales: Scales
    ): IPosition | undefined {
        if (index < 0 || index >= dataSeries.data.length) {
            return undefined;
        }
        const point = dataSeries.data[index];

        if (!dataSeries.accessors.data?.x || !dataSeries.accessors.data?.y) {
            throw new Error("Can't get dataPointPosition");
        }
        return {
            x: scales.x.convert(
                dataSeries.accessors.data.x(
                    point,
                    index,
                    dataSeries.data,
                    dataSeries
                )
            ),
            y: scales.y.convert(
                dataSeries.accessors.data.y(
                    point,
                    index,
                    dataSeries.data,
                    dataSeries
                )
            ),
        };
    }

    /** See {@link Renderer#getDataPointIndex} */
    public getDataPointIndex(
        series: IDataSeries<TA>,
        values: { [p: string]: any },
        scales: Scales
    ): number {
        if (isUndefined(values.x)) {
            return DATA_POINT_INTERACTION_RESET;
        }

        const index = UtilityService.getClosestIndex(
            series.data,
            (d, i) => series.accessors.data?.x?.(d, i, series.data, series),
            values.x
        );

        if (isUndefined(index)) {
            throw new Error("Unable to get data point index");
        }

        return index;
    }
}
