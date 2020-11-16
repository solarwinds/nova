import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";

interface IExampleItem {
    id: string;
    name: string;
    icon: string;
}

@Component({
    selector: "nui-select-v2-customize-options-example",
    templateUrl: "select-v2-customize-options.example.component.html",
    host: { class: "select-container" },
})
export class SelectV2CustomizeOptionsExampleComponent {
    public icons: any[] = ["check", "email", "execute"];
    public items: IExampleItem[] = Array.from({ length: 100 }).map((_, i) =>
        ({
            id: `value-${i}`,
            name: $localize `Item ${i}`,
            icon: this.getRandomIcon(),
        }));
    public selectControl = new FormControl();

    private getRandomIcon() {
        return this.icons[Math.round(Math.random() * 2)];
    }
}
