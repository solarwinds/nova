import {
    defaultColorProvider,
    defaultMarkerProvider,
} from "../../../core/common/palette/default-providers";
import {
    DataAccessor,
    IAccessors,
    IDataSeries,
} from "../../../core/common/types";
import {
    IRectangleDataAccessors,
    IRectangleSeriesAccessors,
    RectangleAccessors,
} from "../../accessors/rectangle-accessors";

export interface IBarDataAccessors extends IRectangleDataAccessors {
    category: DataAccessor;
    start: DataAccessor;
    end: DataAccessor;
    thickness?: DataAccessor;
    value?: DataAccessor;
    color?: DataAccessor;
    marker?: DataAccessor;
    cssClass?: DataAccessor<any, string>;
}

export interface IBarAccessors extends IAccessors {
    data: IBarDataAccessors;
    series: IRectangleSeriesAccessors;
}

export abstract class BarAccessors
    extends RectangleAccessors
    implements IBarAccessors
{
    data: IBarDataAccessors;
    series: IRectangleSeriesAccessors;

    constructor(
        private colorProvider = defaultColorProvider(),
        private markerProvider = defaultMarkerProvider()
    ) {
        super();

        this.data = {
            value: (data: any) => data.value,
            category: (
                d,
                i,
                series: any[],
                dataSeries: IDataSeries<IAccessors>
            ) => {
                if (d.category) {
                    return d.category;
                }

                if (this.series.category) {
                    return this.series.category(dataSeries.id, dataSeries);
                }

                return null;
            },
            start: (
                data: any,
                index: number,
                series: any[],
                dataSeries: IDataSeries<IAccessors>
            ) => {
                if (data.__bar) {
                    return data.__bar.start;
                }
                if (typeof data.start !== "undefined") {
                    return data.start;
                }

                const value = this.getSingleValue(
                    data,
                    index,
                    series,
                    dataSeries
                );
                if (Number.isFinite(value)) {
                    return Math.min(0, value);
                }

                return null;
            },
            end: (
                data: any,
                index: number,
                series: any[],
                dataSeries: IDataSeries<IAccessors>
            ) => {
                if (data.__bar) {
                    return data.__bar.end;
                }
                if (typeof data.end !== "undefined") {
                    return data.end;
                }

                const value = this.getSingleValue(
                    data,
                    index,
                    series,
                    dataSeries
                );
                if (Number.isFinite(value)) {
                    return Math.max(0, value);
                }

                return null;
            },
        };

        this.series = {
            color: this.colorProvider ? this.colorProvider.get : undefined,
            marker: this.markerProvider ? this.markerProvider.get : undefined,
            category: (seriesId, series) => series.name || series.id,
        };
    }

    private getSingleValue(
        data: any,
        index: number,
        series: any[],
        dataSeries: IDataSeries<IAccessors>
    ) {
        let value: any;
        if (this.data.value) {
            // try to use the value accessor to retrieve value
            value = this.data.value(data, index, series, dataSeries);
            // if it fails to retrieve a valid value, then we consider the data point to be a primitive value that is returned directly
            if (typeof value === "undefined") {
                value = data;
            }
        }
        return value;
    }
}
