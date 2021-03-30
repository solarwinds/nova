import { CdkVirtualForOf, CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { AfterViewInit, ContentChild, Directive, Input, OnDestroy, Renderer2 } from "@angular/core";
import isBoolean from "lodash/isBoolean";
import isEmpty from "lodash/isEmpty";
import ResizeObserver from "resize-observer-polyfill";
import { asyncScheduler, EMPTY, merge, Observable, Subject } from "rxjs";
import { delay, exhaustMap, filter, finalize, map, take, takeUntil, tap, throttleTime } from "rxjs/operators";

import { TableComponent } from "../table.component";

export enum TableVirtualScrollHeaderPosition {
    Native,
    Sticky,
}

@Directive({
    selector: "cdk-virtual-scroll-viewport[tableStickyHeader]",
    host: {
        "[class.sticky-table-header]": "true",
        "style": "overflow-y:overlay",
    },
})
export class TableStickyHeaderDirective implements AfterViewInit, OnDestroy {
    @ContentChild(TableComponent) public table: TableComponent<unknown>;
    @ContentChild(CdkVirtualForOf) public virtualFor: CdkVirtualForOf<unknown>;

    @Input()
    public set tableStickyHeader(isSticky: boolean) {
        if (!isBoolean(isSticky)) {
            return;
        }

        this._sticky = isSticky;

        // Note: We need to have all properties set
        // before proceeding with table head movements.
        if (!this.isInitialized) {
            return;
        }

        this.updateHeadPosition(isSticky);
    }

    private _sticky: boolean = true;
    private headPosition: TableVirtualScrollHeaderPosition;

    private stickyHeadContainer?: HTMLElement; // Actual thead container
    private headRef?: HTMLTableSectionElement;
    private bodyRef?: HTMLTableSectionElement;
    private tableElRef?: HTMLTableElement;
    private userProvidedHeight: string;

    private unsubscribe$: Subject<unknown> = new Subject<unknown>();
    private headerResizeObserver: ResizeObserver;

    private get viewportEl(): HTMLElement {
        return this.viewport.elementRef.nativeElement;
    }

    private get isInitialized(): boolean {
        return !!this.tableElRef;
    }

    constructor(private renderer: Renderer2, private viewport: CdkVirtualScrollViewport) {
    }

    public ngAfterViewInit(): void {
        this.assignRequiredProperties();
        // TODO: Find a better way to identify when the table header are rendered properly
        // Waiting for the next tick to let cdk table properly draw the table header
        setTimeout(() => this.updateNativeHeaderPlaceholder());
        this.updateHeadPosition(this._sticky);
    }

    public setNative(): void {
        if (this.headPosition === TableVirtualScrollHeaderPosition.Native) {
            console.warn("Already in native mode");
            return;
        }

        // Note: Moving the thead back to the table
        this.renderer.insertBefore(this.tableElRef, this.headRef, this.bodyRef);
        // Note: Unsubscribing from potential subscriptions generated by stickyMode.
        this.unsubscribe$.next();

        // Note: Restoring user provided height
        if (isEmpty(this.userProvidedHeight)) {
            this.viewportEl.style.removeProperty("height");
        } else {
            this.viewportEl.style.setProperty("height", this.userProvidedHeight);
        }

        this.headPosition = TableVirtualScrollHeaderPosition.Native;
    }

    public setSticky(): void {
        if (this.headPosition === TableVirtualScrollHeaderPosition.Sticky) {
            console.warn("Already in sticky mode");
            return;
        }

        if (!this.stickyHeadContainer) {
            this.createStickyHeaderContainer();
        }

        // Note: Moving the table head into sticky container
        this.renderer.appendChild(this.stickyHeadContainer, this.headRef);

        this.syncHorizontalScroll();
        this.syncColumnWidths();
        this.updateContainerToFitHead();

        this.headPosition = TableVirtualScrollHeaderPosition.Sticky;
    }

    public updateContainerToFitHead(): void {
        if (this.headRef?.rows.item(0)) {
            const adjustContainerToFitHead = () => {
                const viewportComputedHeight: string = isEmpty(this.userProvidedHeight) ? this.viewportEl.offsetHeight + "px" : this.userProvidedHeight;
                this.viewportEl.style.setProperty("height",
                    `calc(${ viewportComputedHeight } - ${ this.headRef?.rows.item(0)?.offsetHeight ?? 0 }px)`, "important");
            };

            this.headerResizeObserver = new ResizeObserver(adjustContainerToFitHead);
            this.headerResizeObserver.observe(this.headRef?.rows.item(0) as Element);
        }
    }

    public handleColumnsUpdate$: () => Observable<unknown> = () => {
        // TODO: Perform a dirty check before starting assigning new values
        // Note: Setting the width of stickyHeadContainer container to be able to simulate horizontal scroll of the sticky header
        this.renderer.setStyle(this.stickyHeadContainer, "width", `${ this.viewport._contentWrapper.nativeElement.scrollWidth }px`);

        const headColumns: HTMLTableHeaderCellElement[] = Array.from(this.stickyHeadContainer?.getElementsByTagName("th") || []);
        const firstDataRowCells: HTMLTableDataCellElement[] = Array.from(this.bodyRef?.rows.item(0)?.cells || []);

        // Note: If head columns are not in sync with data columns skip
        if (headColumns.length !== firstDataRowCells.length) {
            return EMPTY;
        }

        // TODO: Find a better way to pair placeholderHeader columns with header columns
        firstDataRowCells.forEach((cell: HTMLTableDataCellElement, index: number) => {
            // Note: Assigning data cell width to the corresponding header column
            // (using the style width if specified; otherwise, falling back to the offsetWidth)
            headColumns[index].style.width = cell.style.width || `${ cell.offsetWidth }px`;
        });

        // update the header placeholder to match the updated column widths
        this.updateNativeHeaderPlaceholder();

        // Note: Returning empty observable to be able to create an execution queue
        return EMPTY;
    }

    private assignRequiredProperties(): void {
        this.tableElRef = this.viewportEl.getElementsByTagName("table").item(0) || undefined;
        this.headRef = this.viewportEl.getElementsByTagName("thead").item(0) || undefined;
        this.userProvidedHeight = this.viewportEl.style.height;
        Array.from(this.headRef?.getElementsByTagName("th") || []).forEach(th => th.classList.add("virtual-sticky"));
        this.bodyRef = this.viewportEl.getElementsByTagName("tbody").item(0) || undefined;
    }

    private syncColumnWidths(): void {
        const resize$: Subject<unknown> = new Subject();
        // Note: Passing the resize event to resize$ subject to be able
        // to handle all the columnWidth update trigger in a single stream
        const resizeObserver: ResizeObserver = new ResizeObserver(() => resize$.next());
        resizeObserver.observe(this.viewportEl);
        this.unsubscribe$.pipe(take(1), tap(() => resize$.complete())).subscribe();

        const onResize$ = resize$.pipe(
            // Note: Performing the resizeObserver cleanup
            finalize(() => resizeObserver.disconnect())
        );
        const onScroll$ = this.viewport.elementScrolled().pipe(
            // Note: Reducing the number of times function is invoked
            // by scheduling the scroll events via trailing throttling
            throttleTime(50, asyncScheduler, { trailing: true })
        );
        const tableColumnsUpdate$ = merge(this.table.columnsOrderChange, this.table._contentColumnDefs.changes).pipe(
            // Note: Using delay(0) to grant some time to the table
            // to update the rows and then proceed with the event
            delay(0),
            // Note: Reattaching native header on every columns changes
            tap(() => this.updateNativeHeaderPlaceholder())
        );

        if (!this.virtualFor) {
            throw new Error("Unable to find CdkVirtualForOf");
        }

        merge(onScroll$, onResize$, tableColumnsUpdate$, this.virtualFor.dataStream).pipe(
            // Note: Preventing function to be invoked multiple times
            // by merging new observable only if the previous one was completed
            exhaustMap(this.handleColumnsUpdate$),
            takeUntil(this.unsubscribe$)
        ).subscribe();
    }

    private syncHorizontalScroll(): void {
        let previousScrollLeft: number = 0;

        this.viewport.elementScrolled().pipe(
            map(() => this.viewportEl.scrollLeft),
            // Note: Filtering out vertical scroll events
            filter(scrollLeft => scrollLeft !== previousScrollLeft),
            tap((scrollLeft: number) => {
                previousScrollLeft = scrollLeft;
                // Note: Simulating horizontal scroll by assigning margin-left to be equal to scrolled distance
                this.renderer.setStyle(this.stickyHeadContainer, "margin-left", `-${ scrollLeft }px`);
            }),
            takeUntil(this.unsubscribe$)
        ).subscribe();
    }

    private createStickyHeaderContainer(): void {
        this.stickyHeadContainer = this.renderer.createElement("div");

        const wrapper: HTMLElement = this.renderer.createElement("div");
        this.renderer.appendChild(wrapper, this.stickyHeadContainer);
        this.renderer.setStyle(wrapper, "overflow-x", `hidden`);
        this.renderer.setStyle(wrapper, "width", `100%`);

        // Assigning original table classes
        const originalTableClasses: string[] = Array.from(this.tableElRef?.classList || []);
        originalTableClasses.push("sticky-table-header-container");
        originalTableClasses.forEach(cssClass => this.renderer.addClass(this.stickyHeadContainer, cssClass));

        this.renderer.insertBefore(this.viewportEl.parentElement, wrapper, this.viewportEl);
    }

    private updateNativeHeaderPlaceholder(): void {
        if (!this.headRef || !this.tableElRef || !this.bodyRef) {
            throw new Error("Can't append thead placeholder. TableRef, BodyRef or HeaderRef is undefined");
        }

        const headPlaceholder = this.tableElRef.getElementsByTagName("thead")[0];
        if (headPlaceholder) {
            headPlaceholder.remove();
        }

        const theadPlaceholder: Node = this.headRef.cloneNode(true);

        // Note: making header invisible
        this.renderer.setStyle(theadPlaceholder, "visibility", "collapse");
        // Note: Adding an identifier for the header placeholder to avoid confusion
        this.renderer.addClass(theadPlaceholder, "sticky-header-placeholder");
        // Note: Appending head placeholder to the table
        this.renderer.insertBefore(this.tableElRef, theadPlaceholder, this.bodyRef);
    }

    private updateHeadPosition(isSticky: boolean): void {
        if (!isSticky) {
            this.setNative();
            return;
        }
        this.setSticky();
    }

    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();

        if (this.headerResizeObserver) {
            this.headerResizeObserver.disconnect();
        }
    }
}
