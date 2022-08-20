import { Component } from "@angular/core";
import { ISelectChangedEvent } from "@nova-ui/bits";

@Component({
    selector: "nui-select-separators-example",
    templateUrl: "./select-separators.example.component.html",
})
export class SelectSeparatorsExampleComponent {
    public dataset = {
        itemsInGroups: [
            {
                header: $localize`Group 1 header`,
                items: [
                    $localize`Item 1`,
                    $localize`Item 2`,
                    $localize`Item 3`,
                ],
            },
            {
                header: $localize`Group 2 header`,
                items: [
                    $localize`Item 4`,
                    $localize`Item 5`,
                    $localize`Item 6`,
                ],
            },
            {
                header: $localize`Group 3 header`,
                items: [
                    $localize`Item 7`,
                    $localize`Item 8`,
                    $localize`Item 9`,
                ],
            },
        ],
        selectedItem: $localize`Item 1`,
    };

    constructor() {}

    public valueChange(changedEvent: ISelectChangedEvent<string>) {
        this.dataset.selectedItem = changedEvent.newValue;
    }
}
