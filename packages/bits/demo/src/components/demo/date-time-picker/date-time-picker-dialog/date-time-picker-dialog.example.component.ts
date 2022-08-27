import { Component, Inject, TemplateRef } from "@angular/core";
import moment, { Moment } from "moment/moment";

import { DialogService } from "@nova-ui/bits";

@Component({
    selector: "nui-date-time-picker-dialog-example",
    templateUrl: "./date-time-picker-dialog.example.component.html",
})
export class DateTimePickerDialogExampleComponent {
    public dt: Moment;
    public selectedDate: Date;

    constructor(@Inject(DialogService) private dialogService: DialogService) {
        this.dt = moment();
        this.selectedDate = new Date(this.dt.valueOf());
    }

    public open(content: TemplateRef<string>) {
        this.dialogService.open(content, { size: "sm" });
    }

    onModelChanged(event: any) {
        this.selectedDate = new Date(event.valueOf());
    }
}
