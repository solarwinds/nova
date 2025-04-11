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

import { Subject } from "rxjs";

import { INoopAccessors } from "./accessors/noop-accessors";
import { IRenderSeries } from "./types";
import { Renderer } from "../core/common/renderer";
import { Scales } from "../core/common/scales/types";
import {
    IDataSeries,
    ILasagnaLayer,
    IPosition,
    IRendererEventPayload,
} from "../core/common/types";

/**
 * Renderer that is able to draw line chart
 */
export class NoopRenderer extends Renderer<INoopAccessors> {
    /** See {@link Renderer#draw} */
    public draw(
        renderSeries: IRenderSeries<INoopAccessors>,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {}

    /** See {@link Renderer#highlightDataPoint} */
    public highlightDataPoint(
        renderSeries: IRenderSeries<INoopAccessors>,
        dataPointIndex: number,
        rendererSubject: Subject<IRendererEventPayload>
    ): void {}

    /** See {@link Renderer#getRequiredLayers} */
    public getRequiredLayers(): ILasagnaLayer[] {
        return [];
    }

    /** See {@link Renderer#getDataPointPosition} */
    public getDataPointPosition(
        dataSeries: IDataSeries<INoopAccessors>,
        index: number,
        scales: Scales
    ): IPosition {
        // @ts-ignore
        return;
    }
}
