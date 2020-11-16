import { ChangeDetectorRef, Component, Input } from "@angular/core";

import { NuiActiveDialog } from "./dialog-ref";
import { ConfirmationDialogButtons, SeverityLevels } from "./public-api";

/**
 * @ignore
 */
@Component({
    selector: "nui-confirmation-dialog-window",
    templateUrl: "./confirmation-dialog.component.html",
})
export class ConfirmationDialogComponent {

    @Input()
    public title: string = $localize `Confirmation`;

    @Input()
    public message: string;

    @Input()
    public confirmText: string = $localize `Yes`;

    @Input()
    public dismissText: string = $localize `No`;

    @Input()
    public setFocus: ConfirmationDialogButtons = "confirm";

    @Input()
    public severity: SeverityLevels;

    constructor(private activeDialog: NuiActiveDialog,
                private changeDetector: ChangeDetectorRef) {
    }

    public updateInputs() {
        this.changeDetector.detectChanges();
    }

    public close(result: boolean) {
        this.activeDialog.close(result);
    }

    public dismiss() {
        this.activeDialog.dismiss();
    }

    public focusButton(buttonType: ConfirmationDialogButtons): boolean {
        return this.setFocus === buttonType ? true : false;
    }

}
