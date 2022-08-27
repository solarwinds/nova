import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";

import { ISelectGroup } from "@nova-ui/bits";

const getRandomNumberTo = (max: number) =>
    Math.floor(Math.random() * Math.floor(max) + 1);

@Component({
    selector: "nui-combobox-v2-grouped-options-example",
    templateUrl: "combobox-v2-grouped-options.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2GroupedOptionsExampleComponent {
    public items: ISelectGroup[] = Array.from({ length: 10 }).map((_, i) => ({
        header: $localize`Header line ${i + 1}`,
        items: Array.from({ length: getRandomNumberTo(5) }).map((v, n) => ({
            id: `value-${i}`,
            name: $localize`Item ${n + 1}`,
        })),
    }));
    public comboboxControl = new FormControl();

    public displayFn(item: any): string {
        return item?.name || "";
    }
}
