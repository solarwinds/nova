import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: "nui-textbox-number-min-max-example",
    templateUrl: "./textbox-number-min-max.example.component.html",
})
export class TextboxNumberMinMaxExampleComponent {
    public value = 10;

    public reactiveForm: FormGroup;

    constructor(public formBuilder: FormBuilder) {
        this.reactiveForm = formBuilder.group({
            number: [1],
        });
    }
}
