import { StackComponent } from "../../components/layouts/stack/stack.component";
import { ListNavigationBarComponent } from "../../components/list-widget/list-elements/list-navigation-bar/list-navigation-bar.component";
import { ListWidgetComponent } from "../../components/list-widget/list-widget.component";
import { DEFAULT_PIZZAGNA_ROOT } from "../../services/types";
import { IPizzagna, PizzagnaLayer } from "../../types";
import { WIDGET_BODY, WIDGET_HEADER, WIDGET_LOADING, widgetBodyContentNodes } from "../common/widget/components";

export const drilldownWidget: IPizzagna = {
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
                    "navigationBar",
                    "body",
                ],
            },
            providers: {
                // // When enabled, this provider emits the REFRESH event on the pizzagna event bus every X seconds
                // [WellKnownProviders.Refresher]: refresher(),
                // // event proxy manages the transmission of events between widget and dashboard
                // [WellKnownProviders.EventProxy]: EVENT_PROXY,
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
        navigationBar: {
            id: "navigationBar",
            componentType: ListNavigationBarComponent.lateLoadKey,
        },
        listWidget: {
            id: "listWidget",
            componentType: ListWidgetComponent.lateLoadKey,
            providers: { },
            properties: {
                elementClass: "w-100 p-3",
            },
        },

    },

};
