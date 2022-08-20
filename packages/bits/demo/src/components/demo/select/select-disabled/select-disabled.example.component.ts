import { Component } from "@angular/core";

@Component({
    selector: "nui-select-disabled-example",
    templateUrl: "./select-disabled.example.component.html",
})
export class SelectDisabledExampleComponent {
    public dataset = {
        items: [
            $localize`Item 1`,
            $localize`Item 2`,
            $localize`Item 3`,
            $localize`Item 4`,
            $localize`Item 5`,
        ],
        selectedItem: $localize`Item 1`,
    };

    constructor() {}
}
