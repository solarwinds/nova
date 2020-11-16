import { Component, ViewEncapsulation } from "@angular/core";


@Component({
    selector: "nui-popup-append-to-body-example",
    templateUrl: "./popup-append-to-body.example.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class PopupAppendToBodyExampleComponent {

    public icon = "caret-down";
    public itemsSource: string[] = [
        $localize `Item 1`,
        $localize `Item 2`,
        $localize `Item 3`,
        $localize `Item 4`,
    ];

    constructor() {}

}
