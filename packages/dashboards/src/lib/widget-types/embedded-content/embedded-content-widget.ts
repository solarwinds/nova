
import { EmbeddedContentComponent } from "../../components/embedded-content/embedded-content.component";
import { StackComponent } from "../../components/layouts/stack/stack.component";
import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { PizzagnaLayer, WellKnownProviders } from "../../types";
import { widgetBodyContentNodes, WIDGET_BODY, WIDGET_HEADER, WIDGET_LOADING } from "../common/widget/components";
import { EVENT_PROXY, refresher } from "../common/widget/providers";

export const embeddedContentWidget = {
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
                nodes: [
                    "header",
                    "loading",
                    "body",
                ],
            },
        },
        // widget header
        header: WIDGET_HEADER,
        // this is the loading bar below the header
        loading: WIDGET_LOADING,
        // widget body
        body: WIDGET_BODY,

        /**
         * Retrieving definitions for the body content nodes
         * ---
         * The first argument corresponds to the main content node key.
         * The second argument is the id of the adapter responsible for activating fallback content in case of an error.
         */
        ...widgetBodyContentNodes("mainContent"),

        // the main content node specifying a component that manages layout of the KPI tiles in a CSS grid
        mainContent: {
            id: "mainContent",
            componentType: EmbeddedContentComponent.lateLoadKey,
            properties: {
                elementClass: "d-flex w-100 justify-content-center",
            },
        },
    },
    [PizzagnaLayer.Configuration]: {
        // default header configuration
        header: {
            properties: {
                title: $localize`Empty Embedded Content Widget`,
            },
        },
    },
};
