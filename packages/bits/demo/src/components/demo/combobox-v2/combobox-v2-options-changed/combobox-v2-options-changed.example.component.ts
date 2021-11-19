import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { IChipsItem } from "@nova-ui/bits";

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
            $localize`Item 1`,
            $localize`Item 2`,
            $localize`Item 3`,
            $localize`Item 4`,
        ],
        [
            $localize`Item 3`,
            $localize`Item 4`,
            $localize`Item 5`,
            $localize`Item 6`,
        ],
    ];
    public comboboxControl = new FormControl();
    public multiselectControl = new FormControl();

    public ngOnInit(): void {
        this.items = this.itemSet[0];
        this.multiselectItems = this.itemSet[0];
    }

    public setItems(i: number): void {
        this.items = this.itemSet[i];
    }

    public setMultiselectItems(i: number): void {
        this.items = this.itemSet[i];
    }

    public convertToChip(value: string): IChipsItem {
        return ({ label: value });
    }
}
