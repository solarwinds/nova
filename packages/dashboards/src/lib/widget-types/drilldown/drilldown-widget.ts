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
import { ListNavigationBarComponent } from "../../components/list-widget/list-elements/list-navigation-bar/list-navigation-bar.component";
import { ListWidgetComponent } from "../../components/list-widget/list-widget.component";
import { WidgetSearchComponent } from "../../components/widget-search/widget-search.component";
import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { IPizzagna, PizzagnaLayer, WellKnownProviders } from "../../types";
import {
    widgetBodyContentNodes,
    WIDGET_BODY,
    WIDGET_HEADER,
    WIDGET_LOADING,
} from "../common/widget/components";
import { EVENT_PROXY } from "../common/widget/providers";

export const drilldownWidget: IPizzagna = {
    [PizzagnaLayer.Structure]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            id: DEFAULT_PIZZAGNA_ROOT,
            // base layout of the widget - all components referenced herein will be stacked in a column
            componentType: StackComponent.lateLoadKey,
            properties: {
                // these values reference other components in this structure
                nodes: ["header", "loading", "search", "body"],
            },
            providers: {
                // event proxy manages the transmission of events between widget and dashboard
                [WellKnownProviders.EventProxy]: EVENT_PROXY,
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
        ...widgetBodyContentNodes("listWidget"),
        search: {
            id: "search",
            componentType: WidgetSearchComponent.lateLoadKey,
        },
        ...widgetBodyContentNodes("mainContent"),
        mainContent: {
            id: "mainContent",
            componentType: StackComponent.lateLoadKey,
            properties: {
                // these values reference other components in this configuration
                nodes: ["navigationBar", "listWidget"],
            },
        },
        navigationBar: {
            id: "navigationBar",
            componentType: ListNavigationBarComponent.lateLoadKey,
        },
        listWidget: {
            id: "listWidget",
            componentType: ListWidgetComponent.lateLoadKey,
            providers: {},
            properties: {
                elementClass: "w-100 p-3",
            },
        },
    },
    [PizzagnaLayer.Configuration]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            id: DEFAULT_PIZZAGNA_ROOT,
        },
        // default header configuration
        header: {
            properties: {
                title: $localize`Empty Custom Widget`,
            },
        },
    },
};
