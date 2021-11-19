import { Component, Inject } from "@angular/core";
import { IToastService, ToastService } from "@nova-ui/bits";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-date-picker-value-change-example",
    templateUrl: "./date-picker-value-change.example.component.html",
})
export class DatePickerValueChangeExampleComponent {
    public selectedDate: Date = new Date(moment().valueOf());

    constructor(@Inject(ToastService) private toastService: IToastService) { }

    public dateChanged(event: Moment): void {
        this.selectedDate = new Date(event.valueOf());
        this.toastService.info({ message: $localize`Selected date: ${event.toString()}` });
    }
}
