import { Component, Inject, TemplateRef } from "@angular/core";

import { DialogService, NuiDialogRef, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-wizard-confirmation-dialog-example",
    templateUrl: "./wizard-confirmation-dialog.example.component.html",
})
export class WizardConfirmationDialogExampleComponent {
    public activeDialog: NuiDialogRef;

    constructor(
        @Inject(DialogService) private dialogService: DialogService,
        @Inject(ToastService) private toastService: ToastService
    ) {}

    public openConfirmationDialog(
        $event: boolean,
        content: TemplateRef<string>
    ) {
        if ($event) {
            this.activeDialog = this.dialogService.open(content, {
                size: "sm",
            });
        } else {
            this.toastService.info({
                message: $localize`Cancel button clicked!`,
                title: $localize`Event`,
            });
        }
    }

    public onButtonClick(title: string) {
        title === "Leave" ? this.actionDone() : this.actionCanceled();
        this.activeDialog.close();
    }

    private actionDone(): void {
        this.toastService.success({
            message: $localize`Leave Done!`,
            title: $localize`Event`,
        });
    }

    private actionCanceled(): void {
        this.toastService.info({
            message: $localize`Action Canceled!`,
            title: $localize`Event`,
        });
    }
}
