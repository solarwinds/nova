import { Component } from "@angular/core";
import { IMenuGroup } from "@nova-ui/bits";

@Component({
    selector: "nui-expander-custom-header-example",
    templateUrl: "expander-custom-header.example.component.html",
})
export class ExpanderCustomHeaderExampleComponent {
    public itemsSource: IMenuGroup[] = [
        {
            header: "Group 1",
            itemsSource: [
                {
                    title: $localize`Item 1`,
                    itemType: "action",
                    action: this.actionDone,
                },
                {
                    title: $localize`Item 2`,
                    itemType: "action",
                    action: () => alert($localize`hello`),
                },
            ],
        },
        {
            itemsSource: [
                {
                    title: $localize`Item 3`,
                    itemType: "action",
                    action: this.actionDone,
                },
            ],
        },
    ];

    constructor() {}

    public actionDone(): void {
        console.log("Action Done");
    }
}
