import {
    DEFAULT_PIZZAGNA_ROOT,
    IProviderConfiguration,
    ISerializableTimeframe,
    ITimeseriesItemConfiguration,
    IWidget,
    LegendPlacement,
    WellKnownProviders,
} from "@nova-ui/dashboards";
import moment from "moment/moment";

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
