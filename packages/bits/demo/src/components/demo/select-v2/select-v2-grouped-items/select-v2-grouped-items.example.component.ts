import { Component } from "@angular/core";
import { ISelectGroup } from "@nova-ui/bits";

const getRandomNumberTo = (max: number) => Math.floor(Math.random() * Math.floor(max) + 1);

@Component({
    selector: "nui-select-v2-grouped-items-example",
    templateUrl: "select-v2-grouped-items.example.component.html",
    host: { class: "select-container" },
})
export class SelectV2GroupedItemsExampleComponent {
    public items: ISelectGroup[] = Array.from({ length: 10 }).map((_, i) => ({
        header: $localize `Header line ${i + 1}`,
        items: Array.from({ length: getRandomNumberTo(5) }).map((v, n) => ({
            id: `value-${i}`,
            name: $localize `Item ${n + 1}`,
        })),
    }));
}
