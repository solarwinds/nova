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

import { ITimeseriesItemConfiguration } from "@nova-ui/dashboards";

import { CartesianWidgetComponent } from "../../components/cartesian-widget/cartesian-widget.component";
import {
    CartesianChartPreset,
    CartesianScaleConfig,
    CartesianScaleType,
    CartesianWidgetConfig,
} from "../../components/cartesian-widget/types";
import { StackComponent } from "../../components/layouts/stack/stack.component";
import {
    DEFAULT_PIZZAGNA_ROOT,
    NOVA_TIMESERIES_DATASOURCE_ADAPTER,
} from "../../services/types";
import { PizzagnaLayer, WellKnownProviders } from "../../types";
import {
    WIDGET_BODY,
    WIDGET_HEADER,
    WIDGET_LOADING,
    widgetBodyContentNodes,
} from "../common/widget/components";
import { EVENT_PROXY, refresher } from "../common/widget/providers";

export const cartesianWidget = {
    [PizzagnaLayer.Structure]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            id: DEFAULT_PIZZAGNA_ROOT, // base layout of the widget - all components referenced here will be stacked in a column
            componentType: StackComponent.lateLoadKey,
            properties: {
                // these values reference other components in this structure
                nodes: ["header", "loading", "body"],
            },
            providers: {
                // When enabled, this provider emits the REFRESH event on the pizzagna event bus every X seconds
                [WellKnownProviders.Refresher]: refresher(), // event proxy manages the transmission of events between widget and dashboard
                [WellKnownProviders.EventProxy]: EVENT_PROXY,
            },
        }, // widget header
        header: WIDGET_HEADER, // this is the loading bar below the header
        loading: WIDGET_LOADING, // widget body
        body: {
            ...WIDGET_BODY,
            properties: {
                ...WIDGET_BODY.properties,
                elementClass: "overflow-auto",
            },
        },

        // retrieving the definitions for the body content nodes. the argument corresponds to the main content node key
        ...widgetBodyContentNodes("chart"),

        // a component that manages layout and behavior of the proportional chart
        chart: {
            id: "chart",
            componentType: CartesianWidgetComponent.lateLoadKey,
            properties: {
                elementClass:
                    "d-flex flex-grow-1 justify-content-center align-items-center overflow-auto",
                configuration: {
                    preset: CartesianChartPreset.Line,
                    // this scales configuration defines default scale types for the chart
                    scales: {
                        y: {
                            // linear numeric scale for the y axis
                            type: CartesianScaleType.Linear,
                        } as CartesianScaleConfig,
                        x: {
                            // continuous time scale for the x axis
                            type: CartesianScaleType.Time,
                        } as CartesianScaleConfig,
                    },
                } as CartesianWidgetConfig,
            },
            providers: {
                [WellKnownProviders.Adapter]: {
                    providerId: NOVA_TIMESERIES_DATASOURCE_ADAPTER,
                    properties: {
                        componentId: "chart",
                        propertyPath: "widgetData",
                        series: [] as ITimeseriesItemConfiguration[],
                    },
                },
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
        }, // default header configuration
        header: {
            properties: {
                title: $localize`Empty Cartesian Widget`,
            },
        },
    },
};