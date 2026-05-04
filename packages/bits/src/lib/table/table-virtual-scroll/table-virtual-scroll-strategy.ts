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
    CdkVirtualScrollViewport,
    VirtualScrollStrategy,
} from "@angular/cdk/scrolling";
import { Observable, Subject } from "rxjs";
import { distinctUntilChanged } from "rxjs/operators";

export class TableVirtualScrollLinearStrategy implements VirtualScrollStrategy {
    private readonly indexChange = new Subject<number>();

    private viewport?: CdkVirtualScrollViewport;

    /** The size of the items in the virtually scrolling list. */
    private rowCount?: number;

    public scrolledIndexChange: Observable<number>;

    constructor(private rowHeight: number) {
        // giving a contact point, so user can do some stuff of "scrolling" (changing the range)
        this.scrolledIndexChange = this.indexChange
            .asObservable()
            .pipe(distinctUntilChanged());
    }

    public attach(viewport: CdkVirtualScrollViewport): void {
        this.viewport = viewport;
    }

    public detach(): void {
        this.indexChange.complete();
        this.viewport = undefined;
    }

    public onContentScrolled(): void {
        if (this.viewport) {
            this.updateContent(this.viewport);
        }
    }

    public onDataLengthChanged(): void {
        if (this.viewport) {
            this.updateContent(this.viewport);
        }
    }

    public onContentRendered(): void {}

    public onRenderedOffsetChanged(): void {}

    public scrollToIndex(_index: number, _behavior: ScrollBehavior): void {}

    /**
     * Sets the size of the items in the virtually scrolling list.
     * @param length
     */
    public setDataLength(length: number): void {
        this.rowCount = length;
        this.updateViewportDataLength(length);
        this.onDataLengthChanged();
    }

    /**
     * Sets scroll height.
     * @param rowHeight
     */
    public setRowHeight(rowHeight: number): void {
        this.rowHeight = rowHeight;
        if (this.viewport) {
            this.updateContent(this.viewport);
        }
    }

    /**
     * Updates content and emits updated indexes.
     * @param viewport
     */
    private updateContent(viewport: CdkVirtualScrollViewport) {
        if (!viewport) {
            return;
        }

        const rowCount = this.rowCount || 0;
        const renderedRange = viewport.getRenderedRange();
        const newRange = { ...renderedRange };
        const viewportSize = viewport.getViewportSize();
        const scrollOffset = viewport.measureScrollOffset() || 0;
        let firstVisibleIndex = scrollOffset / this.rowHeight || 0;

        // If user scrolls to the bottom of the list and data changes to a smaller list
        // We have to recalculate the first visible index based on new data length and viewport size.
        const maxVisibleItems = Math.ceil(viewportSize / this.rowHeight);

        // We have to recalculate the first visible index based on new data length and viewport size.
        firstVisibleIndex = Math.max(
            0,
            Math.min(firstVisibleIndex, rowCount - maxVisibleItems)
        );
        // We must update scroll offset to handle start/end buffers
        // Current range must also be adjusted to cover the new position (bottom of new list).
        newRange.start = Math.floor(firstVisibleIndex);

        newRange.end = Math.max(
            0,
            Math.min(rowCount, newRange.start + maxVisibleItems)
        );

        viewport.setRenderedRange(newRange);
        this.indexChange.next(Math.floor(firstVisibleIndex));
    }

    private updateViewportDataLength(rowCount: number): void {
        if (!this.viewport) {
            return;
        }
        // Note: Updating _dataLength property of cdk-viewport to maintain default functionalities (getDataLength())
        // of the cdk-viewport also with the table. Originally this property is updated by
        // the VirtualFor listener while we're using it unconventionally we should take care of this property ourselves
        // Ref: https://github.com/angular/components/blob/9.2.x/src/cdk/scrolling/virtual-scroll-viewport.ts#L227
        this.viewport["_dataLength"] = rowCount;
    }
}

/**
 * @deprecated in v11 - Use TableVirtualScrollLinearStrategy instead - Removal: NUI-5796
 */
export class TableVirtualScrollStrategy implements VirtualScrollStrategy {
    private readonly indexChange = new Subject<number>();

    private viewport: CdkVirtualScrollViewport;

    public scrolledIndexChange: Observable<number>;

    /** Buffer for items before needing to render more items. */
    private bufferSize = 5;

    /** The size of the items in the virtually scrolling list. */
    private itemsSize = 0;

    private _maxItems: number;

    public set maxItems(maxItems: number) {
        this._maxItems = isNaN(maxItems) ? 10 : +maxItems;
    }

    public get maxItems(): number {
        return this._maxItems;
    }

    constructor(private rowHeight: number, private headerOffset: number) {
        // giving a contact point, so user can do some stuff of "scrolling" (changing the range)
        this.scrolledIndexChange = this.indexChange
            .asObservable()
            .pipe(distinctUntilChanged());
    }

    public attach(viewport: CdkVirtualScrollViewport): void {
        this.viewport = viewport;
        this.viewport.setTotalContentSize(this.maxItems * this.rowHeight);
    }

    public detach(): void {
        this.indexChange.complete();
        // @ts-ignore: Keeping previous behavior
        this.viewport = null;
    }

    public onContentScrolled(): void {
        this.updateContent(this.viewport);
    }

    public onDataLengthChanged(): void {
        if (this.viewport) {
            this.updateContent(this.viewport);
        }
    }

    public onContentRendered(): void {}

    public onRenderedOffsetChanged(): void {}

    public scrollToIndex(_index: number, _behavior: ScrollBehavior): void {}

    /**
     * Sets the size of the items in the virtually scrolling list.
     * @param length
     */
    public setDataLength(length: number): void {
        this.itemsSize = length;
        this.onDataLengthChanged();
    }

    /**
     * Sets scroll height.
     * @param rowHeight
     * @param headerOffset
     */
    public setScrollHeight(rowHeight: number, headerOffset: number): void {
        this.rowHeight = rowHeight;
        this.headerOffset = headerOffset;
        this.updateContent(this.viewport);
    }

    /**
     * Updates content and emits updated indexes.
     * @param viewport
     */
    private updateContent(viewport: CdkVirtualScrollViewport) {
        if (viewport) {
            // Measuring the new scroll index.
            const newIndex = Math.max(
                0,
                Math.round(viewport.measureScrollOffset() / this.rowHeight)
            );

            const start = newIndex;
            const end = newIndex + this.maxItems;

            viewport.setRenderedRange({ start, end });

            this.indexChange.next(newIndex);
        }
    }
}
