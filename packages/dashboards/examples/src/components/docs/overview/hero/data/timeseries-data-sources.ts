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
import { Moment } from "moment/moment";
import { BehaviorSubject } from "rxjs";

import { DataSourceService, IDataSource, INovaFilters } from "@nova-ui/bits";
import {
    ITimeseriesOutput,
    ITimeseriesWidgetData,
    ITimeseriesWidgetSeriesData,
} from "@nova-ui/dashboards";

import {
    BEER_VS_READING_DATA,
    LOUNGING_VS_ULTIMATE_FRISBEE_DATA,
} from "./widget-data";

@Injectable()
export class BeerVsReadingMockDataSource
    extends DataSourceService<ITimeseriesWidgetData>
    implements IDataSource<ITimeseriesOutput>
{
    public static providerId = "BeerVsReadingMockDataSource";

    public busy = new BehaviorSubject(false);

    constructor() {
        super();
    }

    public async getFilteredData(
        filters: INovaFilters
    ): Promise<ITimeseriesOutput> {
        this.busy.next(true);
        const result = await delay(
            { series: getData(filters, BEER_VS_READING_DATA) },
            1000
        );
        this.busy.next(false);
        return result;
    }
}

@Injectable()
export class LoungingVsFrisbeeGolfMockDataSource
    extends DataSourceService<ITimeseriesWidgetData>
    implements IDataSource<ITimeseriesOutput>
{
    public static providerId = "LoungingVsFrisbeeGolfMockDataSource";

    public busy = new BehaviorSubject(false);

    constructor() {
        super();
    }

    public async getFilteredData(
        filters: INovaFilters
    ): Promise<ITimeseriesOutput> {
        this.busy.next(true);
        const result = await delay(
            { series: getData(filters, LOUNGING_VS_ULTIMATE_FRISBEE_DATA) },
            1000
        );
        this.busy.next(false);
        return result;
    }
}

function getData(
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

function filterDates(dateToCheck: Moment, startDate: Moment, endDate: Moment) {
    return (
        dateToCheck.isBetween(startDate, endDate) ||
        dateToCheck.isSame(startDate) ||
        dateToCheck.isSame(endDate)
    );
}

async function delay(
    value: ITimeseriesOutput,
    ms: number
): Promise<ITimeseriesOutput> {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
