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

import { Injector } from "@angular/core";

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
