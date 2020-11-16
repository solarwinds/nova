import { Component } from "@angular/core";

@Component({
    selector: "nui-select-v2-error-example",
    templateUrl: "./select-v2-error.example.component.html",
    host: { class: "select-container" },
})
export class SelectV2ErrorExampleComponent {
    public items = Array.from({ length: 100 }).map((_, i) => $localize`Item ${i}`);
    public error: boolean = false;
}
