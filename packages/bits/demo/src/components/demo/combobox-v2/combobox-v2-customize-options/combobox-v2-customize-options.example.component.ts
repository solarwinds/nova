import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";

interface IExampleItem {
    id: string;
    name: string;
    icon: string;
}
@Component({
    selector: "nui-combobox-v2-customize-options-example",
    templateUrl: "combobox-v2-customize-options.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2CustomizeOptionsExampleComponent {
    public icons: any[] = ["check", "email", "execute"];
    public items: IExampleItem[] = Array.from({ length: 100 }).map((_, i) => ({
        id: `value-${i}`,
        name: $localize`Item ${i}`,
        icon: this.getRandomIcon(),
    }));
    public comboboxControl = new FormControl();

    public displayFn(item: IExampleItem): string {
        return item?.name || "";
    }

    private getRandomIcon() {
        return this.icons[Math.round(Math.random() * 2)];
    }
}
