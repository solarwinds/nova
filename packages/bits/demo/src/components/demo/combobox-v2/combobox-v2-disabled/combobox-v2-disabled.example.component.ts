import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";

interface IExampleItem {
    id: string;
    name: string;
    disabled: boolean;
}
@Component({
    selector: "nui-combobox-v2-disabled-example",
    templateUrl: "combobox-v2-disabled.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2DisabledExampleComponent {
    public items: IExampleItem[] = Array.from({ length: 100 }).map((_, i) =>
        ({
            id: `value-${i}`,
            name: $localize `Item ${i}`,
            disabled: Boolean(Math.round(Math.random())),
        }));
    public comboboxControl = new FormControl();
    public isComboboxDisabled = false;

    public displayFn(item: IExampleItem): string {
        return item?.name || "";
    }
}
