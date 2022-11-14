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

import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
    selector: "nui-combobox-v2-options-changed-example",
    templateUrl: "combobox-v2-options-changed.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2OpitionsChangedExampleComponent implements OnInit {
    public items: string[] = [];
    public multiselectItems: string[] = [];
    private itemSet = [
        [
            $localize`Item 1`,
            $localize`Item 2`,
            $localize`Item 3`,
            $localize`Item 4`,
        ],
        [
            $localize`Item 3`,
            $localize`Item 4`,
            $localize`Item 5`,
            $localize`Item 6`,
        ],
    ];
    public comboboxControl = new FormControl();
    public multiselectControl = new FormControl();

    public ngOnInit(): void {
        this.items = this.itemSet[0];
        this.multiselectItems = this.itemSet[0];
    }

    public setItems(i: number): void {
        this.items = this.itemSet[i];
    }

    public setMultiselectItems(i: number): void {
        this.items = this.itemSet[i];
    }

    public convertToChip(value: string): { label: string } {
        return { label: value };
    }
}
