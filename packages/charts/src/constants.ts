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
export const AXES_STYLE_CHANGE_EVENT = "axes_style_change";

/** @ignore */
export const CHART_COMPONENT = new InjectionToken<IChartComponent>(
    "chart_component"
);

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
    [RenderLayerName.unclippedData]: {
        name: RenderLayerName.unclippedData,
        // order is one greater than the data layer to ensure the unclipped data layer appears just after the data layer in the DOM
        order: 51,
        clipped: false,
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
