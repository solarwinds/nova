import { Component, OnInit } from "@angular/core";
import { ISelectChangedEvent } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-required-example",
    templateUrl: "./combobox-required.example.component.html",
})
export class ComboboxRequiredExampleComponent implements OnInit {
    public isRequired: boolean = true;
    public errorState: boolean = true;
    public dataset = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        selectedItem: "",
    };

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
