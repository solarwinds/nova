import { Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "nui-popup-with-custom-width-example",
    templateUrl: "./popup-with-custom-width.example.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class PopupWithCustomWidthComponent {
    public icon = "caret-down";
    public width = "130px";
    public itemsSource: string[] = [
        $localize`Item 1`,
        $localize`Item 2`,
        $localize`Item 3`,
        $localize`Item 4`,
    ];

    constructor() {}
}
