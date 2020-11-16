import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
    selector: "nui-combobox-v2-typeahead-example",
    templateUrl: "combobox-v2-typeahead.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2TypeaheadExampleComponent {
    public items = Array.from({ length : 50 }).map((_, i) => $localize `Item ${i}`);
    public comboboxControl = new FormControl();
}
