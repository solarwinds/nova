import { Component } from "@angular/core";
import { ISelectChangedEvent } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-icon-example",
    templateUrl: "./combobox-icon.example.component.html",
})
export class ComboboxIconExampleComponent {
    public dataset = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        selectedItem: "Item 1",
    };

    public valueChange(changedEvent: ISelectChangedEvent<string>): void {
        this.dataset.selectedItem = changedEvent.newValue;
    }
}
