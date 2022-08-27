import { Component, Inject, TemplateRef } from "@angular/core";

import { DialogService, NuiDialogRef, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-dialog-with-static-backdrop-example",
    templateUrl: "./dialog-with-static-backdrop.example.component.html",
})
export class DialogWithStaticBackdropExampleComponent {
    private activeDialog: NuiDialogRef;

    constructor(
        @Inject(DialogService) private dialogService: DialogService,
        @Inject(ToastService) private toastService: ToastService
    ) {}

    public openWith(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, {
            size: "sm",
            backdrop: "static",
        });
    }
    public openWithout(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, {
            size: "sm",
            keyboard: false,
            backdrop: "static",
        });
    }

    public actionDone(): void {
        this.toastService.success({
            message: $localize`Action Done!`,
            title: $localize`Event`,
        });
        this.activeDialog.close();
    }

    public actionCanceled(): void {
        this.toastService.info({
            message: $localize`Action Cancelled!`,
            title: $localize`Event`,
        });
        this.activeDialog.close();
    }
}
