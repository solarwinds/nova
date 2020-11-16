import { Component, OnInit } from "@angular/core";
import { ISelectChangedEvent } from "@solarwinds/nova-bits";
import _cloneDeep from "lodash/cloneDeep";

@Component({
    selector: "combobox-visual-test",
    templateUrl: "./combobox-visual-test.component.html",
})

export class ComboboxVisualTestComponent implements OnInit {
    public isRequired: boolean = true;
    public errorState: boolean = true;
    public dataset = {
        items: [
            "Item 1", "Item 2", "Item 3", "Item 4", "Item 5",
            "Item 6", "Item 7", "Item 8", "Item 9", "Item 10",
        ],
        selectedItem: "",
    };
    public datasetInGroups = {
        itemsInGroups: [
            {
                header: "Group 1 header",
                items: ["Item 111", "Item 211", "Item 311"],
            },
            {
                header: "Group 2 header",
                items: ["Item 112", "Item 212", "Item 312"],
            },
            {
                header: "Group 3 header",
                items: ["Item 113", "Item 213", "Item 313"],
            },
        ],
    };
    public displayedItems = this.datasetInGroups.itemsInGroups;

    public textboxChanged(searchQuery: ISelectChangedEvent<string>) {
        this.displayedItems = _cloneDeep(this.datasetInGroups.itemsInGroups);
        this.displayedItems.forEach(items => {
            items.items = items.items.filter(item => item.includes(searchQuery.newValue));
        });
    }

    ngOnInit() {
        this.isInErrorState();
    }

    public valueChange(changedEvent: ISelectChangedEvent<string>): void {
        this.dataset.selectedItem = changedEvent.newValue;
        this.isInErrorState();
    }

    public isInErrorState(): void {
        this.errorState = this.isRequired &&
            (!this.dataset.selectedItem || !(this.dataset.items.indexOf(this.dataset.selectedItem) !== -1));
    }
}
