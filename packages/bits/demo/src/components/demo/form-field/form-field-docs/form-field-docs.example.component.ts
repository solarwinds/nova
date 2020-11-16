import { Component } from "@angular/core";
import {FormFieldComponent} from "@solarwinds/nova-bits";

@Component({
    selector: "nui-form-field-docs-example",
    templateUrl: "./form-field-docs.example.component.html",
})
export class FormFieldExampleComponent {
    getItemConfigKey(key: keyof FormFieldComponent): string {
        return key;
    }
}
