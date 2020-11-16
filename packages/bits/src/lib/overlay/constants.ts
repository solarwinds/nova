import { InjectionToken } from "@angular/core";

import { IOption } from "./types";
import { OverlayContainerType } from "./types";

export const OVERLAY_ITEM = new InjectionToken<IOption>("OVERLAY_ITEM");
export const OVERLAY_CONTAINER = new InjectionToken<OverlayContainerType>("OVERLAY_CONTAINER");
export const OVERLAY_WITH_POPUP_STYLES_CLASS = "with-popup-styles";
export const OVERLAY_ARROW_SIZE = 12.72;
