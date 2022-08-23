import { Component } from "@angular/core";

@Component({
    selector: "nui-combobox-inline-example",
    templateUrl: "combobox-inline.example.component.html",
})
export class ComboboxInlineExampleComponent {
    public dataset = {
        itemsSource1: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        itemsSource2: ["Item 6", "Item 7", "Item 8", "Item 9", "Item 10"],
    };
}
