import { Component } from "@angular/core";
import { ISelectChangedEvent } from "@nova-ui/bits";
import _cloneDeep from "lodash/cloneDeep";

@Component({
    selector: "nui-combobox-custom-template-example",
    templateUrl: "./combobox-custom-template.example.component.html",
    styleUrls: [
        "./combobox-custom-template.example.component.less",
    ],
})
export class ComboboxCustomTemplateExampleComponent {
    public dataset = {
        displayValue: "value",
        selectedItem: "",
        items: [
            { name: "item_1", value: "Bonobo 112", icon: "severity_ok", progress: 78 },
            { name: "item_2", value: "Zelda 113", icon: "severity_ok", progress: 66 },
            { name: "item_3", value: "Max 123", icon: "severity_critical", progress: 7 },
            { name: "item_4", value: "Apple 234", icon: "severity_ok", progress: 24 },
            { name: "item_5", value: "Quartz 124", icon: "severity_warning", progress: 89 },
        ],
    };
    public displayedItems = this.dataset.items;

    constructor() { }

    public textboxChanged(searchQuery: ISelectChangedEvent<string>): void {
        this.displayedItems = _cloneDeep(this.dataset.items);
        this.displayedItems = this.displayedItems.filter((item: any) => item.value.includes(searchQuery.newValue));
    }
}
