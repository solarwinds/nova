import { Component } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Moment } from "moment/moment";


@Component({
    selector: "nui-date-time-picker-empty-state",
    templateUrl: "./date-time-picker-empty-state.component.html",
})
export class DateTimePickerEmptyStateComponent {
    public dt: Moment | undefined = undefined;
    public selectedDate: Date | String = "";
    public initEmpty: boolean = true;
    public control: FormControl = new FormControl(this.dt, Validators.required);

    constructor() { }

    onModelChanged(event: Moment): void {
        this.selectedDate = new Date(event.valueOf());
    }
}
