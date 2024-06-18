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
import { Injectable } from "@angular/core";
// eslint-disable-next-line import/no-deprecated
import { merge } from "rxjs";
import { filter, map, takeUntil, tap } from "rxjs/operators";

import { INovaFilters, nameof } from "@nova-ui/bits";

import { SCROLL_NEXT_PAGE } from "../../../services/types";
import { TableWidgetComponent } from "../public-api";

@Injectable()
export class VirtualScrollFeatureAddonService {
    private widget: TableWidgetComponent; // TODO: generic widget

    public visibleItems: unknown[] = [];

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

        // Note: Using this additional stream to pass the visible range to
        // the table and trigger change detection on range change and table data update.
        // eslint-disable-next-line import/no-deprecated
        merge(
            this.widget.vscrollViewport.renderedRangeStream,
            this.widget.tableUpdate$.pipe(
                map(() => this.widget.vscrollViewport?.getRenderedRange())
            )
        )
            .pipe(
                tap((range: ListRange | undefined) => {
                    this.visibleItems = this.widget.tableData.slice(
                        range?.start,
                        range?.end
                    );
                    // Since we're using onPush strategy we should trigger CD manually to ensure that visible items are updated properly
                    this.widget.changeDetector.detectChanges();
                }),
                takeUntil(this.widget.onDestroy$)
            )
            .subscribe();

        this.widget.viewportManager
            .setViewport(this.widget.vscrollViewport)
            .observeNextPage$({
                pageSize: this.widget.range,
                emitFirstPage: true,
            })
            .pipe(
                // Note: A special check to keep our server-client-side sorting in place
                filter(
                    (range) =>
                        range.end >=
                        (this.widget.vscrollViewport?.getDataLength() ?? 0)
                ),
                tap((range) =>
                    this.widget.zone.run(() => {
                        // TODO: Remove "page" in V10. Compute page on datasource level. - NUI-5830
                        // @ts-ignore: Provide a proper interface to DS
                        this.widget.dataSource.page =
                            range.end / (range.end - range.start);
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
}
