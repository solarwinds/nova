import { StackComponent } from "../../components/layouts/stack/stack.component";
import { ProportionalWidgetComponent } from "../../components/proportional-widget/proportional-widget.component";
import { DEFAULT_PIZZAGNA_ROOT, NOVA_DATASOURCE_ADAPTER } from "../../services/types";
import { PizzagnaLayer, WellKnownProviders } from "../../types";
import { widgetBodyContentNodes, WIDGET_BODY, WIDGET_HEADER, WIDGET_LOADING } from "../common/widget/components";
import { EVENT_PROXY, refresher } from "../common/widget/providers";

export const proportionalWidget = {
    [PizzagnaLayer.Structure]: {
        [DEFAULT_PIZZAGNA_ROOT]: {
            id: DEFAULT_PIZZAGNA_ROOT,
            // base layout of the widget - all components referenced herein will be stacked in a column
            componentType: StackComponent.lateLoadKey,
            properties: {
                // these values reference other components in this structure
                nodes: [
                    "header",
                    "loading",
                    "body",
                ],
            },
            providers: {
                // When enabled, this provider emits the REFRESH event on the pizzagna event bus every X seconds
                [WellKnownProviders.Refresher]: refresher(),
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
        ...widgetBodyContentNodes("chart"),

        // a component that manages layout and behavior of the proportional chart
        chart: {
            id: "chart",
            componentType: ProportionalWidgetComponent.lateLoadKey,
            providers: {
                [WellKnownProviders.Adapter]: {
                    providerId: NOVA_DATASOURCE_ADAPTER,
                    properties: {
                        componentId: "chart",
                        propertyPath: "widgetData",
                    },
                },
            },
            properties: {
                elementClass: "d-flex flex-grow-1 justify-content-center overflow-auto",
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
                title: $localize`Empty Proportional Widget`,
            },
        },
    },
};
