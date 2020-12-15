import { ComponentRef, EventEmitter, Output } from "@angular/core";
import noop from "lodash/noop";

import {ContentRef} from "../../services/content-ref";

import {DialogBackdropComponent} from "./dialog-backdrop.component";

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

    @Output() public closed$ = new EventEmitter();

    result: Promise<any>;

    constructor(
        public windowCmptRef?: ComponentRef<any>, private contentRef?: ContentRef,
        private backdropCmptRef?: ComponentRef<DialogBackdropComponent>, private beforeDismiss?: Function) {

        windowCmptRef?.instance.dismissEvent.subscribe((reason: any) => {
            this.dismiss(reason);
        });
        if (windowCmptRef?.instance.closeEvent) {
            windowCmptRef.instance.closeEvent.subscribe((result: any) => { this.close(result); });
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
            this.closed$.emit();
        }
    }

    public dismiss(reason?: any): void {
        if (this.windowCmptRef) {
            if (!this.beforeDismiss || this.beforeDismiss(reason) !== false) {
                this.reject(reason);
                this.removeDialogElements();
                this.closed$.emit();
            }
        }
    }

    private removeDialogElements() {
        const windowNativeEl = this.windowCmptRef?.location.nativeElement;
        windowNativeEl.parentNode.removeChild(windowNativeEl);
        this.windowCmptRef?.destroy();

        if (this.backdropCmptRef) {
            const backdropNativeEl = this.backdropCmptRef.location.nativeElement;
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
/**@ignore*/
export class NuiActiveDialog {
    close(result?: any): void { noop(); }
    dismiss(reason?: any): void { noop(); }
}
