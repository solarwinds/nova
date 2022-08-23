import {
    DataAccessor,
    IAccessors,
    IDataAccessors,
    ISeriesAccessors,
    SeriesAccessor,
} from "../../core/common/types";

export interface IStartEndRangeAccessors extends IDataAccessors {
    start: DataAccessor;
    end: DataAccessor;
}

export interface IValueThicknessAccessors extends IDataAccessors {
    value: DataAccessor;
    thickness: DataAccessor;
}

export interface IRectangleDataAccessors extends IDataAccessors {
    startX?: DataAccessor;
    endX?: DataAccessor;
    thicknessX?: DataAccessor;

    startY?: DataAccessor;
    endY?: DataAccessor;
    thicknessY?: DataAccessor;
}

export interface IRectangleSeriesAccessors extends ISeriesAccessors {
    color?: SeriesAccessor;
    marker?: SeriesAccessor;
}

export interface IRectangleAccessors extends IAccessors {
    data: IRectangleDataAccessors;
    series: IRectangleSeriesAccessors;
}

export class RectangleAccessors implements IRectangleAccessors {
    data: IRectangleDataAccessors;
    series: IRectangleSeriesAccessors;

    constructor() {}
}
