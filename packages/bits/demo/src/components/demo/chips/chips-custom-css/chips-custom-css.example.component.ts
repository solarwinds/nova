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

import { Component, ViewEncapsulation } from "@angular/core";
import _pull from "lodash/pull";

import { IChipRemoved, IChipsItem, IChipsItemsSource } from "@nova-ui/bits";

@Component({
    selector: "nui-chips-custom-css-example",
    templateUrl: "./chips-custom-css.example.component.html",
    styleUrls: ["chips-custom-css.example.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class ChipsCustomCssExampleComponent {
    public standaloneChips: Array<IChipsItem & any> = [
        {
            id: "standaloneChip1",
            label: "Custom Critical",
            customClass: [
                "standalone-chip-custom-styles",
                "custom-chip-critical",
            ],
            icon: "severity_critical",
        },
        {
            id: "standaloneChip2",
            label: "Custom Warning",
            customClass: [
                "standalone-chip-custom-styles",
                "custom-chip-warning",
            ],
            icon: "severity_warning",
        },
        {
            id: "standaloneChip3",
            label: "Custom Info",
            customClass: ["standalone-chip-custom-styles", "custom-chip-info"],
            icon: "severity_info",
        },
        {
            id: "statusGroupItem5",
            label: "Disabled",
            customClass: [
                "standalone-chip-custom-styles",
                "custom-chip-disabled",
            ],
            icon: "severity_unknown",
        },
    ];

    public nuiChipsSet: IChipsItemsSource = {
        flatItems: [
            {
                id: "flatId2",
                label: "Critical",
                customClass:
                    "nui-tag-critical nui-tag-with-hover-styles nui-tag-text-light",
            },
            {
                id: "flatId3",
                label: "Warning",
                customClass: "nui-tag-warning nui-tag-with-hover-styles",
            },
            {
                id: "flatId4",
                label: "Info",
                customClass:
                    "nui-tag-info nui-tag-with-hover-styles nui-tag-text-light",
            },
            {
                id: "flatId5",
                label: "Ok",
                customClass:
                    "nui-tag-ok nui-tag-with-hover-styles nui-tag-text-light",
            },
        ],
        groupedItems: [
            {
                id: "statusGroupId",
                label: "Grouped Statuses",
                items: [
                    {
                        id: "statusGroupItem2",
                        label: "Critical",
                        customClass:
                            "nui-tag-critical nui-tag-with-hover-styles nui-tag-text-light",
                    },
                    {
                        id: "statusGroupItem3",
                        label: "Warning",
                        customClass:
                            "nui-tag-warning nui-tag-with-hover-styles",
                    },
                    {
                        id: "statusGroupItem4",
                        label: "Unknown",
                    },
                    {
                        id: "statusGroupItem5",
                        label: "Ok",
                        customClass:
                            "nui-tag-ok nui-tag-with-hover-styles nui-tag-text-light",
                    },
                ],
            },
        ],
    };

    public widthChips: Array<IChipsItem & any> = [
        {
            id: "widthChip1",
            label: "Chip with default width and very very very very very very very long title ",
        },
        {
            id: "widthChip2",
            label: "Chip with unset width and a very very very very very very very long title ",
            customClass: "unlimited-width",
        },
    ];

    public onClear(event: IChipRemoved): void {
        const source = event.group
            ? this.nuiChipsSet.groupedItems?.find(
                  (group) => group.id === event.group?.id
              )?.items
            : this.nuiChipsSet.flatItems;
        _pull(source || [], event.item);
    }

    public onClearAll(): void {
        this.nuiChipsSet.flatItems = [];
        this.nuiChipsSet.groupedItems = [];
    }
}
