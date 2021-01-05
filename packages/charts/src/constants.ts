import { InjectionToken } from "@angular/core";

import { IChartComponent, ILasagnaLayer } from "./core/common/types";
import { RenderLayerName } from "./renderers/types";

export const MOUSE_ACTIVE_EVENT = "mouse_active";
export const INTERACTION_VALUES_ACTIVE_EVENT = "interaction_values_active";
export const INTERACTION_VALUES_EVENT = "interaction_values";
export const INTERACTION_COORDINATES_EVENT = "interaction_coordinates";
export const HIGHLIGHT_DATA_POINT_EVENT = "highlight_data_point";
export const SELECT_DATA_POINT_EVENT = "select_data_point";
export const HIGHLIGHT_SERIES_EVENT = "highlight_series";
export const INTERACTION_SERIES_EVENT = "interaction_series";
export const INTERACTION_DATA_POINTS_EVENT = "interaction_data_points";
export const INTERACTION_DATA_POINT_EVENT = "interaction_data_point";
export const DESTROY_EVENT = "destroy";
export const SET_DOMAIN_EVENT = "set_domain";
export const REFRESH_EVENT = "refresh";
export const CHART_VIEW_STATUS_EVENT = "chart_view_status";
export const SERIES_STATE_CHANGE_EVENT = "series_state_change";

/** @ignore */
export const CHART_COMPONENT = new InjectionToken<IChartComponent>("chart_component");

/** @ignore */
export const STANDARD_RENDER_LAYERS: { [name: string]: ILasagnaLayer } = {
    [RenderLayerName.background]: {
        name: RenderLayerName.background,
        order: 0,
        clipped: true,
    },
    [RenderLayerName.data]: {
        name: RenderLayerName.data,
        order: 50,
        clipped: true,
    },
    [RenderLayerName.foreground]: {
        name: RenderLayerName.foreground,
        order: 1000,
        clipped: false,
    },
};

/** @ignore */
export const DATA_POINT_NOT_FOUND = -1;

/** @ignore */
export const DATA_POINT_INTERACTION_RESET = -2;

/** Use this class to prevent DOM elements from triggering mouse-interactive-area events */
export const IGNORE_INTERACTION_CLASS = "ignore-interaction";
