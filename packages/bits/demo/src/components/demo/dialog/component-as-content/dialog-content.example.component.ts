import { Component, Inject, Input } from "@angular/core";
import { IToastService, NuiActiveDialog, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-dialog-content-example",
    templateUrl: "./dialog-content.example.component.html",
})
export class DialogContentExampleComponent {
    @Input() name: string;

    constructor(
        @Inject(NuiActiveDialog) public activeDialog: any,
        @Inject(ToastService) private toastService: IToastService
    ) { }

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
