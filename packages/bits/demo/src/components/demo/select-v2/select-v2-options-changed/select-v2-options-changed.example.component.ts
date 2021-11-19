import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
    selector: "nui-select-v2-options-changed-example",
    templateUrl: "select-v2-options-changed.example.component.html",
    host: { class: "select-container" },
})
export class SelectV2OptionsChangedExampleComponent implements OnInit {
    public items: string[] = [];
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
    public selectControl = new FormControl();

    public ngOnInit(): void {
        this.items = this.itemSet[0];
    }

    public setItems(i: number): void {
        this.items = this.itemSet[i];
    }
}
