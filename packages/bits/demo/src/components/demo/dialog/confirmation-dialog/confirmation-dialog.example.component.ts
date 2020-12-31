import { Component, Inject } from "@angular/core";
import { DialogService, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-confirmation-dialog-example",
    templateUrl: "./confirmation-dialog.example.component.html",
})
export class ConfirmationDialogExampleComponent {
    constructor(@Inject(DialogService) private dialogService: DialogService,
                @Inject(ToastService) private toastService: ToastService) {
    }

    public openInfo() {
        this.dialogService.confirm({ message: $localize `Are you sure you want to do it?`, severity: "info", setFocus: "confirm" }).result
            .then((result) => {
                this.toastService.info({message: result ? $localize `Confirmed` : $localize `Dismissed`});
            }, (reason) => {
                console.log("Rejected:", reason);
            });
    }
    public openWarning() {
        this.dialogService.confirm({ message: $localize `Are you sure you want to do it?`, severity: "warning", setFocus: "dismiss" }).result
            .then((result) => {
                this.toastService.info({message: result ? $localize `Confirmed` : $localize `Dismissed`});
            }, (reason) => {
                console.log("Rejected:", reason);
            });
    }
    public openCritical() {
        this.dialogService.confirm({ message: $localize `Are you sure you want to do it?`, severity: "critical", setFocus: "dismiss" }).result
            .then((result) => {
                this.toastService.info({message: result ? $localize `Confirmed` : $localize `Dismissed`});
            }, (reason) => {
                console.log("Rejected:", reason);
            });
    }
}
