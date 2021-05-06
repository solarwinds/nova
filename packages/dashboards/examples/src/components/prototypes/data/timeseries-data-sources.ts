import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DataSourceService, IDataSource, INovaFilters, ITimeframe } from "@nova-ui/bits";
import {
    applyStatusEndpoints,
    IDataSourceOutput,
    ITimeseriesOutput,
    ITimeseriesWidgetData,
    ITimeseriesWidgetSeriesData,
    ITimeseriesWidgetStatusData,
} from "@nova-ui/dashboards";
import moment from "moment/moment";
import { BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";

import { getTimeseriesStatusData, getTimeseriesStatusIntervalData, getTimeseriesWidgetData, getTimeseriesWidgetData2 } from "./widget-data";

@Injectable()
export class AcmeTimeseriesDataSource extends DataSourceService<ITimeseriesWidgetData> implements IDataSource<ITimeseriesOutput> {
    public static providerId = "AcmeTimeseriesDataSource";
    public static mockError = false;

    constructor(private http: HttpClient) {
        super();
    }

    public busy = new BehaviorSubject(false);

    public async getFilteredData(filters: INovaFilters): Promise<IDataSourceOutput<ITimeseriesOutput>> {
        this.busy.next(true);
        if (!AcmeTimeseriesDataSource.mockError) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.busy.next(false);
                    resolve({
                        result: {
                            series: filterData(filters, getTimeseriesWidgetData()),
                        },
                    });
                }, 1000);
            });
        } else {
            // generate a 404
            return new Promise((resolve) => {
                this.http.get("http://www.mocky.io/v2/5ec6bfd93200007800d75100?mocky-delay=1000ms")
                    .pipe(finalize(() => {
                        this.busy.next(false);
                    })).subscribe({
                        error: (error: HttpErrorResponse) => {
                            resolve({
                                // @ts-ignore: Demo purposes
                                result: null,
                                error: {
                                    type: error.status,
                                },
                            });
                        },
                    });
            });
        }
    }
}

@Injectable()
export class AcmeTimeseriesDataSource2 extends DataSourceService<ITimeseriesWidgetData> implements IDataSource<ITimeseriesOutput> {
    public static providerId = "AcmeTimeseriesDataSource2";

    constructor() {
        super();
    }
    public busy = new BehaviorSubject(false);

    public async getFilteredData(filters: INovaFilters): Promise<ITimeseriesOutput> {
        this.busy.next(true);
        const data = { series: filterData(filters, getTimeseriesWidgetData2()) };
        this.busy.next(false);
        return data;
    }
}

@Injectable()
export class AcmeTimeseriesStatusDataSource extends DataSourceService<ITimeseriesWidgetData> implements IDataSource<ITimeseriesOutput> {
    public static providerId = "AcmeTimeseriesStatusDataSource";

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

export class AcmeTimeseriesStatusIntervalDataSource extends DataSourceService<ITimeseriesWidgetData> implements IDataSource<ITimeseriesOutput> {
    public static providerId = "AcmeTimeseriesStatusIntervalDataSource";

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

function filterDates(dateToCheck: Date, startDate: Date, endDate: Date) {
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
