import { Component, Inject, TemplateRef } from "@angular/core";
import { DialogService, NuiDialogRef, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-dialog-severity-example",
    templateUrl: "./dialog-severity.example.component.html",
})
export class DialogSeverityExampleComponent {
    public severity: string;
    private activeDialog: NuiDialogRef;

    constructor(@Inject(DialogService) private dialogService: DialogService,
                @Inject(ToastService) private toastService: ToastService) {
    }

    public open(content: TemplateRef<string>, severity = "") {
        this.severity = severity;
        this.activeDialog = this.dialogService.open(content, {size: "sm"});
    }

    public onButtonClick(title: string) {
        title === "Action" ? this.actionDone() : this.actionCanceled();
        this.activeDialog.close();
    }

    private actionDone(): void {
        this.toastService.success({message: $localize `Action Done!`, title: $localize `Event`});
    }

    private actionCanceled(): void {
        this.toastService.info({message: $localize `Action Cancelled!`, title: $localize `Event`});
    }
}
