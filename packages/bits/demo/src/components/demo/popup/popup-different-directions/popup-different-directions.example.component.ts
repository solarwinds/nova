import { Component, ViewEncapsulation } from "@angular/core";


@Component({
    selector: "nui-popup-different-directions-example",
    templateUrl: "./popup-different-directions.example.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class PopupDifferentDirectionsExampleComponent {

    public icon = "caret-down";
    public itemsSource: string[] = [
        $localize `Item 1`,
        $localize `Item 2`,
        $localize `Item 3`,
        $localize `Item 4`,
    ];

    constructor() {}

}
