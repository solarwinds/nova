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

import { IItemsReorderedEvent } from "@nova-ui/bits";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
interface ISortingOrderTrimmedData
    extends Omit<IItemsReorderedEvent, "item" | "dropListRef"> {}
@Component({
    selector: "nui-repeat-reorder-simple-example",
    templateUrl: "./repeat-reorder-simple-example.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class RepeatReorderSimpleExampleComponent {
    public companies: string[] = ["Adobe", "IBM", "Dell", "Microsoft"];

    public draggable: boolean = true;
    public reorderable: boolean = true;
    public droppedEventData: ISortingOrderTrimmedData;

    public onItemsReordered(event: IItemsReorderedEvent<string>): void {
        // update items according to the new order
        this.companies = event.currentState;

        // copy all event proprieties except the CdkDrag & CdkDropList references
        const { item, dropListRef, ...rest } = event;
        this.droppedEventData = rest;

        console.log(event);
    }
}
