import { Component, Inject, TemplateRef } from "@angular/core";
import { DialogService } from "@nova-ui/bits";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-date-time-picker-visual-test",
    templateUrl: "./date-time-picker-visual-test.component.html",
})
export class DateTimePickerVisualTestComponent {
    public dt: Moment = moment("2018-02-02");
    public minDate: Moment = this.dt.clone().date(1);
    public maxDate: Moment = this.dt.clone().date(20);

    constructor(@Inject(DialogService) private dialogService: DialogService) {}

    public open(content: TemplateRef<string>) {
        this.dialogService.open(content, { size: "sm" });
    }
}
