import { Component } from "@angular/core";

@Component({
    selector: "nui-select-v2-inline-example",
    templateUrl: "./select-v2-inline.example.component.html",
    host: { class: "select-container" },
})
export class SelectV2InlineExampleComponent {
    public items = Array.from({ length: 100 }).map(
        (_, i) => $localize`Item ${i}`
    );
}
