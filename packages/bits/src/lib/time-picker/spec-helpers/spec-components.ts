import { Inject, OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Moment } from "moment/moment";

import { ToastService } from "../../toast/toast.service";

/**
 * @ignore
 */
@Component({
    template: `
        <form [formGroup]="myForm" (submit)="onSubmit()">
            <div class="form-group">
                <nui-time-picker
                    formControlName="testTime"
                    [isInErrorState]="myForm.controls['testTime'].invalid && myForm.controls['testTime'].touched"
                    (timeChanged)="valueChange($event)"></nui-time-picker>
                <button nui-button
                        type="submit"
                        class="mt-1">Submit</button>
            </div>
        </form>

    `,
})

export class TimePickerReactiveFormTestComponent implements OnInit {
    public time: Moment;
    public myForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
        @Inject(ToastService) public toastService: ToastService) { }

    public ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            testTimePicker: this.formBuilder.control(this.time, [Validators.required]),
        });
    }

    public valueChange(time: any): void {
        this.time = time;
    }

    public onSubmit(): void {
        this.myForm.valid ? this.toastService.success({ message: "Your form is valid!" }) :
            this.toastService.error({ message: "Your form is invalid!" });
    }
}
