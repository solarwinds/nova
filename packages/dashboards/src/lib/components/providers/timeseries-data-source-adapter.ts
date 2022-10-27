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

import { Inject } from "@angular/core";
import clone from "lodash/clone";

import {
    EventBus,
    IDataSource,
    IEvent,
    IFilteringOutputs,
} from "@nova-ui/bits";

import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../types";
import {
    ITimeseriesWidgetData,
    ITimeseriesWidgetSeries,
} from "../timeseries-widget/types";
import { DataSourceAdapter } from "./data-source-adapter";
import { ITimeseriesDataSourceAdapterConfiguration } from "./types";

export class TimeseriesDataSourceAdapter extends DataSourceAdapter {
    private seriesIndex: ITimeseriesWidgetSeries[] = [];

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        @Inject(DATA_SOURCE) dataSource: IDataSource,
        pizzagnaService: PizzagnaService
    ) {
        super(eventBus, dataSource, pizzagnaService);
    }

    public updateConfiguration(
        properties: ITimeseriesDataSourceAdapterConfiguration
    ) {
        this.seriesIndex = clone(properties.series);

        super.updateConfiguration(properties);
    }

    protected processOutput(value: IFilteringOutputs): IFilteringOutputs {
        if (!value) {
            return value;
        }
        return {
            ...value,
            series: this.buildSeriesSet(value?.series),
        };
    }

    /**
     * Builds the series set by mapping the series selected in the configurator to the data received from the data source.
     * @param data
     */
    private buildSeriesSet(data: ITimeseriesWidgetData[]) {
        if (!data) {
            return [];
        }

        // displaying only series which are in widget config
        return data
            .filter((series: ITimeseriesWidgetData) =>
                this.seriesIndex.find((s) => s.selectedSeriesId === series.id)
            )
            .map((series: ITimeseriesWidgetData) => ({
                id: series.id,
                data: series.data,
                link: series.link,
                secondaryLink: series.secondaryLink,
                legendDescriptionPrimary: this.seriesIndex.find(
                    (s) => s.selectedSeriesId === series.id
                )?.label,
                legendDescriptionSecondary: series.description,
            }));
    }
}
