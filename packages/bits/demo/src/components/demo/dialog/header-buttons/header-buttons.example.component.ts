import { Component, Inject, TemplateRef } from "@angular/core";
import { DialogService, NuiDialogRef, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-header-buttons-example",
    templateUrl: "./header-buttons.example.component.html",
})
export class HeaderButtonsExampleComponent {
    private activeDialog: NuiDialogRef;

    constructor(@Inject(DialogService) private dialogService: DialogService,
                @Inject(ToastService) private toastService: ToastService) {
    }

    public open(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, {size: "sm"});
    }

    public onButtonClick(title: string) {
        title === "Action" ? this.actionDone() : this.actionCanceled();
        this.activeDialog.close();
    }

    private actionDone(): void {
        this.toastService.success({
            message: $localize `Action Done!`,
            title: $localize `Event`,
        });
    }

    private actionCanceled(): void {
        this.toastService.info({
            message: $localize `Action Cancelled!`,
            title: $localize `Event`,
        });
    }

}
