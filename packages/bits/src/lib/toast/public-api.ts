import { ComponentRef } from "@angular/core";
import { Observable } from "rxjs";

export interface IToastService {
    setConfig(config: IToastConfig, itemIdentificator?: string): void;
    error(toastDeclaration: IToastDeclaration): IActiveToast;
    info(toastDeclaration: IToastDeclaration): IActiveToast;
    success(toastDeclaration: IToastDeclaration): IActiveToast;
    warning(toastDeclaration: IToastDeclaration): IActiveToast;
    clear(toastId?: number): void;
    remove(toastId: number): boolean;
}

export const enum ToastPositionClass {
    TOP_CENTER = "nui-toast--top-center",
    TOP_LEFT = "nui-toast--top-left",
    TOP_RIGHT = "nui-toast--top-right",
    TOP_FULL_WIDTH = "nui-toast--top-full-width",
    BOTTOM_CENTER = "nui-toast--bottom-center",
    BOTTOM_FULL_WIDTH = "nui-toast--bottom-full-width",
    BOTTOM_RIGHT = "nui-toast--bottom-right",
    BOTTOM_LEFT = "nui-toast--bottom-left",
}
export interface IToastDeclaration {
    title?: string;
    message?: string;
    options?: IToastConfig;
    itemsToHighlight?: any[];
}
/**
 * __Description:__ Represents configuration set for toasts
 */
export interface IToastConfig {
    /**
     * toast time to live in milliseconds,
     * default: 5000
     */
    timeOut?: number;
    /**
     * show toast close button,
     * default: true
     */
    closeButton?: boolean;
    /**
     * toast time to live in milliseconds, after user hovers and removes cursor from toast,
     * default: 2000
     */
    extendedTimeOut?: number;
    /**
     * show toast progress bar,
     * default: true
     */
    progressBar?: boolean;
    /**
     * changes toast progress bar animation,
     * default: decreasing
     */
    progressAnimation?: "increasing" | "decreasing";
    /**
     * render html in toast message (possibly unsafe),
     * default: false
     */
    enableHtml?: boolean;
    /**
     * css class for toast component,
     * default: "nui-toast"
     */
    toastClass?: string;
    /**
     * css class to set position for toast container,
     * default: "toast-top-right"
     */
    positionClass?: ToastPositionClass | string;
    /**
     * clicking on toast dismisses it,
     * default: true
     */
    clickToDismiss?: boolean;
    /**
     * prevents error message from close,
     * default: false
     */
    stickyError?: boolean;
    /**
     * maximum number of opened toasts, toasts will be queued,
     * zero is unlimited,
     * default: 0
     */
    maxOpened?: number;
    /**
     * dismiss current toast when maximum number is reached,
     * default: false
     */
    autoDismiss?: boolean;
    /**
     * new toast is placed on the top of the toasts stack,
     * default: true
     */
    newestOnTop?: boolean;
    /**
     * prevent duplicating messages,
     * default: false
     */
    preventDuplicates?: boolean;
}

export interface IToastRef<T> {
    /** The instance of component opened into the toast. */
    componentInstance: T;
    manualClose(): void;
    manualClosed(): Observable<any>;
    close(): void;
    afterClosed(): Observable<any>;
    isInactive(): boolean;
    activate(): void;
    afterActivate(): Observable<any>;
}

export interface IActiveToast {
    toastId?: number;
    body?: string;
    toastContainer?: ComponentRef<any>;
    toastRef: IToastRef<any>;
    onShown?: Observable<any>;
    onHidden?: Observable<any>;
    onClick?: Observable<any>;
}
