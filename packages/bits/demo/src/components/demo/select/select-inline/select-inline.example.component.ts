import { Component } from "@angular/core";


@Component({
    selector: "nui-select-inline-example",
    templateUrl: "select-inline.example.component.html",
})

export class SelectInlineExampleComponent {
    public dataset = {
        itemsSource1: [$localize `Item 1`, $localize `Item 2`, $localize `Item 3`, $localize `Item 4`, $localize `Item 5`],
        itemsSource2: [$localize `Item 6`, $localize `Item 7`, $localize `Item 8`, $localize `Item 9`, $localize `Item 10`],
    };

    constructor() { }
}
