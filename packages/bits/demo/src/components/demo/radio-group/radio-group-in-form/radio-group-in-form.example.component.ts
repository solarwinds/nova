import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


@Component({
    selector: "nui-radio-group-in-form-example",
    templateUrl: "./radio-group-in-form.example.component.html",
})
export class RadioGroupInFormExampleComponent implements OnInit {
    public fancyForm: FormGroup;

    public vegetables = [$localize `Cabbage`, $localize `Potato`, $localize `Tomato`, $localize `Carrot`];
    constructor(private formBuilder: FormBuilder) {}
    public ngOnInit() {
        this.fancyForm = this.formBuilder.group({
            radioGroup: this.formBuilder.control(this.vegetables[1], [
                Validators.required,
            ]),
        });
    }
}
