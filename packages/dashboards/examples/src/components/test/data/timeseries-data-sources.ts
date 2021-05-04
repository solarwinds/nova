import { Injectable } from "@angular/core";
import { DataSourceService, IDataSource, INovaFilters, ITimeframe } from "@nova-ui/bits";
import {
    applyStatusEndpoints,
    HttpStatusCode,
    IDataSourceOutput,
    ITimeseriesOutput,
    ITimeseriesWidgetData,
    ITimeseriesWidgetSeriesData,
    ITimeseriesWidgetStatusData
} from "@nova-ui/dashboards";
import moment, { Moment } from "moment/moment";
import { BehaviorSubject } from "rxjs";

import { getTimeseriesStatusData, getTimeseriesStatusIntervalData, getTimeseriesWidgetData, getTimeseriesWidgetData2 } from "./widget-data";

@Injectable()
export class TestTimeseriesDataSource extends DataSourceService<ITimeseriesWidgetData> implements IDataSource<ITimeseriesOutput> {
    public static providerId = "TestTimeseriesDataSource";
    public static mockError = false;

    public busy = new BehaviorSubject(false);

    constructor() {
        super();
    }

    public async getFilteredData(filters: INovaFilters): Promise<IDataSourceOutput<ITimeseriesOutput>> {
        if (!TestTimeseriesDataSource.mockError) {
            return {
                result: {
                    series: filterData(filters, getTimeseriesWidgetData()),
                },
            };
        }
        return {
            // @ts-ignore: Mock
            result: null,
            error: { type: HttpStatusCode.Unknown },
        };
    }
}

@Injectable()
export class TestTimeseriesDataSource2 extends DataSourceService<ITimeseriesWidgetData> implements IDataSource<ITimeseriesOutput> {
    public static providerId = "TestTimeseriesDataSource2";

    public busy = new BehaviorSubject(false);

    constructor() {
        super();
    }

    public async getFilteredData(filters: INovaFilters): Promise<ITimeseriesOutput> {
        return { series: filterData(filters, getTimeseriesWidgetData2()) };
    }
}

@Injectable()
export class TestTimeseriesStatusDataSource extends DataSourceService<ITimeseriesWidgetData>
    implements IDataSource<ITimeseriesOutput<ITimeseriesWidgetStatusData>> {
    public static providerId = "TestTimeseriesStatusDataSource";

    constructor() {
        super();
    }

    public busy = new BehaviorSubject(false);

    public async getFilteredData(filters: INovaFilters): Promise<ITimeseriesOutput<ITimeseriesWidgetStatusData>> {
        this.busy.next(true);
        const data = { series: getFilteredStatusDataWithEndpoints(filters, getTimeseriesStatusData()) };
        this.busy.next(false);
        return data;
    }
}

@Injectable()
export class TestTimeseriesStatusIntervalDataSource extends DataSourceService<ITimeseriesWidgetData>
    implements IDataSource<ITimeseriesOutput<ITimeseriesWidgetStatusData>> {
    public static providerId = "TestTimeseriesStatusIntervalDataSource";

    constructor() {
        super();
    }

    public busy = new BehaviorSubject(false);

    public async getFilteredData(filters: INovaFilters): Promise<ITimeseriesOutput<ITimeseriesWidgetStatusData>> {
        this.busy.next(true);
        const data = { series: filterData(filters, getTimeseriesStatusIntervalData()) };
        this.busy.next(false);
        return data;
    }
}

function filterData(filters: INovaFilters, data: ITimeseriesWidgetData[]): ITimeseriesWidgetData[] {
    const timeframeFilter = filters.timeframe;
    let filteredData = data;
    // TIME FRAME PICKER FILTERING
    if (timeframeFilter) {
        filteredData = filteredData.map((item: ITimeseriesWidgetData) =>
            ({
                id: item.id,
                name: item.name,
                description: item.description,
                link: item.link,
                secondaryLink: item.secondaryLink,
                data: item.data.filter((seriesData: ITimeseriesWidgetSeriesData) =>
                    filterDates(seriesData.x, timeframeFilter.value.startDatetime, timeframeFilter.value.endDatetime)),
            }));
    }

    return filteredData;
}

function filterDates(dateToCheck: Date, startDate: Moment, endDate: Moment) {
    const mom = moment(dateToCheck);
    return mom.isBetween(startDate, endDate) || mom.isSame(startDate) || mom.isSame(endDate);
}

function getFilteredStatusDataWithEndpoints(filters: INovaFilters, data: ITimeseriesWidgetData[]): ITimeseriesWidgetData[] {
    let filteredData = filterData(filters, data);
    if (filters.timeframe) {
        filteredData = applyStatusEndpoints(filters.timeframe.value as ITimeframe, filteredData, data);
    }
    return filteredData;
}
