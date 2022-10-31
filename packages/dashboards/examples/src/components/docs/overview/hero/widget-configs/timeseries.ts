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

import moment from "moment/moment";

import {
    DEFAULT_PIZZAGNA_ROOT,
    IProviderConfiguration,
    ISerializableTimeframe,
    ITimeseriesItemConfiguration,
    IWidget,
    LegendPlacement,
    WellKnownProviders,
} from "@nova-ui/dashboards";

import { BeerVsReadingMockDataSource } from "../data/timeseries-data-sources";

export const timeseriesConfig: IWidget = {
    id: "timeseriesWidgetId",
    type: "timeseries",
    pizzagna: {
        configuration: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                providers: {
                    [WellKnownProviders.DataSource]: {
                        providerId: BeerVsReadingMockDataSource.providerId,
                    } as IProviderConfiguration,
                },
            },
            header: {
                properties: {
                    title: "Primary Leisure Activity Over Time",
                    subtitle: "Survey of 1000 Solarians",
                },
            },
            chart: {
                providers: {
                    [WellKnownProviders.Adapter]: {
                        properties: {
                            series: [
                                {
                                    id: "series-1",
                                    label: "Beer Tasting",
                                    selectedSeriesId: "series-1",
                                },
                                {
                                    id: "series-2",
                                    label: "Reading",
                                    selectedSeriesId: "series-2",
                                },
                            ] as ITimeseriesItemConfiguration[],
                        },
                    } as Partial<IProviderConfiguration>,
                },
                properties: {
                    configuration: {
                        legendPlacement: LegendPlacement.Right,
                        enableZoom: true,
                        leftAxisLabel: "Solarians (%)",
                    },
                },
            },
            timeframeSelection: {
                properties: {
                    timeframe: {
                        selectedPresetId: "last7Days",
                    } as ISerializableTimeframe,
                    minDate: moment().subtract(10, "days").format(),
                    maxDate: moment().format(),
                },
            },
        },
    },
};
