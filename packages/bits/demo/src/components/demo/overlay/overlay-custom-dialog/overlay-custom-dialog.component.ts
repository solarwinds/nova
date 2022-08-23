import {
    FlexibleConnectedPositionStrategy,
    OverlayRef,
} from "@angular/cdk/overlay";
import { Component, ViewChild, ViewEncapsulation } from "@angular/core";

import { DialogService, NuiDialogRef, OverlayComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-overlay-custom-dialog",
    templateUrl: "./overlay-custom-dialog.component.html",
    styleUrls: ["./overlay-custom-dialog.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class OverlayCustomDialogComponent {
    private overlayRef: OverlayRef;
    private activeDialog: NuiDialogRef;

    @ViewChild("overlay1") overlay1: OverlayComponent;
    @ViewChild("overlay2") overlay2: OverlayComponent;

    constructor(private dialogService: DialogService) {}

    triggerOverlay(ref: HTMLElement, overlay: OverlayComponent) {
        // Here we set the new element reference to the overlay conponent. The overlay will now connect to it
        overlay.toggleReference = ref;
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
        this.overlayRef.updateSize({
            width: ref.getBoundingClientRect().width,
            height: ref.getBoundingClientRect().height,
        });
    }
}
