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

import { ComponentRef, EventEmitter } from "@angular/core";
import noop from "lodash/noop";

import { ContentRef } from "../../services/content-ref";
import { DialogBackdropComponent } from "./dialog-backdrop.component";

/**
 * @ignore
 */
export class NuiDialogRef {
    private resolve: (result?: any) => void;
    private reject: (reason?: any) => void;

    get componentInstance(): any {
        if (this.contentRef && this.contentRef.componentRef) {
            return this.contentRef.componentRef.instance;
        }
    }

    public closed$ = new EventEmitter();
    public beforeDismissed$ = new EventEmitter();

    result: Promise<any>;

    constructor(
        public windowCmptRef?: ComponentRef<any>,
        private contentRef?: ContentRef,
        private backdropCmptRef?: ComponentRef<DialogBackdropComponent>,
        private beforeDismiss?: Function
    ) {
        windowCmptRef?.instance.dismissEvent.subscribe((reason: any) => {
            this.dismiss(reason);
        });
        if (windowCmptRef?.instance.closeEvent) {
            windowCmptRef.instance.closeEvent.subscribe((result: any) => {
                this.close(result);
            });
        }

        this.result = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.result.then(null, noop);
    }

    public close(result?: any): void {
        if (this.windowCmptRef) {
            this.resolve(result);
            this.removeDialogElements();
            this.closed$.emit(result);
        }
    }

    public dismiss(reason?: any): void {
        if (this.windowCmptRef) {
            this.beforeDismissed$.emit(reason);
            if (!this.beforeDismiss || this.beforeDismiss(reason) !== false) {
                this.reject(reason);
                this.removeDialogElements();
                this.closed$.emit(reason);
            }
        }
    }

    private removeDialogElements() {
        const windowNativeEl = this.windowCmptRef?.location.nativeElement;
        windowNativeEl.parentNode.removeChild(windowNativeEl);
        this.windowCmptRef?.destroy();

        if (this.backdropCmptRef) {
            const backdropNativeEl =
                this.backdropCmptRef.location.nativeElement;
            backdropNativeEl.parentNode.removeChild(backdropNativeEl);
            this.backdropCmptRef.destroy();
        }

        if (this.contentRef && this.contentRef.viewRef) {
            this.contentRef.viewRef.destroy();
        }

        this.windowCmptRef = undefined;
        this.backdropCmptRef = undefined;
        this.contentRef = undefined;
    }
}
/** @ignore */
export class NuiActiveDialog {
    close(result?: any): void {
        noop();
    }
    dismiss(reason?: any): void {
        noop();
    }
}
