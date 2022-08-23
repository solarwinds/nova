import { Component, TemplateRef } from "@angular/core";
import moment, { Moment } from "moment/moment";

import { DialogService, NuiDialogRef } from "@nova-ui/bits";

@Component({
    selector: "nui-dialog-inside-overlay-with-date-time-picker-example",
    templateUrl:
        "./dialog-inside-overlay-with-date-time-picker.example.component.html",
})
export class DialogInsideOverlayWithDateTimePickerExampleComponent {
    public dt: Moment;
    public selectedDate: Date;

    private activeDialog: NuiDialogRef;

    constructor(private dialogService: DialogService) {
        this.dt = moment();
        this.selectedDate = new Date(this.dt.valueOf());
    }

    /**
     * Notice that the 'useOverlay' option is being passed in here
     */
    public openInOverlay(content: TemplateRef<string>) {
        this.activeDialog = this.dialogService.open(content, {
            size: "sm",
            useOverlay: true,
        });
    }

    public onDone(): void {
        this.activeDialog.close();
    }

    public onCancel(): void {
        this.activeDialog.close();
    }

    public onModelChanged(event: any) {
        this.selectedDate = new Date(event.valueOf());
    }
}
