import { Component } from "@angular/core";

import { IQuickPickPresetDictionary } from "@nova-ui/bits";

@Component({
    selector: "nui-quick-picker-basic",
    templateUrl: "./quick-picker-basic.example.component.html",
})
export class QuickPickerBasicExampleComponent {
    public presets: IQuickPickPresetDictionary = {
        "99": {
            name: "99-th percentile",
        },
        "95": {
            name: "95-th percentile",
        },
        "80": {
            name: "80-th percentile",
        },
    };
    public presetKeysOrder = ["95", "99", "80"];
    public selectedPresetKey?: string = "95";
    public selectedValue: number = +(this.selectedPresetKey || "");
    public handlePresetSelection(presetKey: string) {
        this.selectedPresetKey = presetKey;
        if (presetKey) {
            this.selectedValue = +this.selectedPresetKey;
        }
    }
    public handleCustomSelection(num: number) {
        if (Object.keys(this.presets).indexOf(num.toString()) !== -1) {
            this.selectedPresetKey = num.toString();
        } else {
            this.selectedPresetKey = undefined;
        }
        this.selectedValue = num;
    }

    public getTextboxValue() {
        return +(this.selectedPresetKey || "") || this.selectedValue;
    }
}
