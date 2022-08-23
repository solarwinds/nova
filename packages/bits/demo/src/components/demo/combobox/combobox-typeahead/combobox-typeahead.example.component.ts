import { Component } from "@angular/core";
import _cloneDeep from "lodash/cloneDeep";

import { ISelectChangedEvent, ISelectGroup } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-typeahead-example",
    templateUrl: "./combobox-typeahead.example.component.html",
})
export class ComboboxTypeaheadExampleComponent {
    public dataset: ISelectGroup[] = [
        {
            header: "Group 1 header",
            items: [
                { label: "Item 111", value: "Value 1" },
                { label: "Item 112", value: "Value 2" },
                { label: "Item 123", value: "Value 3" },
            ],
        },
        {
            header: "Group 2 header",
            items: [
                { label: "Item 111", value: "Value 5" },
                { label: "Item 212", value: "Value 6" },
                { label: "Item 312", value: "Value 7" },
            ],
        },
        {
            header: "Group 3 header",
            items: [
                { label: "Item 456", value: "Value 7" },
                { label: "Item 345", value: "Value 8" },
                { label: "Item 414", value: "Value 9" },
            ],
        },
    ];
    public displayedItems = this.dataset;

    public textboxChanged(searchQuery: ISelectChangedEvent<any>) {
        this.displayedItems = _cloneDeep(this.dataset);
        this.displayedItems.forEach((group) => {
            group.items = group.items.filter((item) => {
                // searchQuery.newValue.label is necessary, since combobox can emit event with 2 possible values:
                // either string or complex object ({label: x, value: y} in this case). Users should be careful dealing with this emitters
                // and handle them properly.
                const itemLabel = item.label.toLowerCase();
                const val = searchQuery.newValue;
                return (
                    itemLabel.includes(val.toLowerCase()) ||
                    itemLabel.includes(val.label && val.label.toLowerCase())
                );
            });
        });
    }
}
