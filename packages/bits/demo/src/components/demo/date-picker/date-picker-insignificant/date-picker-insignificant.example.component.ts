import { Component, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { IToastService, ToastService } from "@nova-ui/bits";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-date-picker-insignificant-example",
    templateUrl: "./date-picker-insignificant.example.component.html",
})
export class DatePickerInsignificantExampleComponent {
    public dt: Moment = moment().endOf("day");
    public selectedDate: Date;
    public control = new FormControl(this.dt);

    constructor(@Inject(ToastService) private toastService: IToastService) { }

    public dateChanged(event: Moment): void {
        this.selectedDate = new Date(event.valueOf());
        this.toastService.info({ message: $localize`Selected date: ${event.toString()}` });
    }
}
