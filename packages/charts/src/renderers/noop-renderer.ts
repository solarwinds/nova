import {Subject} from "rxjs";

import {Renderer} from "../core/common/renderer";
import {Scales} from "../core/common/scales/types";
import {IDataSeries, ILasagnaLayer, IPosition, IRendererEventPayload} from "../core/common/types";

import {INoopAccessors} from "./accessors/noop-accessors";
import {IRenderSeries} from "./types";

/**
 * Renderer that is able to draw line chart
 */
export class NoopRenderer extends Renderer<INoopAccessors> {

    /** See {@link Renderer#draw} */
    public draw(renderSeries: IRenderSeries<INoopAccessors>, rendererSubject: Subject<IRendererEventPayload>): void {
    }

    /** See {@link Renderer#highlightDataPoint} */
    public highlightDataPoint(renderSeries: IRenderSeries<INoopAccessors>,
                              dataPointIndex: number,
                              rendererSubject: Subject<IRendererEventPayload>): void {
    }

    /** See {@link Renderer#getRequiredLayers} */
    public getRequiredLayers(): ILasagnaLayer[] {
        return [];
    }

    /** See {@link Renderer#getDataPointPosition} */
    public getDataPointPosition(dataSeries: IDataSeries<INoopAccessors>, index: number, scales: Scales): IPosition {
        // @ts-ignore
        return;
    }
}
