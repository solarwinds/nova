import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
    selector: "nui-combobox-v2-options-changed-example",
    templateUrl: "combobox-v2-options-changed.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2OpitionsChangedExampleComponent implements OnInit {
    public items: string[] = [];
    public multiselectItems: string[] = [];
    private itemSet = [
        [
            $localize `Item 1`,
            $localize `Item 2`,
            $localize `Item 3`,
            $localize `Item 4`,
        ],
        [
            $localize `Item 3`,
            $localize `Item 4`,
            $localize `Item 5`,
            $localize `Item 6`,
        ],
    ];
    public comboboxControl = new FormControl();
    public multiselectControl = new FormControl();

    public ngOnInit() {
        this.items = this.itemSet[0];
        this.multiselectItems = this.itemSet[0];
    }

    public setItems(i: number) {
        this.items = this.itemSet[i];
    }

    public setMultiselectItems(i: number) {
        this.items = this.itemSet[i];
    }

    public convertToChip(value: string) {
        return ({ label: value });
    }
}
