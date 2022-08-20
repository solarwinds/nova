import { Component } from "@angular/core";
import { ISelectChangedEvent } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-display-value-example",
    templateUrl: "combobox-display-value.example.component.html",
})
export class ComboboxDisplayValueExampleComponent {
    public dataset = {
        items: [
            { value: "Value 1", name: "Item 1" },
            { value: "Value 2", name: "Item 2" },
            { value: "Value 3", name: "Item 3" },
            { value: "Value 4", name: "Item 4" },
            { value: "Value 5", name: "Item 5" },
        ],
    };
    public selectedItem: any;

    public onValueChange(changedEvent: ISelectChangedEvent<any>) {
        this.selectedItem = changedEvent.newValue;
    }
}
