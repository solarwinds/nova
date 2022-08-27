import { Component, Inject, TemplateRef } from "@angular/core";

import { DialogService, NuiDialogRef, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-dialog-with-keyboard-example",
    templateUrl: "./dialog-with-keyboard.example.component.html",
})
export class DialogWithKeyboardExampleComponent {
    private activeDialog: NuiDialogRef;

    constructor(
        @Inject(DialogService) private dialogService: DialogService,
        @Inject(ToastService) private toastService: ToastService
    ) {}

    public openWith(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, { size: "sm" });
    }
    public openWithout(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, {
            size: "sm",
            keyboard: false,
        });
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
