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

import {
    FlexibleConnectedPositionStrategy,
    OverlayRef,
} from "@angular/cdk/overlay";
import { Component, OnDestroy, TemplateRef } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { DialogService, NuiDialogRef, OverlayComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-custom-confirmation-inside-dialog",
    templateUrl: "./overlay-custom-confirmation-inside-dialog.component.html",
    styleUrls: ["./overlay-custom-confirmation-inside-dialog.component.less"],
    standalone: false,
})
export class CustomConfirmationInsideDialogComponent implements OnDestroy {
    public onDestroy$ = new Subject<void>();
    public overlayTriggered$ = new Subject<void>();

    private overlayRef: OverlayRef;
    private activeDialog: NuiDialogRef;

    constructor(private dialogService: DialogService) {}

    triggerOverlay(overlay: OverlayComponent): void {
        this.overlayTriggered$.next();

        // Toggling the overlay to get an access to the 'overlayRef'
        overlay.toggle();

        this.overlayRef = overlay.getOverlayRef();
        // Here we update the positions for the overlay. By default, the overlay service connects the overlay to the bottom-left
        // corner of the toggle reference element. We change this behavior here by setting new positions, since we want overlay to
        // stick to the upper-top corner of the parent container
        (
            this.overlayRef.getConfig()
                .positionStrategy as FlexibleConnectedPositionStrategy
        ).withPositions([
            {
                originX: "start",
                originY: "top",
                overlayX: "start",
                overlayY: "top",
            },
        ]);
        // We update the size of the overlay container to follow the dimentions of the new 'toggle reference' container we set in the very first step
        this.updateOverlayDimensions(overlay);

        // Handling ESC events inside overlay
        this.activeDialog?.closed$
            .pipe(takeUntil(this.overlayTriggered$), takeUntil(this.onDestroy$))
            .subscribe(() => overlay.hide());
    }

    public open(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, {
            size: "lg",
            backdrop: "static",
            useOverlay: true,
        });
    }

    public actionDone(): void {
        this.activeDialog.close();
    }

    public onContainerResize(overlay: OverlayComponent): void {
        this.updateOverlayDimensions(overlay);
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.overlayTriggered$.complete();
    }

    private updateOverlayDimensions(overlay: OverlayComponent) {
        this.overlayRef?.updateSize({
            width: overlay.toggleReference.getBoundingClientRect().width,
            height: overlay.toggleReference.getBoundingClientRect().height,
        });
    }
}
