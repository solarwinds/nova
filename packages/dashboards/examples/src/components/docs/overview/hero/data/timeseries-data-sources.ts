import { Injectable } from "@angular/core";
import { DataSourceService, INovaFilters } from "@nova-ui/bits";
import { IDataSource, ITimeseriesOutput, ITimeseriesWidgetData, ITimeseriesWidgetSeriesData } from "@nova-ui/dashboards";
import { Moment } from "moment/moment";
import { BehaviorSubject } from "rxjs";

import { BEER_VS_READING_DATA, LOUNGING_VS_ULTIMATE_FRISBEE_DATA } from "./widget-data";

@Injectable()
export class BeerVsReadingMockDataSource extends DataSourceService<ITimeseriesWidgetData> implements IDataSource<ITimeseriesOutput> {
    public static providerId = "BeerVsReadingMockDataSource";

    public busy = new BehaviorSubject(false);

    constructor() {
        super();
    }

    public async getFilteredData(filters: INovaFilters): Promise<ITimeseriesOutput> {
        this.busy.next(true);
        const result = await delay({ series: getData(filters, BEER_VS_READING_DATA) }, 1000);
        this.busy.next(false);
        return result;
    }
}

@Injectable()
export class LoungingVsFrisbeeGolfMockDataSource extends DataSourceService<ITimeseriesWidgetData> implements IDataSource<ITimeseriesOutput> {
    public static providerId = "LoungingVsFrisbeeGolfMockDataSource";

    public busy = new BehaviorSubject(false);

    constructor() {
        super();
    }

    public async getFilteredData(filters: INovaFilters): Promise<ITimeseriesOutput> {
        this.busy.next(true);
        const result = await delay({ series: getData(filters, LOUNGING_VS_ULTIMATE_FRISBEE_DATA) }, 1000);
        this.busy.next(false);
        return result;
    }
}

function getData(filters: INovaFilters, data: ITimeseriesWidgetData[]): ITimeseriesWidgetData[] {
    const timeframeFilter = filters.timeframe;
    let filteredData = data;
    // TIME FRAME PICKER FILTERING
    if (timeframeFilter) {
        filteredData = filteredData.map((item: ITimeseriesWidgetData) =>
            ({
                id: item.id,
                name: item.name,
                description: item.description,
                data: item.data.filter((seriesData: ITimeseriesWidgetSeriesData) =>
                    filterDates(seriesData.x, timeframeFilter.value.startDatetime, timeframeFilter.value.endDatetime)),
            }));
    }

    return filteredData;
}

function filterDates(dateToCheck: Moment, startDate: Moment, endDate: Moment) {
    return dateToCheck.isBetween(startDate, endDate) || dateToCheck.isSame(startDate) || dateToCheck.isSame(endDate);
}

async function delay(value: ITimeseriesOutput, ms: number): Promise<ITimeseriesOutput> {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
}
