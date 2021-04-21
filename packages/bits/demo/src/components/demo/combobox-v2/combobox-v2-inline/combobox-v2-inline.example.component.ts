import { Component } from "@angular/core";

@Component({
    selector: "nui-combobox-v2-inline-example",
    templateUrl: "combobox-v2-inline.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2InlineExampleComponent {
    public items = Array.from({ length: 100 }).map((_, i) => $localize `Item ${i}`);
}
