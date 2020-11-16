import { Component } from "@angular/core";


@Component({
    selector: "nui-select-justified-example",
    templateUrl: "./select-justified.example.component.html",
})
export class SelectJustifiedExampleComponent {
    public dataset = {
        items: [$localize `Item 1`, $localize `Item 2`, $localize `Item 3`, $localize `Item 4`, $localize `Item 5`],
        selectedItem: $localize `Item 1`,
    };

    constructor() { }
}
