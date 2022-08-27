import { DataAccessor, IAccessors, IDataSeries, SeriesAccessor } from "./types";

export class DataSeries implements IDataSeries<IAccessors> {
    public id: string;
    public accessors: {
        data?: Record<string, DataAccessor | undefined>;
        series?: Record<string, SeriesAccessor | undefined>;
    };
    public data: any[];
    public name: string;

    constructor(dataSeries: IDataSeries<IAccessors>) {
        this.id = dataSeries.id;
        this.data = dataSeries.data;
        this.name = dataSeries.name;
        // TODO: here we can check if default accessors are valid and warn user
        this.accessors = dataSeries.accessors || {
            data: {
                category: (d: any) => d.name,
                value: (d: any) => d.value,
            },
            series: {},
        };
    }
}
