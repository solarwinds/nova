import { Component } from "@angular/core";

interface IExampleItem {
    name: string;
    disabled: boolean;
}

@Component({
    selector: "nui-select-v2-disabled-example",
    templateUrl: "./select-v2-disabled.example.component.html",
    host: { class: "select-container" },
})
export class SelectV2DisabledExampleComponent {
    public items: IExampleItem[] = Array.from({ length: 100 }).map((_, i) => ({
        name: $localize`Item ${i}`,
        disabled: Boolean(Math.round(Math.random())),
    }));
    public isSelectDisabled = false;
}
