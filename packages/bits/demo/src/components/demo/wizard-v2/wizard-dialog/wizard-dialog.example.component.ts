import { Component, Inject, TemplateRef, ViewChild } from "@angular/core";
import { DialogService, NuiDialogRef, ToastService, WizardComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-v2-dialog-example",
    templateUrl: "./wizard-dialog.example.component.html",
})
export class WizardDialogExampleComponent {
    @ViewChild("wizardComponent") wizardComponent: WizardComponent;

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
}
