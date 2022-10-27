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
import { TableWidgetComponent } from "../../components/table-widget/table-widget.component";
import { ITableWidgetConfig } from "../../components/table-widget/types";
import {
    DEFAULT_PIZZAGNA_ROOT,
    NOVA_DASHBOARD_EVENT_PROXY,
    NOVA_TABLE_DATASOURCE_ADAPTER,
    NOVA_VIRTUAL_VIEWPORT_MANAGER,
    WIDGET_RESIZE,
} from "../../services/types";
import { IPizzagna, PizzagnaLayer, WellKnownProviders } from "../../types";
import {
    widgetBodyContentNodes,
    WIDGET_BODY,
    WIDGET_HEADER,
    WIDGET_LOADING,
} from "../common/widget/components";
import { refresher } from "../common/widget/providers";

export const tableWidget: IPizzagna = {
    [PizzagnaLayer.Structure]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            id: DEFAULT_PIZZAGNA_ROOT,
            // base layout of the widget - all components referenced herein will be stacked in a column
            componentType: StackComponent.lateLoadKey,
            providers: {
                // When enabled, this provider emits the REFRESH event on the pizzagna event bus every X seconds
                [WellKnownProviders.Refresher]: refresher(),
                [WellKnownProviders.EventProxy]: {
                    // event proxy manages the transmission of events between widget and dashboard
                    providerId: NOVA_DASHBOARD_EVENT_PROXY,
                    properties: {
                        // WIDGET_RESIZE event is used to adjust the virtual scroll viewport size
                        downstreams: [WIDGET_RESIZE.id],
                    },
                },
            },
            properties: {
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
        ...widgetBodyContentNodes("table"),

        // this is the main component showing a table with data
        table: {
            id: "table",
            componentType: TableWidgetComponent.lateLoadKey,
            providers: {
                // adapter invokes the data source and assigns the output to this component
                [WellKnownProviders.Adapter]: {
                    providerId: NOVA_TABLE_DATASOURCE_ADAPTER,
                    properties: {
                        componentId: "table",
                        dataPath: "widgetData",
                        // data-fields are necessary to map incoming data to configured columns
                        dataFieldsPath: "dataFields",
                        totalItemsPath: "totalItems",
                    },
                },
                virtualViewportManager: {
                    providerId: NOVA_VIRTUAL_VIEWPORT_MANAGER,
                },
            },
            properties: {
                elementClass: "flex-grow-1 mx-3 mb-3 mt-2",
                delayedMousePresenceDetectionEnabled: true,
                configuration: {
                    columns: [],
                    // The delay in milliseconds after table mouseenter before scrolling is activated
                    scrollActivationDelayMs: 500,
                    // Whether to display or not table header tooltips
                    headerTooltipsEnabled: true, // default
                } as unknown as ITableWidgetConfig,
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
                title: $localize`Empty Table Widget`,
            },
        },
    },
};
