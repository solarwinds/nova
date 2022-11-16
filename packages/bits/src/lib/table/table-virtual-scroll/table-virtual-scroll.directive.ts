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

import {
    VirtualScrollStrategy,
    VIRTUAL_SCROLL_STRATEGY,
} from "@angular/cdk/scrolling";
import { Directive, forwardRef, Input, OnChanges } from "@angular/core";

import { ComponentChanges } from "../../../types";
import {
    TableVirtualScrollLinearStrategy,
    // eslint-disable-next-line import/no-deprecated
    TableVirtualScrollStrategy,
} from "./table-virtual-scroll-strategy";

export const DEFAULT_TABLE_HEADER_OFFSET = 40;
export const TABLE_ROW_HEIGHT = 24;

export function complexScrollStrategyFactory(
    scroll: TableVirtualScrollDirective | TableVirtualScrollLinearDirective
): VirtualScrollStrategy {
    return scroll.scrollStrategy;
}

@Directive({
    selector: "[tableVirtualScroll]:not([offset])",
    providers: [
        {
            provide: VIRTUAL_SCROLL_STRATEGY,
            useFactory: complexScrollStrategyFactory,
            deps: [forwardRef(() => TableVirtualScrollLinearDirective)],
        },
    ],
})
export class TableVirtualScrollLinearDirective implements OnChanges {
    /** Height of table row. */
    @Input() rowHeight: number = TABLE_ROW_HEIGHT;

    /** Number of rows loaded into memory */
    @Input() rowCount: number;

    // Converting parameters to numbers here to avoid inputs become strings in case user sets rowHeight and offset
    // without square brackets in the template
    public scrollStrategy = new TableVirtualScrollLinearStrategy(
        +this.rowHeight
    );

    public ngOnChanges(
        changes: ComponentChanges<TableVirtualScrollLinearDirective>
    ): void {
        this.scrollStrategy.setRowHeight(+this.rowHeight);

        if (changes.rowCount) {
            this.updateDataLength(this.rowCount);
        }
    }

    /**
     * Updates the size of the items in the virtually scrolling list.
     * @param length
     */
    public updateDataLength(length: number): void {
        this.scrollStrategy.setDataLength(length);
    }
}

/**
 * @deprecated in v11 - Use tableVirtualScroll with 'rowCount' attribute instead of 'offset' attribute - Removal: NUI-5796
 */
@Directive({
    selector: "[tableVirtualScroll]:not([rowCount])",
    providers: [
        {
            provide: VIRTUAL_SCROLL_STRATEGY,
            useFactory: complexScrollStrategyFactory,
            deps: [forwardRef(() => TableVirtualScrollDirective)],
        },
    ],
})
export class TableVirtualScrollDirective implements OnChanges {
    /** Height of table row. */
    @Input() rowHeight: number = TABLE_ROW_HEIGHT;

    /**  Space to be saved for the header. Will be assigned to headerOffset value inside custom strategy */
    @Input() offset: number = DEFAULT_TABLE_HEADER_OFFSET;

    // Converting parameters to numbers here to avoid inputs become strings in case user sets rowHeight and offset
    // without square brackets in the template
    // eslint-disable-next-line import/no-deprecated
    public scrollStrategy = new TableVirtualScrollStrategy(
        +this.rowHeight,
        +this.offset
    );

    public ngOnChanges(): void {
        this.scrollStrategy.setScrollHeight(+this.rowHeight, +this.offset);
    }

    /**
     * Updates the size of the items in the virtually scrolling list.
     * @param length
     */
    public updateDataLength(length: number): void {
        this.scrollStrategy.setDataLength(length);
    }

    public setMaxItems(maxItems: number): void {
        this.scrollStrategy.maxItems = maxItems;
    }
}
