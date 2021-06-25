import { Renderer } from "../core/common/renderer";
import { Scales } from "../core/common/scales/types";
import { IAccessors, IDataSeries, IPosition, IRendererEventPayload } from "../core/common/types";
import { IRenderSeries } from "./types";
import { Subject } from "rxjs";
import isUndefined from "lodash/isUndefined";
import { DATA_POINT_INTERACTION_RESET } from "../constants";
import { UtilityService } from "../core/common/utility.service";

export class XYRenderer<TA extends IAccessors> extends Renderer<TA> {
    // This is empty to allow this renderer to be used for series that represent metadata that may be shown in the legend but not visualized on the chart.
    /** See {@link Renderer#draw} */
    public draw(renderSeries: IRenderSeries<TA>, rendererSubject: Subject<IRendererEventPayload>): void {}

    /** See {@link Renderer#getDataPointPosition} */
    public getDataPointPosition(dataSeries: IDataSeries<TA>, index: number, scales: Scales): IPosition | undefined {
        if (index < 0 || index >= dataSeries.data.length) {
            return undefined;
        }
        const point = dataSeries.data[index];

        if (!dataSeries.accessors.data?.x || !dataSeries.accessors.data?.y) {
            throw new Error("Can't get dataPointPosition");
        }
        return {
            x: scales.x.convert(dataSeries.accessors.data.x(point, index, dataSeries.data, dataSeries)),
            y: scales.y.convert(dataSeries.accessors.data.y(point, index, dataSeries.data, dataSeries)),
        };
    }

    /** See {@link Renderer#getDataPointIndex} */
    public getDataPointIndex(series: IDataSeries<TA>, values: { [p: string]: any }, scales: Scales): number {
        if (isUndefined(values.x)) {
            return DATA_POINT_INTERACTION_RESET;
        }

        const index = UtilityService.getClosestIndex(series.data, (d, i) => series.accessors.data?.x?.(d, i, series.data, series), values.x);

        if (isUndefined(index)) {
            throw new Error("Unable to get data point index");
        }

        return index;
    }
}
