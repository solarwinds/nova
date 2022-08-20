import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: "nui-textbox-number-test",
    templateUrl: "./textbox-number-test.component.html",
})
export class TextboxNumberTestComponent {
    public value = 10;

    public reactiveForm: FormGroup;

    constructor(public formBuilder: FormBuilder) {
        this.reactiveForm = formBuilder.group({
            number: [1],
        });
    }
}
