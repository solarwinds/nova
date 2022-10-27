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

import {
    IItemsReorderedEvent,
    IRepeatItem,
    IRepeatItemConfig,
} from "@nova-ui/bits";

interface IRepeatColorItem extends IRepeatItem {
    color: string;
    description: string;
}

@Component({
    selector: "nui-repeat-reorder-config-example",
    templateUrl: "./repeat-reorder-item-config-example.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class RepeatReorderItemConfigExampleComponent {
    public colors: IRepeatColorItem[] = [
        { color: $localize`blue`, description: "Should be draggable" },
        { color: $localize`green`, description: "Disabled with callback" },
        {
            color: $localize`yellow`,
            disabled: true,
            description: "Disabled with property",
        },
        {
            color: $localize`orange`,
            disabled: false,
            description: "Enabled with property",
        },
    ];

    public draggable: boolean = true;
    public reorderable: boolean = true;

    public itemConfig: IRepeatItemConfig<IRepeatColorItem> = {
        isDraggable: (item) =>
            item.color === $localize`blue` || item.color === $localize`orange`,
        // Note: Using both cases to check if item is disabled, normally we should use only one method
        isDisabled: (item) => item.color === $localize`green` || item.disabled,
        trackBy: (index, item) => item.color,
    };

    public onItemsReordered(
        event: IItemsReorderedEvent<IRepeatColorItem>
    ): void {
        this.colors = event.currentState;
    }
}
