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

import { Injectable } from "@angular/core";
import { merge } from "rxjs";
import { auditTime, filter, takeUntil, tap } from "rxjs/operators";

import { INovaFilters, nameof } from "@nova-ui/bits";

import { SCROLL_NEXT_PAGE } from "../../../services/types";
import { TableWidgetComponent } from "../public-api";

@Injectable()
export class VirtualScrollFeatureAddonService {
    private widget: TableWidgetComponent; // TODO: generic widget

    public initWidget(widget: TableWidgetComponent): void {
        this.widget = widget;
    }

    public initVirtualScroll(widget: TableWidgetComponent): void {
        if (!this.widget) {
            this.initWidget(widget);
        }

        if (this.widget.hasVirtualScroll) {
            this.registerVirtualScroll();
        } else {
            this.deregisterVirtualScroll();
        }
    }

    private registerVirtualScroll() {
        if (this.widget.dataSource) {
            this.widget.dataSource.registerComponent({
                [nameof<INovaFilters>("virtualScroll")]: {
                    componentInstance: this.widget.viewportManager,
                },
            });
        }
    }

    private deregisterVirtualScroll() {
        if (this.widget.dataSource) {
            this.widget.dataSource.deregisterComponent?.(
                nameof<INovaFilters>("virtualScroll")
            );
        }
    }

    /**
     * Subscribe to virtual scroll rendered items and fetches next items
     */
    public subscribeToVirtualScroll(): void {
        if (!this.widget.vscrollViewport) {
            return;
        }

        this.widget.viewportManager.setViewport(this.widget.vscrollViewport);
        this.widget.viewportManager.observeNextPage$({
            pageSize: this.widget.range,
            emitFirstPage: false,
        });

        merge(
            this.widget.vscrollViewport.elementScrolled(),
            this.widget.tableUpdate$
        )
            .pipe(
                auditTime(0),
                filter(() => !this.widget.isBusy),
                filter(() => this.shouldLoadNextPage()),
                tap(() =>
                    this.widget.zone.run(() => {
                        const currentPageRange =
                            this.widget.viewportManager.currentPageRange;

                        (this.widget.viewportManager as any).updateCurrentPage({
                            start: currentPageRange.end,
                            end: currentPageRange.end + this.widget.range,
                        });

                        // TODO: Remove "page" in V10. Compute page on datasource level. - NUI-5830
                        // @ts-ignore: Provide a proper interface to DS
                        this.widget.dataSource.page =
                            this.widget.viewportManager.currentPageRange.end /
                            (this.widget.viewportManager.currentPageRange.end -
                                this.widget.viewportManager.currentPageRange
                                    .start);
                        this.widget.eventBus
                            .getStream(SCROLL_NEXT_PAGE)
                            .next({});
                        this.widget.changeDetector.detectChanges();
                    })
                ),
                takeUntil(this.widget.onDestroy$)
            )
            .subscribe();
    }

    private shouldLoadNextPage(): boolean {
        const viewport = this.widget.vscrollViewport;
        const viewportElement = viewport?.elementRef.nativeElement;
        const dataLength = viewport?.getDataLength() ?? 0;

        if (!viewport || !viewportElement || dataLength === 0) {
            return false;
        }

        if (this.widget.totalItems && dataLength >= this.widget.totalItems) {
            return false;
        }

        if (this.widget.viewportManager.currentPageRange.end > dataLength) {
            return false;
        }

        const remainingScrollDistance =
            viewportElement.scrollHeight -
            viewportElement.clientHeight -
            viewportElement.scrollTop;

        return remainingScrollDistance <= this.widget.rowHeight;
    }
}
