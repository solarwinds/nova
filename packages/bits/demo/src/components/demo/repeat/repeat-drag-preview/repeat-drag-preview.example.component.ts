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

import { IItemsReorderedEvent, IRepeatItem } from "@nova-ui/bits";

interface IRepeatCompanyItem extends IRepeatItem {
    name: string;
    disabled?: boolean;
    preview?: string;
}

@Component({
    selector: "nui-repeat-drag-preview-example",
    templateUrl: "./repeat-drag-preview.example.component.html",
    styleUrls: ["./repeat-drag-preview.example.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class RepeatDragPreviewExampleComponent {
    public companies: IRepeatCompanyItem[] = [
        {
            name: "Adobe",
            preview:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adobe_Systems_logo_and_wordmark.svg/524px-Adobe_Systems_logo_and_wordmark.svg.png",
        },
        {
            name: "IBM",
            preview:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/800px-IBM_logo.svg.png",
        },
        {
            name: "Dell",
            preview:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/300px-Dell_Logo.svg.png",
        },
        {
            name: "Microsoft",
            preview:
                "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        },
    ];

    public onItemsReordered(
        event: IItemsReorderedEvent<IRepeatCompanyItem>
    ): void {
        // update items according to the new order
        this.companies = event.currentState;
    }
}
