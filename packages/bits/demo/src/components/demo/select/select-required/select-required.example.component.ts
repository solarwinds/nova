import { Component } from "@angular/core";

import { ISelectChangedEvent } from "@nova-ui/bits";

@Component({
    selector: "nui-select-required-example",
    templateUrl: "./select-required.example.component.html",
})
export class SelectRequiredExampleComponent {
    public isRequired = true;
    public dataset = {
        items: [
            $localize`Element 1`,
            $localize`Element 2`,
            $localize`Element 3`,
            $localize`Element 4`,
            $localize`Element 5`,
            $localize`Element 6`,
            $localize`Element 7`,
            $localize`Element 8`,
            $localize`Element 9`,
            $localize`Element 10`,
        ],
        selectedItem: "",
    };

    constructor() {}

    public valueChange(changedEvent: ISelectChangedEvent<string>) {
        this.dataset.selectedItem = changedEvent.newValue;
    }

    public isInErrorState() {
        return this.isRequired && !this.dataset.selectedItem;
    }
}
