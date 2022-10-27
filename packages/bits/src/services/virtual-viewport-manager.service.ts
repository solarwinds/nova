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

import { ListRange } from "@angular/cdk/collections";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { Injectable } from "@angular/core";
import isUndefined from "lodash/isUndefined";
import { merge, MonoTypeOperatorFunction, Observable, of } from "rxjs";
import { filter, map, takeWhile, tap } from "rxjs/operators";

import { IFilter, IFilterPub } from "./data-source/public-api";
import { IVirtualPageConfig, IVirtualViewportResetOptions } from "./public-api";

/** @ignore */
const DEFAULT_RANGE: ListRange = { start: 0, end: 0 };

/**
 * <example-url>./../examples/index.html#/common/virtual-viewport-manager</example-url>
 */
@Injectable()
export class VirtualViewportManager implements IFilterPub {
    private _viewportRef: CdkVirtualScrollViewport;
    private _currentPageRange: ListRange = DEFAULT_RANGE;
    private _pageSize: number;

    /**
     * Entry point for VirtualViewportManager
     * @param  viewportRef - CDK Viewport reference on which you want to perform observations
     * @returns self (VirtualViewportManager)
     */
    public setViewport(
        viewportRef: CdkVirtualScrollViewport
    ): VirtualViewportManager {
        if (this._viewportRef) {
            throw new Error("Viewport is already set");
        }
        if (!viewportRef) {
            throw new Error("Invalid viewport provided");
        }

        this._viewportRef = viewportRef;

        this.checkViewportUntilValid();

        return this;
    }

    public get currentPageRange(): Readonly<ListRange> {
        return this._currentPageRange;
    }

    /**
     * Observes the changes of viewport and emits when current range has been rendered
     * and a new one should be loaded
     * @param  config accepts and IVirtualPageConfig which contains page observer's configuration
     * It is requiring pageSize prop to be set to delegate responsibility of pagination to ViewportManager
     * @returns Stream of pages with fixed size
     */
    public observeNextPage$(config: IVirtualPageConfig): Observable<ListRange> {
        if (!this._viewportRef) {
            throw new Error("Please provide the viewport");
        }

        this._pageSize = config.pageSize;

        this.updateCurrentPage({ start: 0, end: config.pageSize });

        // Note: renderedRangeStream does not emit "first page" which can be a problem
        const streamParticipants: Observable<ListRange>[] = [
            this._viewportRef.renderedRangeStream,
        ];
        const shouldEmitFirstPage = !isUndefined(config.emitFirstPage)
            ? config.emitFirstPage
            : true;
        if (shouldEmitFirstPage) {
            streamParticipants.push(of(this.currentPageRange));
        }

        return merge(...streamParticipants).pipe(
            this.mapToPageSize(config.pageSize)
        );
    }

    public getFilters(): IFilter<ListRange> {
        return {
            type: "virtualScroll",
            value: this.currentPageRange,
        };
    }

    /**
     * Resetting viewportManager to initial state
     * @param  options In case VirtualViewportManager is used along with filters (sorting, search...)
     * we can prevent default behaviour of emitting firstPageEvent and let user to set first batch of data
     * @returns void
     */
    public reset(
        options: IVirtualViewportResetOptions = { emitFirstPage: true }
    ): void {
        if (!this._viewportRef) {
            // Note: If there is no viewportRef or it been invoked
            // prematurely we will suppress that method call;
            return;
        }

        // Note: Since we're relying on Viewport's renderedRangeStream
        // we need to scroll on top to be reset the stream to it's starting point
        this._viewportRef.scrollToOffset(0);
        // Note: Setting the end value equal to pageSize to avoid ViewportManager
        // incrementing the current page and emitting first page event
        this._currentPageRange = {
            ...DEFAULT_RANGE,
            end: options.emitFirstPage ? 0 : this._pageSize,
        };
        // Note: Skipping one tick to let CDK Viewport update his internal properties
        setTimeout(() => {
            // Note: Resetting the viewport to initial state
            this._viewportRef.setRenderedRange(DEFAULT_RANGE);
            this._viewportRef.checkViewportSize();
        });
    }

    private updateCurrentPage(range: ListRange): ListRange {
        return (this._currentPageRange = range);
    }

    // Note: Temporary fix related to the CDK Viewport bug
    // https://github.com/angular/components/issues/15622
    // To ensure that CDK Viewport got correct parameters
    // we recheck the viewport size if it is equal to 0
    private checkViewportUntilValid(): void {
        this._viewportRef
            .elementScrolled()
            .pipe(
                takeWhile(() => this._viewportRef.getViewportSize() === 0),
                tap(() => this._viewportRef.checkViewportSize())
            )
            .subscribe();
    }

    protected mapToPageSize(
        pageSize: number
    ): MonoTypeOperatorFunction<ListRange> {
        return (source: Observable<ListRange>) =>
            source.pipe(
                // Note: We have to reduce number of events to only pagination related,
                // By emitting only when previous page range was scrolled to the end
                filter(
                    (renderedRange: ListRange) =>
                        this.currentPageRange.end <= renderedRange.end
                ),
                map((range, index) => {
                    // Note: Avoiding incrementation for the first emission
                    if (index === 0) {
                        return this.currentPageRange;
                    }
                    return this.updateCurrentPage({
                        start: this.currentPageRange.end,
                        end: this.currentPageRange.end + pageSize,
                    });
                })
            );
    }
}
