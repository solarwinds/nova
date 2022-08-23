import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
    selector: "nui-combobox-v2-error-example",
    templateUrl: "combobox-v2-error.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2ErrorExampleComponent {
    public items = Array.from({ length: 100 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public comboboxControl = new FormControl();
    public error: boolean = true;
}
