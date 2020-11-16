import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { IDatePickerDisabledDate } from "@solarwinds/nova-bits";
import moment, { Moment } from "moment/moment";

@Component({
    selector: "nui-date-picker-test",
    templateUrl: "./date-picker-test.component.html",
})
export class DatePickerTestComponent implements OnInit {
    public dt: Moment;
    public dtPreserve: Moment;
    public minDate: Moment;
    public maxDate: Moment;
    public localActiveDate: Moment;
    public localActiveDatePreserve: Moment;
    public localActiveDateMinMax: Moment;
    public localActiveDateDisabledDates: Moment;
    public initDate: Moment;
    public initDatePreserve: Moment;
    public month: number;
    public year: number;
    public caption: string;
    public reactiveDatepickerForm: FormGroup;
    public dateDisabled: IDatePickerDisabledDate[];
    public todayDateDisabled: IDatePickerDisabledDate[];

    constructor(private formBuilder: FormBuilder) {
        this.dt = moment();
        this.dtPreserve = moment();
        this.localActiveDate = this.dt;
        this.localActiveDatePreserve = this.dtPreserve;
        this.localActiveDateMinMax = this.dt;
        this.localActiveDateDisabledDates = this.dt;
        this.month = this.dt.month() + 1;
        this.year = this.dt.year();
        this.minDate = moment({year: this.year, month: this.month - 1, date: 5});
        this.maxDate = moment({year: this.year, month: this.month - 1, date: 25});
        this.caption = "Custom caption for date-picker";
        this.initDate = moment().utcOffset(0).hour(23).minute(15).add(1, "day");
        this.initDatePreserve = this.initDate;
        this.dateDisabled = [
            {
                date: moment({year: this.year, month: this.month - 1, date: 10}),
                mode: "day",
            },
            {
                date: moment({year: this.year, month: this.month - 1, date: 11}),
                mode: "day",
            },
            {
                date: moment({year: this.year, month: this.month - 1, date: 12}),
                mode: "day",
            },
            {
                date: moment({year: this.year, month: this.month, date: 12}),
                mode: "month",
            },
            {
                date: moment({year: this.year + 1, month: this.month - 1, date: 12}),
                mode: "year",
            },
        ];
        this.todayDateDisabled = [
            {
                date: this.dt,
                mode: "day",
            },
        ];
    }

    ngOnInit() {
        this.reactiveDatepickerForm = this.formBuilder.group({
            datePicker: this.formBuilder.control(moment()),
        });
    }

    public dateChanged(event: any) {
        this.localActiveDate = event;
    }

    public dateChangedPreserved(event: any) {
        this.localActiveDatePreserve = event;
    }

    public dateChangedMinMax(event: any) {
        this.localActiveDateMinMax = event;
    }

    public dateChangedDisabledDates(event: any) {
        this.localActiveDateDisabledDates = event;
    }

    public initDateChangedPreserved(event: any) {
        this.initDatePreserve = event;
    }
}
