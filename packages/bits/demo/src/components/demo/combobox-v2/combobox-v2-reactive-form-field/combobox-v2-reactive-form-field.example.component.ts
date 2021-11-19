import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "nui-combobox-v2-reactive-form-field-example",
    templateUrl: "combobox-v2-reactive-form-field.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2ReactiveFormFieldExampleComponent implements OnInit {
    public icons: any[] = ["check", "email", "execute"];
    public items = Array.from({ length: 100 }).map((_, i) => $localize`Item ${i}`);
    public fancyForm: FormGroup;

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.fancyForm = this.formBuilder.group({
            combobox: this.formBuilder.control("", Validators.required),
        });
    }
}
