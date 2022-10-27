// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { Injectable } from "@angular/core";
import moment, { Moment } from "moment/moment";
import { BehaviorSubject } from "rxjs";

import {
    DataSourceService,
    IDataSource,
    INovaFilters,
    ITimeframe,
} from "@nova-ui/bits";
import {
    applyStatusEndpoints,
    HttpStatusCode,
    IDataSourceOutput,
    ITimeseriesOutput,
    ITimeseriesWidgetData,
    ITimeseriesWidgetSeriesData,
    ITimeseriesWidgetStatusData,
} from "@nova-ui/dashboards";

import {
    getTimeseriesStatusData,
    getTimeseriesStatusIntervalData,
    getTimeseriesWidgetData,
    getTimeseriesEventsData,
    getTimeseriesWidgetData2,
} from "./widget-data";

@Injectable()
export class TestTimeseriesDataSource
    extends DataSourceService<ITimeseriesWidgetData>
    implements IDataSource<ITimeseriesOutput>
{
    public static providerId = "TestTimeseriesDataSource";
    public static mockError = false;

    public busy = new BehaviorSubject(false);

    constructor() {
        super();
    }

    public async getFilteredData(
        filters: INovaFilters
    ): Promise<IDataSourceOutput<ITimeseriesOutput>> {
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
export class TestTimeseriesDataSource2
    extends DataSourceService<ITimeseriesWidgetData>
    implements IDataSource<ITimeseriesOutput>
{
    public static providerId = "TestTimeseriesDataSource2";

    public busy = new BehaviorSubject(false);

    constructor() {
        super();
    }

    public async getFilteredData(
        filters: INovaFilters
    ): Promise<ITimeseriesOutput> {
        return { series: filterData(filters, getTimeseriesWidgetData2()) };
    }
}

@Injectable()
export class TestTimeseriesEventsDataSource
    extends DataSourceService<ITimeseriesWidgetData>
    implements IDataSource<ITimeseriesOutput>
{
    public static providerId = "TestTimeseriesDataEventsSource";

    public busy = new BehaviorSubject(false);

    constructor() {
        super();
    }

    public async getFilteredData(
        filters: INovaFilters
    ): Promise<ITimeseriesOutput> {
        return { series: filterData(filters, getTimeseriesEventsData()) };
    }
}

@Injectable()
export class TestTimeseriesStatusDataSource
    extends DataSourceService<ITimeseriesWidgetData>
    implements IDataSource<ITimeseriesOutput<ITimeseriesWidgetStatusData>>
{
    public static providerId = "TestTimeseriesStatusDataSource";

    constructor() {
        super();
    }

    public busy = new BehaviorSubject(false);

    public async getFilteredData(
        filters: INovaFilters
    ): Promise<ITimeseriesOutput<ITimeseriesWidgetStatusData>> {
        this.busy.next(true);
        const data = {
            series: getFilteredStatusDataWithEndpoints(
                filters,
                getTimeseriesStatusData()
            ),
        };
        this.busy.next(false);
        return data;
    }
}

@Injectable()
export class TestTimeseriesStatusIntervalDataSource
    extends DataSourceService<ITimeseriesWidgetData>
    implements IDataSource<ITimeseriesOutput<ITimeseriesWidgetStatusData>>
{
    public static providerId = "TestTimeseriesStatusIntervalDataSource";

    constructor() {
        super();
    }

    public busy = new BehaviorSubject(false);

    public async getFilteredData(
        filters: INovaFilters
    ): Promise<ITimeseriesOutput<ITimeseriesWidgetStatusData>> {
        this.busy.next(true);
        const data = {
            series: filterData(filters, getTimeseriesStatusIntervalData()),
        };
        this.busy.next(false);
        return data;
    }
}

function filterData(
    filters: INovaFilters,
    data: ITimeseriesWidgetData[]
): ITimeseriesWidgetData[] {
    const timeframeFilter = filters.timeframe;
    let filteredData = data;
    // TIME FRAME PICKER FILTERING
    if (timeframeFilter) {
        filteredData = filteredData.map((item: ITimeseriesWidgetData) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            link: item.link,
            secondaryLink: item.secondaryLink,
            data: item.data.filter((seriesData: ITimeseriesWidgetSeriesData) =>
                filterDates(
                    seriesData.x,
                    timeframeFilter.value.startDatetime,
                    timeframeFilter.value.endDatetime
                )
            ),
        }));
    }

    return filteredData;
}

function filterDates(dateToCheck: Date, startDate: Moment, endDate: Moment) {
    const mom = moment(dateToCheck);
    return (
        mom.isBetween(startDate, endDate) ||
        mom.isSame(startDate) ||
        mom.isSame(endDate)
    );
}

function getFilteredStatusDataWithEndpoints(
    filters: INovaFilters,
    data: ITimeseriesWidgetData[]
): ITimeseriesWidgetData[] {
    let filteredData = filterData(filters, data);
    if (filters.timeframe) {
        filteredData = applyStatusEndpoints(
            filters.timeframe.value as ITimeframe,
            filteredData,
            data
        );
    }
    return filteredData;
}
