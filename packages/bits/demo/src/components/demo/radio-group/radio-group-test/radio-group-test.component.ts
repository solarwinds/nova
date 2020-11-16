import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CheckboxChangeEvent } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-radio-group-test",
    templateUrl: "./radio-group-test.component.html",
})
export class RadioGroupTestComponent implements OnInit {
    public disabledForm: FormGroup;
    public fancyForm: FormGroup;

    public fruits = [$localize `Banana`, $localize `Orange`, $localize `Kiwi`, $localize `Papaya`];
    public vegetables = [$localize `Cabbage`, $localize `Potato`, $localize `Tomato`, $localize `Carrot`];
    public colors = [$localize `Red`, $localize `Green`, $localize `Blue`];
    public colorHints = {"Red": $localize `hot color`, "Green": $localize `color of nature`, "Blue": $localize `color of sky`};

    public selectedColor: string;
    public selectedFruit: string;
    public selectedFruitInline: string;

    constructor(private formBuilder: FormBuilder) {}

    public ngOnInit() {
        this.disabledForm = this.formBuilder.group({
            radioGroup: this.formBuilder.control({value: "", disabled: true}),
        });
        this.fancyForm = this.formBuilder.group({
            radioGroup: this.formBuilder.control(this.vegetables[1], [
                Validators.required,
            ]),
        });
    }

    public toggleDisabled(event: CheckboxChangeEvent) {
        this.disabledForm.get("radioGroup")?.[!event.target.checked ? "enable" : "disable"]();
    }
}
