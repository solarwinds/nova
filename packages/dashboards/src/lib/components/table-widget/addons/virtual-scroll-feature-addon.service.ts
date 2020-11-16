import { ListRange } from "@angular/cdk/collections";
import { Injectable } from "@angular/core";
import { INovaFilters, nameof } from "@solarwinds/nova-bits";
import { merge } from "rxjs";
import { filter, map, takeUntil, tap } from "rxjs/operators";

import { SCROLL_NEXT_PAGE } from "../../../services/types";
import { TableWidgetComponent } from "../public-api";

@Injectable()
export class VirtualScrollFeatureAddonService {
    private widget: TableWidgetComponent; // TODO: generic widget

    public visibleItems: unknown[] = [];

    public initWidget(widget: TableWidgetComponent) {
        this.widget = widget;
    }

    public initVirtualScroll() {
        if (this.widget.hasVirtualScroll) {
            this.registerVirtualScroll();
        } else {
            this.deregisterVirtualScroll();
        }
    }

    private registerVirtualScroll() {
        if (this.widget.dataSource) {
            this.widget.dataSource.registerComponent({
                [nameof<INovaFilters>("virtualScroll")]: { componentInstance: this.widget.viewportManager },
            });
        }
    }

    private deregisterVirtualScroll() {
        if (this.widget.dataSource) {
            this.widget.dataSource.deregisterComponent?.(nameof<INovaFilters>("virtualScroll"));
        }
    }


    /**
     * Subscribe to virtual scroll rendered items and fetches next items
     */
    public subscribeToVirtualScroll() {
        if (!this.widget.vscrollViewport) {
            return;
        }

        // Note: Using this additional stream to pass the visible range to
        // the table and trigger change detection on range change and table data update.
        merge(
            this.widget.vscrollViewport.renderedRangeStream,
            this.widget.tableUpdate$.pipe(map(() => this.widget.vscrollViewport?.getRenderedRange()))
        ).pipe(
            tap((range: ListRange | undefined) => {
                this.visibleItems = this.widget.tableData.slice(range?.start, range?.end);
                // Since we're using onPush strategy we should trigger CD manually to ensure that visible items are updated properly
                this.widget.changeDetector.detectChanges();
            }),
            takeUntil(this.widget.onDestroy$)
        ).subscribe();

        this.widget.viewportManager.setViewport(this.widget.vscrollViewport).observeNextPage$({
            pageSize: this.widget.range,
            emitFirstPage: true,
        }).pipe(
            // Note: A special check to keep our server-client-side sorting in place
            filter(range => range.end >= (this.widget.vscrollViewport?.getDataLength() ?? 0)),
            tap(range => this.widget.zone.run(() => {
                // TODO: Remove "page" in V10. Compute page on datasource level.
                // @ts-ignore: Provide a proper interface to DS
                this.widget.dataSource.page = range.end / (range.end - range.start);
                this.widget.eventBus.getStream(SCROLL_NEXT_PAGE).next();
                this.widget.changeDetector.detectChanges();
            })),
            takeUntil(this.widget.onDestroy$)
        ).subscribe();
    }
}
