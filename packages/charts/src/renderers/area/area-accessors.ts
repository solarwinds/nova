import {
    defaultColorProvider,
    defaultMarkerProvider,
} from "../../core/common/palette/default-providers";
import {
    DataAccessor,
    IAccessors,
    IDataAccessors,
    ISeriesAccessors,
    SeriesAccessor,
} from "../../core/common/types";

export interface IAreaDataAccessors extends IDataAccessors {
    x: DataAccessor;
    x0: DataAccessor;
    x1: DataAccessor;
    absoluteX0: DataAccessor;
    absoluteX1: DataAccessor;
    y: DataAccessor;
    y0: DataAccessor;
    y1: DataAccessor;
    absoluteY0: DataAccessor;
    absoluteY1: DataAccessor;
}

export interface IAreaSeriesAccessors extends ISeriesAccessors {
    color?: SeriesAccessor;
    marker?: SeriesAccessor;
}

export interface IAreaAccessors extends IAccessors {
    data: IAreaDataAccessors;
    series: IAreaSeriesAccessors;
}

export class AreaAccessors implements IAreaAccessors {
    data: IAreaDataAccessors;
    series: IAreaSeriesAccessors;

    constructor(
        private colorProvider = defaultColorProvider(),
        private markerProvider = defaultMarkerProvider()
    ) {
        this.data = {
            x: (d, i, ds, s) => d.x,
            x0: (d, i, ds, s) => this.data.x(d, i, ds, s),
            x1: (d, i, ds, s) => this.data.x(d, i, ds, s),
            y: (d, i, ds, s) => d.y,
            y0: (d, i, ds, s) => this.data.y(d, i, ds, s),
            y1: (d, i, ds, s) => this.data.y(d, i, ds, s),
            absoluteX0: (d, i, ds, s) =>
                d["__stack_x"]?.start ?? this.data.x0(d, i, ds, s),
            absoluteX1: (d, i, ds, s) =>
                d["__stack_x"]?.end ?? this.data.x1(d, i, ds, s),
            absoluteY0: (d, i, ds, s) =>
                d["__stack_y"]?.start ?? this.data.y0(d, i, ds, s),
            absoluteY1: (d, i, ds, s) =>
                d["__stack_y"]?.end ?? this.data.y1(d, i, ds, s),
        };

        this.series = {
            color: this.colorProvider ? this.colorProvider.get : undefined,
            marker: this.markerProvider ? this.markerProvider.get : undefined,
        };
    }
}
