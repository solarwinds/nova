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

import { RadialRenderer } from "../../renderers/radial/radial-renderer";
import { ChartPlugin } from "../common/chart-plugin";
import { IElementPosition } from "./types";

/**
 * This plugin calculates new size and position for content inside donut chart
 */
export class ChartDonutContentPlugin extends ChartPlugin {
    /** Subject for getting updates on the content position */
    public contentPositionUpdateSubject = new Subject<IElementPosition>();

    /** The current content position */
    public contentPosition: IElementPosition = {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    };

    public updateDimensions() {
        const radius = this.chart
            .getDataManager()
            .chartSeriesSet.reduce((prev: number | undefined, current) => {
                if (
                    current.renderer instanceof RadialRenderer &&
                    !isUndefined(prev)
                ) {
                    return Math.min(
                        prev,
                        current.renderer.getInnerRadius(
                            current.scales.r.range(),
                            current.data.length - 1
                        )
                    );
                }
                return prev;
            }, Infinity);

        if (isUndefined(radius)) {
            throw new Error("Radius is undefined");
        }

        this.contentPosition = this.getContentPosition(radius);
        this.contentPositionUpdateSubject.next(this.contentPosition);
    }

    public destroy(): void {
        this.contentPositionUpdateSubject.complete();
    }

    private getContentPosition(areaSize: number): IElementPosition {
        const basics = [
            this.chart.getGrid().config().dimension.outerHeight() / 2,
            this.chart.getGrid().config().dimension.outerWidth() / 2,
        ];
        return {
            top: basics[0] - areaSize / Math.sqrt(2),
            left: basics[1] - areaSize / Math.sqrt(2),
            width: areaSize * Math.sqrt(2),
            height: areaSize * Math.sqrt(2),
        };
    }
}
