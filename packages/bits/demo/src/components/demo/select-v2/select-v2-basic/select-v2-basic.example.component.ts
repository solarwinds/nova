import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
    selector: "nui-select-v2-basic-example",
    templateUrl: "select-v2-basic.example.component.html",
    host: { class: "select-container" },
})
export class SelectV2BasicExampleComponent {
    public items = Array.from({ length: 50 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public selectControl = new FormControl();
}
