import { Component } from "@angular/core";

@Component({
    selector: "nui-repeat-item-example",
    templateUrl: "./repeat-item.example.component.html",
})
export class RepeatItemExampleComponent {
    public items = [$localize`Item 1`, $localize`Item 2`, $localize`Item 3`];

    constructor() {}
}
