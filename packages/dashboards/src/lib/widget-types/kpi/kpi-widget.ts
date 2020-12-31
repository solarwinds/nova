import { KpiComponent } from "../../components/kpi-widget/kpi.component";
import { StackComponent } from "../../components/layouts/stack/stack.component";
import { TilesComponent } from "../../components/layouts/tiles/tiles.component";
import { IKpiColorRules } from "../../components/providers/types";
import {
    DEFAULT_PIZZAGNA_ROOT,
    NOVA_KPI_COLOR_PRIORITIZER,
    NOVA_KPI_DATASOURCE_ADAPTER,
    NOVA_KPI_SCALE_SYNC_BROKER,
    NOVA_KPI_STATUS_CONTENT_FALLBACK_ADAPTER
} from "../../services/types";
import { IProviderConfiguration, PizzagnaLayer, WellKnownProviders } from "../../types";
import { WIDGET_BODY, WIDGET_HEADER, WIDGET_LOADING, widgetBodyContentNodes } from "../common/widget/components";
import { EVENT_PROXY, refresher } from "../common/widget/providers";

export const kpiWidget = {
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
        body: {
            ...WIDGET_BODY,
            properties: {
                ...WIDGET_BODY.properties,
                elementClass: "overflow-hidden",
            },
        },

        /**
         * Retrieving definitions for the body content nodes
         * ---
         * The first argument corresponds to the main content node key.
         * The second argument is the id of the adapter responsible for activating fallback content in case of an error.
         */
        ...widgetBodyContentNodes("tiles", NOVA_KPI_STATUS_CONTENT_FALLBACK_ADAPTER),

        // the main content node specifying a component that manages layout of the KPI tiles in a CSS grid
        tiles: {
            id: "tiles",
            componentType: TilesComponent.lateLoadKey,
            properties: {
                elementClass: "flex-grow-1 pt-2 px-3 pb-3 w-100",
                template: {
                    componentType: KpiComponent.lateLoadKey,
                    "providers": {
                        [WellKnownProviders.KpiColorPrioritizer]: {
                            "providerId": NOVA_KPI_COLOR_PRIORITIZER,
                            "properties": {
                            },
                        } as IProviderConfiguration,
                        [WellKnownProviders.Adapter]: {
                            "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                            "properties": {
                                "propertyPath": "widgetData",
                            },
                        } as IProviderConfiguration,
                    },
                    "properties": {
                        "elementClass": "flex-grow-1",
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
        },
        // default header configuration
        header: {
            properties: {
                title: $localize`Empty KPI Widget`,
            },
        },
    },
};
