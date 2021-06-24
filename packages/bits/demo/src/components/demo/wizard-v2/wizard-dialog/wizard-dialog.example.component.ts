import {Component, Inject, OnDestroy, TemplateRef, ViewChild} from "@angular/core";
import {
    DialogService,
    NuiDialogRef,
    OverlayComponent,
    ToastService,
    WizardComponent,
    WizardHorizontalComponent
} from "@nova-ui/bits";
import {FlexibleConnectedPositionStrategy, OverlayRef} from "@angular/cdk/overlay";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
    selector: "nui-wizard-v2-dialog-example",
    templateUrl: "./wizard-dialog.example.component.html",
    styleUrls: ["./wizard-dialog.example.component.less"],
})
export class WizardDialogExampleComponent implements OnDestroy{
    public onDestroy$ = new Subject<void>();
    public overlayTriggered$ = new Subject<void>();

    private overlayRef: OverlayRef;
    public busy: boolean = false;
    public activeDialog: NuiDialogRef;

    constructor(
        @Inject(DialogService) private dialogService: DialogService,
        @Inject(ToastService) private toastService: ToastService
    ) {}

    public vegetables = [$localize `Cabbage`, $localize `Potato`, $localize `Tomato`, $localize `Carrot`];
    public selectedVegetables = [$localize `Potato`, $localize `Tomato`];

    public isChecked(vegetable: string): boolean {
        return this.selectedVegetables.indexOf(vegetable) > -1;
    }

    public valuesChanged(values: any[]) {
        this.selectedVegetables = [...values];
    }

    public openDialog(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, {
            size: "lg",
            windowClass: "active-dialog",
        });
    }

    public closeDialog() {
        this.activeDialog.close();
    }

    public toggleBusy() {
        this.busy = !this.busy;
        setTimeout(() => {
            this.busy = false;
        }, 3000);
    }

    // Open confirmation overlay
    public openConfirmationOverlay(overlay: OverlayComponent, wizard: WizardHorizontalComponent ) {
        if (wizard.selectedIndex === 0) {
            this.closeDialog();
            return;
        }

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
        // We update the size of the overlay container to follow the dimensions of the new 'toggle reference' container we set in the very first step
        this.updateOverlayDimensions(overlay);

        // Handling ESC events inside overlay
        this.activeDialog?.closed$.pipe(
            takeUntil(this.overlayTriggered$),
            takeUntil(this.onDestroy$)).subscribe(() => overlay.hide());
    }

    public open(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, {size: "lg", backdrop: "static", useOverlay: true});
    }

    public actionDone(): void {
        this.activeDialog.close();
    }

    public onContainerResize(overlay: OverlayComponent) {
        this.updateOverlayDimensions(overlay);
    }

    public ngOnDestroy() {
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
