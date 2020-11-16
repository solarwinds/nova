import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
    selector: "nui-combobox-v2-remove-value-example",
    templateUrl: "combobox-v2-remove-value.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2RemoveValueExampleComponent {
    public items = Array.from({ length: 100 }).map((_, i) => $localize `Item ${i}`);
    public comboboxControl = new FormControl();
}
