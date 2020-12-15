import { Component, Inject } from "@angular/core";
import { ToastService } from "@nova-ui/bits";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-time-picker-preserve-insignificant",
    templateUrl: "./time-picker-preserve-insignificant.example.component.html",
})

export class TimePickerPreserveInsignificantExampleComponent {
    public time: Moment;

    constructor(@Inject(ToastService) private toastService: ToastService) {
        this.time = moment();
    }

    public valueChange(time: any): void {
        this.time = time;
        this.toastService.info({message: $localize `Selected time is: ` + this.time.toString()});
    }
}
