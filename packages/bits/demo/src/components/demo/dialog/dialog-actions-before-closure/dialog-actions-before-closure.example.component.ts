import { Component, TemplateRef } from "@angular/core";
import { DialogService, NuiDialogRef } from "@nova-ui/bits";
import { take, takeUntil } from "rxjs/operators";

@Component({
    selector: "nui-dialog-actions-before-closure-example",
    templateUrl: "./dialog-actions-before-closure.example.component.html",
})
export class DialogActionBeforeClosureExampleComponent {
    private activeDialog: NuiDialogRef;

    constructor(private dialogService: DialogService) {}

    public open(content: TemplateRef<string>) {
        // If the beforeDismiss function returns 'false' it will prevent the dialog from closing.
        this.activeDialog = this.dialogService.open(content, {size: "sm", beforeDismiss: this.beforeDismiss});

        // We can use the beforeDismissed$ event to execute actions right before the dialog gets closed
        this.activeDialog
                .beforeDismissed$
                    .pipe(
                        takeUntil(this.activeDialog.closed$)
                    )
                    .subscribe(event => {
                        // Covering the 'ESC' button event origin
                        if (event === "ESC") {
                            console.log("ESC CLOSED");
                        }
                        // Covering the 'BACKDROP_CLICK' event in case of clearing the dialog by clicking the backdrop
                        if (event === "BACKDROP_CLICK") {
                            console.log(`BACKDROP CLICK CLOSED`);
                            return;
                        }
                        // Here we cover the custom 'DONE' event which you can create and then capture within the '.beforeDismiss' subscription
                        // to run your custom logic in response to that event right before the dialog closure
                        if (event === "DONE") {
                            console.log("DONE");
                            return;
                        }
                        // Set of actions for all event origins before the dialog closes
                        console.log("BEFORE CLOSED");
                        this.activeDialog.close();
        });

        // Here we can perform actions required when the dialog just got closed
        this.activeDialog.closed$.pipe(take(1)).subscribe(() => {
            console.log("CLOSED");
        });
    }

    public actionDone(): void {
        console.log("ACTION DONE");
        this.activeDialog.dismiss("DONE");
    }

    public actionCanceled(): void {
        console.log("ACTION CANCELED");
        this.activeDialog.dismiss();
    }

    public beforeDismiss() {
        return false;
    }

    public closeFromHeader() {
        console.log("X pressed");
        this.activeDialog.dismiss();
    }
}
