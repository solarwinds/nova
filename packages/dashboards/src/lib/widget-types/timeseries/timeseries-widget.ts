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

import { StackComponent } from "../../components/layouts/stack/stack.component";
import { TimeframeSelectionComponent } from "../../components/time-frame-selection/timeframe-selection.component";
import { TimeseriesWidgetComponent } from "../../components/timeseries-widget/timeseries-widget.component";
import {
    ITimeseriesScaleConfig,
    ITimeseriesWidgetConfig,
    TimeseriesChartPreset,
    TimeseriesScaleType,
} from "../../components/timeseries-widget/types";
import { ITimeseriesItemConfiguration } from "../../configurator/components/widgets/timeseries/types";
import {
    DEFAULT_PIZZAGNA_ROOT,
    NOVA_TIMESERIES_DATASOURCE_ADAPTER,
} from "../../services/types";
import {
    IProviderConfiguration,
    PizzagnaLayer,
    WellKnownProviders,
} from "../../types";
import {
    widgetBodyContentNodes,
    WIDGET_BODY,
    WIDGET_HEADER,
    WIDGET_LOADING,
} from "../common/widget/components";
import { EVENT_PROXY, refresher } from "../common/widget/providers";

export const timeseriesWidget = {
    [PizzagnaLayer.Structure]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            id: DEFAULT_PIZZAGNA_ROOT,
            // base layout of the widget - all components referenced herein will be stacked in a column
            componentType: StackComponent.lateLoadKey,
            providers: {
                // When enabled, this provider emits the REFRESH event on the pizzagna event bus every X seconds
                [WellKnownProviders.Refresher]: refresher(),
                // event proxy manages the transmission of events between widget and dashboard
                [WellKnownProviders.EventProxy]: EVENT_PROXY,
            },
            properties: {
                // these values reference other components in this structure
                nodes: ["header", "loading", "body"],
            },
        },
        // widget header
        header: WIDGET_HEADER,
        // this is the loading bar below the header
        loading: WIDGET_LOADING,
        // widget body
        body: {
            ...WIDGET_BODY,
            properties: {
                ...WIDGET_BODY.properties,
                elementClass: "overflow-auto",
            },
        },

        // retrieving the definitions for the body content nodes. the argument corresponds to the main content node key
        ...widgetBodyContentNodes("mainContent"),

        mainContent: {
            id: "mainContent",
            componentType: StackComponent.lateLoadKey,
            properties: {
                // these values reference other components in this configuration
                nodes: ["timeframeSelection", "chart"],
            },
        },
        // component that filters the widget's timeseries data by timeframe
        timeframeSelection: {
            id: "timeframeSelection",
            componentType: TimeframeSelectionComponent.lateLoadKey,
        },
        // component that displays the widget's timeseries data as a line chart
        chart: {
            id: "chart",
            componentType: TimeseriesWidgetComponent.lateLoadKey,
            properties: {
                elementClass:
                    "d-flex flex-column justify-content-center h-100 overflow-auto",
                configuration: {
                    preset: TimeseriesChartPreset.Line,
                    // this scales configuration defines default scale types for the chart
                    scales: {
                        y: {
                            // linear numeric scale for the y axis
                            type: TimeseriesScaleType.Linear,
                        } as ITimeseriesScaleConfig,
                        x: {
                            // continuous time scale for the x axis
                            type: TimeseriesScaleType.Time,
                        } as ITimeseriesScaleConfig,
                    },
                } as ITimeseriesWidgetConfig,
            },
            providers: {
                // provider for mapping the timeseries data source output to the format required by the widget
                [WellKnownProviders.Adapter]: {
                    providerId: NOVA_TIMESERIES_DATASOURCE_ADAPTER,
                    properties: {
                        componentId: "chart",
                        propertyPath: "widgetData",
                        series: [] as ITimeseriesItemConfiguration[],
                    },
                } as IProviderConfiguration,
            },
        },
    },
    [PizzagnaLayer.Configuration]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            id: DEFAULT_PIZZAGNA_ROOT,
            providers: {
                // default refresher configuration
                [WellKnownProviders.Refresher]: refresher(false, 60),
            },
        },
        // default header configuration
        header: {
            properties: {
                title: $localize`Empty Timeseries Widget`,
            },
        },
    },
};
