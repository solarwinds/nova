import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: "nui-radio-group-visual-test",
    templateUrl: "./radio-group-visual-test.component.html",
})
export class RadioGroupVisualTestComponent implements OnInit {
    public disabledForm: FormGroup;
    public colors = ["Red", "Green", "Blue"];
    public colorHints = {
        Red: "hot color",
        Green: "color of nature",
        Blue: "color of sky",
    };
    public fruits = ["Banana", "Orange", "Kiwi", "Papaya"];
    public selectedFruit: string;
    public selectedColor: string;

    constructor(private formBuilder: FormBuilder) {}

    public ngOnInit() {
        this.disabledForm = this.formBuilder.group({
            radioGroup: this.formBuilder.control({ value: "", disabled: true }),
        });
    }
}
