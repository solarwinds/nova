import { Component } from "@angular/core";
import { IMenuGroup } from "@nova-ui/bits";

@Component({
    selector: "expander-test",
    templateUrl: "./expander-test.component.html",
})

export class ExpanderTestComponent {
    public itemsSource: IMenuGroup[] = [
        {
            header: "Group 1", itemsSource: [
                { title: $localize`Item 1`, itemType: "action", action: this.actionDone },
                { title: $localize`Item 2`, itemType: "action", action: (): void => { alert($localize`hello`); } },
            ],
        },
        {
            itemsSource: [
                { title: "Item 3" },
            ],
        },
    ];
    constructor() { }

    public actionDone(): void {
        console.log("Action Done");
    }
}
