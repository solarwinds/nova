import { Component } from "@angular/core";

@Component({
    selector: "nui-combobox-clear-example",
    templateUrl: "./combobox-clear.example.component.html",
})
export class ComboboxClearExampleComponent {
    public dataset = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
    };
}
