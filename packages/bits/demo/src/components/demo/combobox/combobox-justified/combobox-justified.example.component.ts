import { Component } from "@angular/core";

@Component({
    selector: "nui-combobox-justified-example",
    templateUrl: "./combobox-justified.example.component.html",
})
export class ComboboxJustifiedExampleComponent {
    public dataset = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
    };
}
