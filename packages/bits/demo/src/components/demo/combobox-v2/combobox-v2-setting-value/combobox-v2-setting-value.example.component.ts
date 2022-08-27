import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
    selector: "nui-combobox-v2-setting-value-example",
    templateUrl: "combobox-v2-setting-value.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2SettingValueExampleComponent implements OnInit {
    public items = Array.from({ length: 50 }).map(
        (_, i) => $localize`Item ${i}`
    );
    public comboboxControl: FormControl = new FormControl();

    ngOnInit(): void {
        this.comboboxControl.setValue(this.items[1]);
    }
}
