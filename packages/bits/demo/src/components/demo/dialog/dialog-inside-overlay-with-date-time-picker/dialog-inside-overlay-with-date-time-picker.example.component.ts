import { Component, TemplateRef } from "@angular/core";
import { DialogService, NuiDialogRef } from "@nova-ui/bits";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-dialog-inside-overlay-with-date-time-picker-example",
    templateUrl: "./dialog-inside-overlay-with-date-time-picker.example.component.html",
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
    public openInOverlay(content: TemplateRef<string>): void {
        this.activeDialog = this.dialogService.open(content, { size: "sm", useOverlay: true });
    }

    public onDone(): void {
        this.activeDialog.close();
    }

    public onCancel(): void {
        this.activeDialog.close();
    }

    public onModelChanged(event: any): void {
        this.selectedDate = new Date(event.valueOf());
    }
}
