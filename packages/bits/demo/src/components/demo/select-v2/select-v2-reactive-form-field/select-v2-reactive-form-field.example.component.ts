import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "nui-select-v2-reactive-form-field-example",
    templateUrl: "./select-v2-reactive-form-field.example.component.html",
    host: { class: "select-container" },
})
export class SelectV2ReactiveFormFieldExampleComponent implements OnInit {
    public items = Array.from({ length: 100 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public fancyForm: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.fancyForm = this.formBuilder.group({
            select: this.formBuilder.control("", Validators.required),
        });
    }
}
