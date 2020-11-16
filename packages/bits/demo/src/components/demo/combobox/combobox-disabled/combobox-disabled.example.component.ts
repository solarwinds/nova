import { Component } from "@angular/core";

@Component({
    selector: "nui-combobox-disabled-example",
    templateUrl: "./combobox-disabled.example.component.html",
})
export class ComboboxDisabledExampleComponent {
    public dataset = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        selectedItem: "",
    };
}
