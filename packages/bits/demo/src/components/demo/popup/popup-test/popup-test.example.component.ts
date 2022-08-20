import { Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "nui-popup-test",
    templateUrl: "./popup-test.example.component.html",
    styleUrls: ["popup-test.example.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class PopupTestComponent {
    public width = "200px";
    public icon = "caret-down";
    public itemsSource: string[] = [
        "Item 1",
        "Item 2",
        "Item 3",
        "Item 4",
        "Item 5",
    ];

    public handleClick(event: MouseEvent) {
        event.stopPropagation();
    }
}
