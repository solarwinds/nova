import { VIRTUAL_SCROLL_STRATEGY } from "@angular/cdk/scrolling";
import { Directive, forwardRef, Input, OnChanges } from "@angular/core";

import { ComponentChanges } from "../../../types";

import { TableVirtualScrollLinearStrategy, TableVirtualScrollStrategy } from "./table-virtual-scroll-strategy";

export const DEFAULT_TABLE_HEADER_OFFSET = 40;
export const TABLE_ROW_HEIGHT = 24;

export function complexScrollStrategyFactory(scroll: TableVirtualScrollDirective | TableVirtualScrollLinearDirective) {
    return scroll.scrollStrategy;
}

@Directive({
    selector: "[tableVirtualScroll]:not([offset])",
    providers: [{
        provide: VIRTUAL_SCROLL_STRATEGY,
        useFactory: complexScrollStrategyFactory,
        deps: [forwardRef(() => TableVirtualScrollLinearDirective)],
    }],
})
export class TableVirtualScrollLinearDirective implements OnChanges {

    /** Height of table row. */
    @Input() rowHeight: number = TABLE_ROW_HEIGHT;

    /** Number of rows loaded into memory */
    @Input() rowCount: number;

    // Converting parameters to numbers here to avoid inputs become strings in case user sets rowHeight and offset
    // without square brackets in the template
    public scrollStrategy = new TableVirtualScrollLinearStrategy(+this.rowHeight);

    public ngOnChanges(changes: ComponentChanges<TableVirtualScrollLinearDirective>) {
        this.scrollStrategy.setRowHeight(+this.rowHeight);

        if (changes.rowCount) {
            this.updateDataLength(this.rowCount);
        }
    }

    /**
     * Updates the size of the items in the virtually scrolling list.
     * @param length
     */
    public updateDataLength(length: number) {
        this.scrollStrategy.setDataLength(length);
    }
}


// TODO: Remove in V10
/** @ignore */
/** @deprecated Use tableVirtualScroll with rowCount instead */
@Directive({
    selector: "[tableVirtualScroll]:not([rowCount])",
    providers: [{
        provide: VIRTUAL_SCROLL_STRATEGY,
        useFactory: complexScrollStrategyFactory,
        deps: [forwardRef(() => TableVirtualScrollDirective)],
    }],
})
export class TableVirtualScrollDirective implements OnChanges {

    /** Height of table row. */
    @Input() rowHeight: number = TABLE_ROW_HEIGHT;

    /**  Space to be saved for the header. Will be assigned to headerOffset value inside custom strategy */
    @Input() offset: number = DEFAULT_TABLE_HEADER_OFFSET;

    // Converting parameters to numbers here to avoid inputs become strings in case user sets rowHeight and offset
    // without square brackets in the template
    public scrollStrategy = new TableVirtualScrollStrategy(+this.rowHeight, +this.offset);

    public ngOnChanges() {
        this.scrollStrategy.setScrollHeight(+this.rowHeight, +this.offset);
    }

    /**
     * Updates the size of the items in the virtually scrolling list.
     * @param length
     */
    public updateDataLength(length: number) {
        this.scrollStrategy.setDataLength(length);
    }

    public setMaxItems(maxItems: number) {
        this.scrollStrategy.maxItems = maxItems;
    }
}
