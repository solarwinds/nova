import { Component, Inject } from "@angular/core";
import { ToastService } from "@solarwinds/nova-bits";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-time-picker-model-change",
    templateUrl: "./time-picker-model-change.example.component.html",
})

export class TimePickerModelChangeExampleComponent {
    public time: Moment;
    constructor(@Inject(ToastService) private toastService: ToastService) {
        this.time = moment("01:20 AM", "HH:mm a");
    }
    public valueChange(time: any): void {
        this.time = time;
        this.toastService.info({message: $localize `Selected time is: ` + this.time.toString()});
    }
}
