import { defaultColorProvider } from "../../../core/common/palette/default-providers";
import { DataAccessor, IAccessors, SeriesAccessor } from "../../../core/common/types";

export interface IRadialDataAccessors {
    value: DataAccessor;
    color?: DataAccessor;
    /** Additional custom keys to match the base interface */
    [key: string]: DataAccessor | undefined;
}

export interface IRadialSeriesAccessors {
    color?: SeriesAccessor;
    /** Additional custom keys to match the base interface */
    [key: string]: SeriesAccessor | undefined;
}

export interface IRadialAccessors extends IAccessors {
    data: IRadialDataAccessors;
    series: IRadialSeriesAccessors;
}

export class RadialAccessors implements IRadialAccessors {
    data: IRadialDataAccessors;
    series: IRadialSeriesAccessors;

    constructor(private colorProvider = defaultColorProvider()) {
        this.data = {
            value: (d: any) => Number.isFinite(d) ? d : d.value,
        };
        this.series = {
            color: this.colorProvider ? this.colorProvider.get : undefined,
        };
    }
}
