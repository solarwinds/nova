import {
    Component, Inject, TemplateRef,
} from "@angular/core";
import { Subject } from "rxjs";
import { FlexibleConnectedPositionStrategy, OverlayRef } from "@angular/cdk/overlay";
import {
    DialogService,
    IWizardState,
    NuiDialogRef,
    OverlayComponent,
    WizardHorizontalComponent,
    WizardStepV2Component,
} from "@nova-ui/bits";
import { takeUntil } from "rxjs/operators";

interface IWizardStepData {
    title: string;
    templateRef: TemplateRef<string>;
}

@Component({
    selector: "nui-wizard-test",
    templateUrl: "./wizard-test.component.html",
    styleUrls: ["./wizard-test.less"],
})
export class WizardTestComponent {
    public onDestroy$ = new Subject<void>();
    public overlayTriggered$ = new Subject<void>();

    private overlayRef: OverlayRef;
    public busy: boolean = false;
    public activeDialog: NuiDialogRef;

    constructor(@Inject(DialogService) private dialogService: DialogService) {}

    public vegetables = [$localize `Cabbage`, $localize `Potato`, $localize `Tomato`, $localize `Carrot`];
    public selectedVegetables = [$localize `Potato`, $localize `Tomato`];
    public state: IWizardState;
    public steps: IWizardStepData[] = [];

    public isChecked(vegetable: string): boolean {
        return this.selectedVegetables.indexOf(vegetable) > -1;
    }

    public valuesChanged(values: any[]): void {
        this.selectedVegetables = [...values];
    }

    public openDialog(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, {
            size: "lg",
            windowClass: "active-dialog",
        });
    }

    public closeDialog(): void {
        this.activeDialog.close();
    }

    public toggleBusy(): void {
        this.busy = !this.busy;
        setTimeout(() => {
            this.busy = false;
        }, 3000);
    }


    public openConfirmationOverlay(overlay: OverlayComponent, wizard: WizardHorizontalComponent): void {
        if (wizard.selectedIndex === 0) {
            this.closeDialog();
            return;
        }

        this.overlayTriggered$.next();
        overlay.toggle();

        this.overlayRef = overlay.getOverlayRef();
        (this.overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy).withPositions([{
            originX: "start",
            originY: "top",
            overlayX: "start",
            overlayY: "top",
        }]);
        this.updateOverlayDimensions(overlay);
        this.activeDialog?.closed$.pipe(
            takeUntil(this.overlayTriggered$),
            takeUntil(this.onDestroy$)).subscribe(() => overlay.hide());
    }

    public open(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, {size: "lg", backdrop: "static", useOverlay: true});
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

    public saveState(state: IWizardState): void {
        this.state = state;
    }

    public completeWizard(step: WizardStepV2Component): void {
        step.completed = true;
        this.activeDialog.close();
    }

    public addStep(templateRef: TemplateRef<string>, title?: string): void {
        this.steps.push({ title: title ?? `Dynamic Step ${this.steps.length + 1}`, templateRef: templateRef });
    }

    private updateOverlayDimensions(overlay: OverlayComponent): void {
        this.overlayRef?.updateSize({
            width: overlay.toggleReference.getBoundingClientRect().width,
            height: overlay.toggleReference.getBoundingClientRect().height,
        });
    }
}
