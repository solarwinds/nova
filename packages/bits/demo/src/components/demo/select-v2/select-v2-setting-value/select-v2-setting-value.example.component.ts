import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
    selector: "nui-select-v2-setting-value-example",
    templateUrl: "select-v2-setting-value.example.component.html",
    host: { class: "select-container" },
})
export class SelectV2SettingValueExampleComponent implements OnInit {
    public items = Array.from({ length : 50 }).map((_, i) => $localize `Item ${i}`);
    public selectControl: FormControl = new FormControl();

    ngOnInit(): void {
        this.selectControl.setValue(this.items[1]);
    }
}
