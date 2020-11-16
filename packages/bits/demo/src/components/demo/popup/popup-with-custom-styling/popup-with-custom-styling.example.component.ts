import { Component, ViewEncapsulation } from "@angular/core";


@Component({
    selector: "nui-popup-with-custom-styling-example",
    templateUrl: "./popup-with-custom-styling.example.component.html",
    styleUrls: ["popup-with-custom-styling.example.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class PopupWithCustomStylingComponent {

    public icon = "caret-down";
    public itemsSource: string[] = [
        $localize `Item 1`,
        $localize `Item 2`,
        $localize `Item 3`,
        $localize `Item 4`,
    ];

    constructor() {}

}
