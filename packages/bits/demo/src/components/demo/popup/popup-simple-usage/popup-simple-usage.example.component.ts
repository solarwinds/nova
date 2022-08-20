import { Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "nui-popup-simple-usage-example",
    templateUrl: "./popup-simple-usage.example.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class PopupSimpleExampleComponent {
    public icon = "caret-down";
    public itemsSource: string[] = [
        $localize`Item 1`,
        $localize`Item 2`,
        $localize`Item 3`,
        $localize`Item 4`,
    ];
}
