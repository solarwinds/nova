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
import _pull from "lodash/pull";

import { IChipsGroup, IChipsItem, IChipsItemsSource } from "@nova-ui/bits";

const horizontalFlatItems: IChipsItem[] = [
    { id: "flatId1", label: "Down" },
    { id: "flatId2", label: "Critical" },
    { id: "flatId3", label: "Warning" },
    { id: "flatId4", label: "Unknown" },
    { id: "flatId5", label: "Ok" },
];

const groupedItems: IChipsGroup[] = [
    {
        id: "statusGroupId",
        label: "Status",
        items: [
            { id: "statusGroupItem1", label: "Down" },
            { id: "statusGroupItem2", label: "Critical" },
            { id: "statusGroupItem3", label: "Warning" },
            { id: "statusGroupItem4", label: "Unknown" },
            { id: "statusGroupItem5", label: "Ok" },
        ],
    },
    {
        id: "vendorGroupId",
        label: "Vendor",
        items: [
            { id: "vendorGroupItem1", label: "Cisco" },
            { id: "vendorGroupItem2", label: "Hewlett Packard" },
            { id: "vendorGroupItem3", label: "Uniper" },
        ],
    },
];

const verticalFlatItemsVisual: IChipsItem[] = [
    { id: "flatId1", label: "Down" },
    { id: "flatId2", label: "Critical" },
    { id: "flatId3", label: "Warning" },
    { id: "flatId4", label: "Unknown" },
    { id: "flatId5", label: "Ok" },
];

@Component({
    selector: "nui-chips-visual-test",
    templateUrl: "./chips-visual-test.component.html",
})
export class ChipsVisualTestComponent {
    public horizontalFlatItemsSource: IChipsItemsSource = {
        flatItems: horizontalFlatItems,
    };
    public horizontalGroupedItemsSource = {
        groupedItems: _cloneDeep(groupedItems),
    };
    public verticalFlatItemsSource: IChipsItemsSource = {
        flatItems: verticalFlatItemsVisual,
    };
    public verticalGroupedItemsSource: IChipsItemsSource = {
        groupedItems: _cloneDeep(groupedItems),
    };

    public onClear(event: { item: IChipsItem }): void {
        _pull(this.horizontalFlatItemsSource.flatItems || [], event.item);
    }

    public onClearGroup(event: {
        item: IChipsItem;
        group?: IChipsGroup;
    }): void {
        _pull(event.group?.items || [], event.item);
    }

    public onClearAll(): void {
        this.verticalGroupedItemsSource.groupedItems = [];
    }
}
