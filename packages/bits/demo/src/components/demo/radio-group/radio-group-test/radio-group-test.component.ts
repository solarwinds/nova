import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CheckboxChangeEvent } from "@nova-ui/bits";

@Component({
    selector: "nui-radio-group-test",
    templateUrl: "./radio-group-test.component.html",
})
export class RadioGroupTestComponent implements OnInit {
    public disabledForm: FormGroup;

    public fruits = [$localize`Banana`, $localize`Orange`, $localize`Kiwi`, $localize`Papaya`];
    public vegetables = [$localize`Cabbage`, $localize`Potato`, $localize`Tomato`, $localize`Carrot`];

    public selectedFruit: string;
    public selectedFruitInline: string;

    constructor(private formBuilder: FormBuilder) { }

    public ngOnInit(): void {
        this.disabledForm = this.formBuilder.group({
            radioGroup: this.formBuilder.control({ value: "", disabled: true }),
        });
    }

    public toggleDisabled(event: CheckboxChangeEvent): void {
        this.disabledForm.get("radioGroup")?.[!event.target.checked ? "enable" : "disable"]();
    }
}
