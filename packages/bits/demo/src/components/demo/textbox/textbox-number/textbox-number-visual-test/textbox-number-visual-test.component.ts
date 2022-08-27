import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: "nui-textbox-number-visual",
    templateUrl: "./textbox-number-visual-test.component.html",
})
export class TextboxNumberVisualTestComponent {
    public reactiveForm: FormGroup;

    constructor(public formBuilder: FormBuilder) {
        this.reactiveForm = formBuilder.group({
            number: [10],
        });
    }
}
