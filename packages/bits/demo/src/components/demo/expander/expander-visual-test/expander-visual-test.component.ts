import { Component } from "@angular/core";
import { IMenuGroup } from "@nova-ui/bits";

@Component({
    selector: "expander-visual-test",
    templateUrl: "./expander-visual-test.component.html",
})
export class ExpanderVisualTestComponent {
    public itemsSource: IMenuGroup[] = [
        {
            header: "Group 1",
            itemsSource: [{ title: "Item 1" }, { title: "Item 2" }],
        },
        {
            itemsSource: [{ title: "Item 3" }],
        },
    ];
}
