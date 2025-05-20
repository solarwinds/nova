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
    public comboboxControl = new FormControl<string | null>(null);

    public displayFn(item: any): string {
        return item?.name || "";
    }
}
