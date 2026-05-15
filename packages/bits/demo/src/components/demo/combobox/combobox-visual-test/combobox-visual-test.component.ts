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
import _cloneDeep from "lodash/cloneDeep";

import { ISelectChangedEvent } from "@nova-ui/bits";

@Component({
    selector: "combobox-visual-test",
    templateUrl: "./combobox-visual-test.component.html",
    standalone: false,
})
export class ComboboxVisualTestComponent implements OnInit {
    public isRequired: boolean = true;
    public errorState: boolean = true;
    public dataset = {
        items: [
            "Item 1",
            "Item 2",
            "Item 3",
            "Item 4",
            "Item 5",
            "Item 6",
            "Item 7",
            "Item 8",
            "Item 9",
            "Item 10",
        ],
        selectedItem: "",
    };
    public datasetInGroups = {
        itemsInGroups: [
            {
                header: "Group 1 header",
                items: ["Item 111", "Item 211", "Item 311"],
            },
            {
                header: "Group 2 header",
                items: ["Item 112", "Item 212", "Item 312"],
            },
            {
                header: "Group 3 header",
                items: ["Item 113", "Item 213", "Item 313"],
            },
        ],
    };
    public displayedItems = this.datasetInGroups.itemsInGroups;

    public textboxChanged(searchQuery: ISelectChangedEvent<string>): void {
        this.displayedItems = _cloneDeep(this.datasetInGroups.itemsInGroups);
        this.displayedItems.forEach((items) => {
            items.items = items.items.filter((item) =>
                item.includes(searchQuery.newValue)
            );
        });
    }

    public ngOnInit(): void {
        this.isInErrorState();
    }

    public valueChange(changedEvent: ISelectChangedEvent<string>): void {
        this.dataset.selectedItem = changedEvent.newValue;
        this.isInErrorState();
    }

    public isInErrorState(): void {
        this.errorState =
            this.isRequired &&
            (!this.dataset.selectedItem ||
                !(
                    this.dataset.items.indexOf(this.dataset.selectedItem) !== -1
                ));
    }
}
