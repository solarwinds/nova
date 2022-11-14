// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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

    public handlePresetSelection(presetKey: string): void {
        this.selectedPresetKey = presetKey;
        if (presetKey) {
            this.selectedValue = +this.selectedPresetKey;
        }
    }

    public handleCustomSelection(num: number): void {
        if (Object.keys(this.presets).indexOf(num.toString()) !== -1) {
            this.selectedPresetKey = num.toString();
        } else {
            this.selectedPresetKey = undefined;
        }
        this.selectedValue = num;
    }

    public getTextboxValue(): number {
        return +(this.selectedPresetKey || "") || this.selectedValue;
    }
}
