import { Renderer } from "../core/common/renderer";
import { Scales } from "../core/common/scales/types";
import { IAccessors, IDataSeries, IPosition, IRendererEventPayload } from "../core/common/types";
import { IRenderSeries } from "./types";
import { Subject } from "rxjs";
import isUndefined from "lodash/isUndefined";
import { DATA_POINT_INTERACTION_RESET } from "../constants";
import { UtilityService } from "../core/common/utility.service";


export class XYRenderer<IXYAccessors> extends Renderer<IXYAccessors> {

    public draw(renderSeries: IRenderSeries<IXYAccessors>, rendererSubject: Subject<IRendererEventPayload>): void {

    };

    public getDataPointPosition(dataSeries: IDataSeries<IAccessors>, index: number, scales: Scales): IPosition | undefined {
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
    public getDataPointIndex(series: IDataSeries<IXYAccessors>, values: { [p: string]: any }, scales: Scales): number {
        if (isUndefined(values.x)) {
            return DATA_POINT_INTERACTION_RESET;
        }

        // @ts-ignore
        const index = UtilityService.getClosestIndex(series.data, (d, i) => series.accessors.data.x(d, i, series.data, series), values.x);

        if (isUndefined(index)) {
            throw new Error("Unable to get data point index");
        }

        return index;
    }
}
