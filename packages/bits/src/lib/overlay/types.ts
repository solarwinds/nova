import { Highlightable } from "@angular/cdk/a11y";
import { ScrollStrategy } from "@angular/cdk/overlay";
import { ElementRef } from "@angular/core";

/** CSS class for the shared container that all overlays will be attached to */
export const OVERLAY_CONTAINER_CLASS = "nui-overlay-container";

/** CSS class that will be attached to the overlay panel. */
export const OVERLAY_PANEL_CLASS = "nui-overlay-panel";

export const OVERLAY_DEFAULT_PRIORITY = 10;

export type ScrollStrategyAccessor = () => ScrollStrategy;

export enum OverlayPlacement {
    Left = "left",
    Right = "right",
    Top = "top",
    Bottom = "bottom",
    Custom = "custom",
}

export enum OverlayPosition {
    topLeft = "top-left",
    topRight = "top-right",
    bottomLeft = "bottom-left",
    bottomRight = "bottom-right",
    centerLeft = "center-left",
    centerRight = "center-right",
    centerTop = "center-top",
    centerBottom = "center-bottom",
    leftTop = "left-top",
    leftBottom = "left-bottom",
    rightTop = "right-top",
    rightBottom = "right-bottom",
}

export type OverlayContainerType = ElementRef<HTMLElement> | string;

export interface IOverlayComponent {
    showing: boolean;
    toggle: () => void;
}

export interface IOptionValueObject {
    /** Please use "id" if you want to distinguish same options in different Group Sections */
    id?: string;
    [key: string]: any;
}

export type OptionValueType = IOptionValueObject | string;

export interface IOption extends Highlightable {
    scrollIntoView: (options?: ScrollIntoViewOptions) => void;
    element: ElementRef<HTMLElement>;
    outfiltered?: boolean;
    isDisabled?: boolean;
}

export interface IOverlayPositionServiceConfig {
    arrowSize?: number;
    arrowPadding?: number;
}

export interface IResizeConfig {
    updateSize?: boolean;
}
