import { Component } from "@angular/core";

import { FormFieldComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-form-field-docs-example",
    templateUrl: "./form-field-docs.example.component.html",
})
export class FormFieldExampleComponent {
    getItemConfigKey(key: keyof FormFieldComponent): string {
        return key;
    }
}
