import { DataAccessor, IAccessors, SeriesAccessor } from "../../core/common/types";
import { defaultColorProvider, defaultMarkerProvider } from "../../core/common/palette/default-providers";


export interface IXYDataAccessors {
    /** Accessor for value plotted on the <code>x</code> coordinate */
    x: DataAccessor;
    /** Accessor for value plotted on the <code>y</code> coordinate */
    y: DataAccessor;
    /** Additional custom keys to match the base interface */
    [key: string]: DataAccessor | undefined;
}
export interface IXYSeriesAccessors {
    /** Color of the series */
    color?: SeriesAccessor;
    /** Marker for the series */
    marker?: SeriesAccessor;
    /** Additional custom keys to match the base interface */
    [key: string]: SeriesAccessor | undefined;
}
export interface IXYAccessors extends IAccessors {
    data: IXYDataAccessors;
    /** Series level accessors - e.g. for colors, markers, etc. */
    series: IXYSeriesAccessors;
}

export class XYAccessors implements IAccessors {
    /** The default data accessors for using with renderers deriving from XYRenderer */
    public data: IXYDataAccessors = {
        x: (d: any) => d.x,
        y: (d: any) => d.y,
    };
    public series: IXYSeriesAccessors;

    constructor(public colorProvider = defaultColorProvider(), public markerProvider = defaultMarkerProvider()) {

        this.data.defined = (d: any, i) => d.hasOwnProperty("defined") ? d.defined : true;

        this.series = {
            color: this.colorProvider ? this.colorProvider.get : undefined,
            marker: this.markerProvider ? this.markerProvider.get : undefined,
        };
    }
}
