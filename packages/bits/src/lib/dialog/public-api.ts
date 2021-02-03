import {Injector} from "@angular/core";

export type SeverityLevels = "critical" | "warning" | "info";
export type ConfirmationDialogButtons = "confirm" | "dismiss";

export enum NuiDialogEvent {
    EscapeKey = "ESC",
    BackdropClick = "BACKDROP_CLICK",
}

export interface IDialogOptions {
    /**
     * Whether a backdrop element should be created for a given modal (true by default).
     * Alternatively, specify 'static' for a backdrop, which doesn't close the modal on click.
     */
    backdrop?: boolean | "static";

    /**
     * Function called when a modal will be dismissed.
     * If this function returns false, the modal is not dismissed.
     */
    beforeDismiss?: (reason?: string) => boolean;

    /**
     * An element to which to attach newly opened modal windows.
     */
    container?: string;

    /**
     * Injector to use for modal content.
     */
    injector?: Injector;

    /**
     * Whether to close the modal when escape key is pressed (true by default).
     */
    keyboard?: boolean;

    /**
     * Size of a new modal window. The "md" size is used by default, so there is no need to specify it explicitly
     */
    size?: "sm" | "lg";

    /**
     * Custom class to append to the modal window.
     */
    windowClass?: string;

    /**
     * Temporary solution to display the dialog inside the cdk overlay container
     */
    useOverlay?: boolean;
}

export interface IConfirmationDialogOptions extends IDialogOptions {
    /**
     * Title of the confirmation dialog
     */
    title?: string;

    /**
     * Confirmation message
     */
    message: string;

    /**
     * Confirmation button text
     */
    confirmText?: string;

    /**
     * Dismiss button text
     */
    dismissText?: string;
    /**
     * Pass severity into confirmation dialog's header
     */
    severity?: SeverityLevels;

    /**
     * Choose which confirmation dialog button to focus by default.
     */
    setFocus?: ConfirmationDialogButtons;
}
