import { Renderer } from "../core/common/renderer";
import { Scales } from "../core/common/scales/types";
import { IAccessors, IDataSeries, IPosition } from "../core/common/types";

export abstract class XYRenderer<TA extends IAccessors> extends Renderer<TA> {

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

}
