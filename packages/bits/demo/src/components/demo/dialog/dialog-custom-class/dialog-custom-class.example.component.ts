import { Component, Inject, TemplateRef } from "@angular/core";
import { DialogService, NuiDialogRef, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-dialog-custom-class-example",
    templateUrl: "./dialog-custom-class.example.component.html",
})
export class DialogCustomClassExampleComponent {
    private activeDialog: NuiDialogRef;

    constructor(
        @Inject(DialogService) private dialogService: DialogService,
        @Inject(ToastService) private toastService: ToastService
    ) {}

    public open(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, {
            windowClass: "demoDialogCustomClass",
        });
    }

    public onButtonClick(title: string) {
        title === "Action" ? this.actionDone() : this.actionCanceled();
        this.activeDialog.close();
    }

    private actionDone(): void {
        this.toastService.success({
            message: $localize`Action Done!`,
            title: $localize`Event`,
        });
    }

    private actionCanceled(): void {
        this.toastService.info({
            message: $localize`Action Cancelled!`,
            title: $localize`Event`,
        });
    }
}
