import { Component } from "@angular/core";

@Component({
    selector: "nui-combobox-v2-basic-example",
    templateUrl: "combobox-v2-basic.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2BasicExampleComponent {
    public items = Array.from({ length: 50 }).map(
        (_, i) => $localize`Item ${i}`
    );
}
