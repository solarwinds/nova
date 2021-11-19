import { Component, Inject, TemplateRef } from "@angular/core";
import { DialogService, NuiDialogRef, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-dialog-position-example",
    templateUrl: "./dialog-position.example.component.html",
})
export class DialogPositionExampleComponent {
    public isResponsiveMode = false;
    private activeDialog: NuiDialogRef;

    constructor(
        @Inject(DialogService) private dialogService: DialogService,
        @Inject(ToastService) private toastService: ToastService
    ) { }

    public open(content: TemplateRef<string>, options: any): void {
        this.isResponsiveMode = options.isResponsiveMode;
        this.activeDialog = this.dialogService.open(content);
    }

    public onButtonClick(title: string): void {
        title === "Action" ? this.actionDone() : this.actionCanceled();
        this.activeDialog.close();
    }

    private actionDone(): void {
        this.toastService.success({ message: $localize`Action Done!`, title: $localize`Event` });
    }

    private actionCanceled(): void {
        this.toastService.info({ message: $localize`Action Cancelled!`, title: $localize`Event` });
    }
}
