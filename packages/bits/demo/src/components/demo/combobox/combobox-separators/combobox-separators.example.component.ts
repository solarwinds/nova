import { Component } from "@angular/core";
import { ISelectChangedEvent } from "@nova-ui/bits";
import _cloneDeep from "lodash/cloneDeep";

@Component({
    selector: "nui-combobox-separators-example",
    templateUrl: "./combobox-separators.example.component.html",
})
export class ComboboxSeparatorsExampleComponent {
    public dataset = {
        itemsInGroups: [
            {
                header: `Group 1 header`,
                items: [`Item 111`, `Item 211`, `Item 311`],
            },
            {
                header: `Group 2 header`,
                items: [`Item 112`, `Item 212`, `Item 312`],
            },
            {
                header: `Group 3 header`,
                items: [`Item 113`, `Item 213`, `Item 313`],
            },
        ],
    };
    public displayedItems = this.dataset.itemsInGroups;

    constructor() {}

    public textboxChanged(searchQuery: ISelectChangedEvent<string>) {
        this.displayedItems = _cloneDeep(this.dataset.itemsInGroups);
        this.displayedItems.forEach((items) => {
            items.items = items.items.filter((item) =>
                item.includes(searchQuery.newValue)
            );
        });
    }
}
