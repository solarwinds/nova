import { FlexibleConnectedPositionStrategy, OverlayRef } from "@angular/cdk/overlay";
import { Component, OnDestroy, TemplateRef } from "@angular/core";
import { DialogService, NuiDialogRef, OverlayComponent } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "nui-custom-confirmation-inside-dialog",
    templateUrl: "./overlay-custom-confirmation-inside-dialog.component.html",
    styleUrls: ["./overlay-custom-confirmation-inside-dialog.component.less"],
})
export class CustomConfirmationInsideDialogComponent implements OnDestroy {
    public onDestroy$ = new Subject<void>();
    public overlayTriggered$ = new Subject<void>();

    private overlayRef: OverlayRef;
    private activeDialog: NuiDialogRef;

    constructor(private dialogService: DialogService) { }

    triggerOverlay(overlay: OverlayComponent): void {
        this.overlayTriggered$.next();

        // Toggling the overlay to get an access to the 'overlayRef'
        overlay.toggle();

        this.overlayRef = overlay.getOverlayRef();
        // Here we update the positions for the overlay. By default, the overlay service connects the overlay to the bottom-left
        // corner of the toggle reference element. We change this behavior here by setting new positions, since we want overlay to
        // stick to the upper-top corner of the parent container
        (this.overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy).withPositions([{
            originX: "start",
            originY: "top",
            overlayX: "start",
            overlayY: "top",
        }]);
        // We update the size of the overlay container to follow the dimentions of the new 'toggle reference' container we set in the very first step
        this.updateOverlayDimensions(overlay);

        // Handling ESC events inside overlay
        this.activeDialog?.closed$.pipe(
            takeUntil(this.overlayTriggered$),
            takeUntil(this.onDestroy$)).subscribe(() => overlay.hide());
    }

    public open(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, { size: "lg", backdrop: "static", useOverlay: true });
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

    private updateOverlayDimensions(overlay: OverlayComponent): void {
        this.overlayRef?.updateSize({
            width: overlay.toggleReference.getBoundingClientRect().width,
            height: overlay.toggleReference.getBoundingClientRect().height,
        });
    }
}
