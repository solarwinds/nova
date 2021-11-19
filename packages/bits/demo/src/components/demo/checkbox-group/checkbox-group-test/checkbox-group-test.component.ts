import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: "nui-checkbox-group-test-example",
    templateUrl: "checkbox-group-test.component.html",
})

export class CheckboxGroupTestComponent implements OnInit {
    public testForm: FormGroup;
    public cabbage = "Cabbage";
    public potato = "Potato";
    public tomato = "Tomato";
    public carrot = "Carrot";
    public disabledOne = "DISABLED";
    public vegetables = [this.cabbage, this.potato, this.tomato, this.carrot];
    public hints = [this.cabbage, this.tomato];
    public selectedVegetables = [this.potato, this.tomato, this.disabledOne];

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.testForm = this.formBuilder.group({
            checkboxGroup: this.formBuilder.control({
                value: this.selectedVegetables, disabled: true,
            }),
            checkboxGroup2: this.formBuilder.control({
                value: this.selectedVegetables, disabled: false,
            }),
        });
    }

    public isChecked(vegetable: string): boolean {
        return this.selectedVegetables.indexOf(vegetable) > -1;
    }
}
