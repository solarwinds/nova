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

import { Component, viewChild } from "@angular/core";
import _pull from "lodash/pull";

import {
    IChipsGroup,
    IChipsItem,
    IChipsItemsSource,
    PopoverComponent,
    PopoverOverlayPosition,
} from "@nova-ui/bits";

const flatItems: IChipsItem[] = [
    { id: "flatId1", label: "Down" },
    { id: "flatId2", label: "Critical" },
    { id: "flatId3", label: "Warning" },
    { id: "flatId1", label: "Down" },
    { id: "flatId2", label: "Critical" },
    { id: "flatId3", label: "Warning" },
    { id: "flatId1", label: "Down" },
    { id: "flatId2", label: "Critical" },
    { id: "flatId3", label: "Warning" },
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

@Component({
    selector: "nui-chips-overflow-example",
    templateUrl: "./chips-overflow.example.component.html",
    styles: [
        `
            .nui-chips-overflowed__counter {
                margin-left: 3px;
                display: inline-flex;
            }
        `,
    ],
    standalone: false,
})
export class ChipsOverflowExampleComponent {
    public horizontalGroupedItemsSource = { flatItems, groupedItems };

    public overflowLinesNumber = 2;
    public overflowCounter: number;
    public overflowSource: IChipsItemsSource;
    public overflowPopoverPosition: PopoverOverlayPosition[] = [
        PopoverOverlayPosition.bottomLeft,
        PopoverOverlayPosition.topLeft,
    ];

    private readonly popover = viewChild.required(PopoverComponent);

    public onClear(event: { item: IChipsItem; group?: IChipsGroup }): void {
        console.log(
            `'onClear' event fired. $event.item.id=${event.item.id} $event.group.id=${event.group?.id}`
        );
        if (event.group) {
            _pull(event.group.items || [], event.item);
        } else {
            _pull(
                this.horizontalGroupedItemsSource.flatItems || [],
                event.item
            );
        }
    }

    public onClearAll(e: MouseEvent): void {
        this.horizontalGroupedItemsSource.groupedItems = [];
        this.horizontalGroupedItemsSource.flatItems = [];
        this.popover()?.onClick(e);
    }

    onChipsOverflow(source: IChipsItemsSource): void {
        this.overflowSource = source;
        const reducer = (accumulator: number, currentValue: IChipsGroup) =>
            accumulator + currentValue.items.length;
        this.overflowCounter =
            (this.overflowSource.flatItems?.length || 0) +
            (this.overflowSource.groupedItems?.reduce(reducer, 0) || 0);
        this.popover()?.updatePosition();
    }
}
