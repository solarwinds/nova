import { Component, TemplateRef } from "@angular/core";
import { DialogService, NuiDialogRef, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-simple-dialog-example",
    templateUrl: "./simple-dialog.example.component.html",
})
export class SimpleDialogExampleComponent {
    private activeDialog: NuiDialogRef;

    constructor(
        private dialogService: DialogService,
        private toastService: ToastService
    ) {}

    public open(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, { size: "sm" });
    }

    private actionDone(): void {
        this.toastService.success({
            message: $localize`Action Done!`,
            title: $localize`Event`,
        });
        this.activeDialog.close();
    }

    private actionCanceled(): void {
        this.toastService.info({
            message: $localize`Action Cancelled!`,
            title: $localize`Event`,
        });
        this.activeDialog.close();
    }
}
