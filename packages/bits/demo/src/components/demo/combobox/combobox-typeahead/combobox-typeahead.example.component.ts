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
import _cloneDeep from "lodash/cloneDeep";

import { ISelectChangedEvent, ISelectGroup } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-typeahead-example",
    templateUrl: "./combobox-typeahead.example.component.html",
    standalone: false
})
export class ComboboxTypeaheadExampleComponent {
    public dataset: ISelectGroup[] = [
        {
            header: "Group 1 header",
            items: [
                { label: "Item 111", value: "Value 1" },
                { label: "Item 112", value: "Value 2" },
                { label: "Item 123", value: "Value 3" },
            ],
        },
        {
            header: "Group 2 header",
            items: [
                { label: "Item 111", value: "Value 5" },
                { label: "Item 212", value: "Value 6" },
                { label: "Item 312", value: "Value 7" },
            ],
        },
        {
            header: "Group 3 header",
            items: [
                { label: "Item 456", value: "Value 7" },
                { label: "Item 345", value: "Value 8" },
                { label: "Item 414", value: "Value 9" },
            ],
        },
    ];
    public displayedItems = this.dataset;

    public textboxChanged(searchQuery: ISelectChangedEvent<any>): void {
        // searchQuery.newValue.label is necessary, since combobox can emit event with 2 possible values:
        // either string or complex object ({label: x, value: y} in this case). Users should be careful dealing with this emitters
        // and handle them properly.
        const val = searchQuery?.newValue?.toLowerCase();
        const label = searchQuery?.newValue?.label?.toLowerCase();
        this.displayedItems = _cloneDeep(this.dataset);
        this.displayedItems.forEach((group) => {
            group.items = group.items.filter((item) => {
                const itemLabel = item.label.toLowerCase();
                return itemLabel.includes(val) || itemLabel.includes(label);
            });
        });
    }
}
