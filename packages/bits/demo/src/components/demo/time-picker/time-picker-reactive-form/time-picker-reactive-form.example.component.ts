import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastService } from "@solarwinds/nova-bits";
import { Moment } from "moment/moment";

@Component({
    selector: "nui-time-picker-reactive-form",
    templateUrl: "./time-picker-reactive-form.example.component.html",
})

export class TimePickerReactiveFormExampleComponent implements OnInit {
    public time: Moment;
    public myForm: FormGroup;

    constructor(private formBuilder: FormBuilder,
        @Inject(ToastService) private toastService: ToastService) { }

    public ngOnInit() {
        this.myForm = this.formBuilder.group({
            timePickerFormControl: this.formBuilder.control( this.time, [Validators.required]),
        });
    }

    public valueChange(time: any): void {
        this.time = time;
    }

    public onSubmit() {
        this.myForm.valid ? this.toastService.success({message: `Your form is valid!`}) :
            this.toastService.error({message: `Your form is invalid!`});
    }

}
