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
import _pull from "lodash/pull";

import { IChipsItem, IChipsItemsSource } from "@nova-ui/bits";

const horizontalFlatItems: IChipsItem[] = [
    { id: "flatId1", label: "Down" },
    { id: "flatId2", label: "Critical" },
    { id: "flatId3", label: "Warning" },
    { id: "flatId4", label: "Unknown" },
    { id: "flatId5", label: "Ok" },
];

@Component({
    selector: "nui-basic-chips-example",
    templateUrl: "./basic-chips.example.component.html",
})
export class BasicChipsExampleComponent {
    public horizontalFlatItemsSource: IChipsItemsSource = {
        flatItems: horizontalFlatItems,
    };

    public onClear(event: { item: IChipsItem }): void {
        console.log(`'onClear' event fired. $event.item.id=${event.item.id}`);
        _pull(this.horizontalFlatItemsSource.flatItems || [], event.item);
    }

    public onClearAll(): void {
        this.horizontalFlatItemsSource.flatItems = [];
    }
}
