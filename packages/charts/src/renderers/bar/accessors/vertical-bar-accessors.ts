import { IChartMarker, IValueProvider } from "../../../core/common/types";
import { IRectangleSeriesAccessors } from "../../accessors/rectangle-accessors";

import { BarAccessors, IBarDataAccessors } from "./bar-accessors";

export class VerticalBarAccessors extends BarAccessors {
    data: IBarDataAccessors;
    series: IRectangleSeriesAccessors;

    constructor(colorProvider?: IValueProvider<string>, markerProvider?: IValueProvider<IChartMarker>) {
        super(colorProvider, markerProvider);

        this.data = {
            ...this.data,
            startX: (d, i, s, ds) => this.data.category(d, i, s, ds),
            endX: (d, i, s, ds) => this.data.category(d, i, s, ds),
            thicknessX: (d, i, s, ds) => this.data.thickness ? this.data.thickness(d, i, s, ds) : undefined,
            startY: (d, i, s, ds) => this.data.start(d, i, s, ds),
            endY: (d, i, s, ds) => this.data.end(d, i, s, ds),
        };
    }

}
