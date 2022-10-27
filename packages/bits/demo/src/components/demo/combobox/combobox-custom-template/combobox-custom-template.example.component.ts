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

import { ISelectChangedEvent } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-custom-template-example",
    templateUrl: "./combobox-custom-template.example.component.html",
    styleUrls: ["./combobox-custom-template.example.component.less"],
})
export class ComboboxCustomTemplateExampleComponent {
    public dataset = {
        displayValue: "value",
        selectedItem: "",
        items: [
            {
                name: "item_1",
                value: "Bonobo 112",
                icon: "severity_ok",
                progress: 78,
            },
            {
                name: "item_2",
                value: "Zelda 113",
                icon: "severity_ok",
                progress: 66,
            },
            {
                name: "item_3",
                value: "Max 123",
                icon: "severity_critical",
                progress: 7,
            },
            {
                name: "item_4",
                value: "Apple 234",
                icon: "severity_ok",
                progress: 24,
            },
            {
                name: "item_5",
                value: "Quartz 124",
                icon: "severity_warning",
                progress: 89,
            },
        ],
    };
    public displayedItems = this.dataset.items;

    constructor() {}

    public textboxChanged(searchQuery: ISelectChangedEvent<string>) {
        this.displayedItems = _cloneDeep(this.dataset.items);
        this.displayedItems = this.displayedItems.filter((item: any) =>
            item.value.includes(searchQuery.newValue)
        );
    }
}
