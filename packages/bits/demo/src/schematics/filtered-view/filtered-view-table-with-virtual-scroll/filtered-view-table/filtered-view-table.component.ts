import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import {
    DataSourceService,
    IFilteringOutputs,
    TableComponent,
    VirtualViewportManager,
} from "@nova-ui/bits";
import { Subject } from "rxjs";
import {
    filter,
    switchMap,
    takeUntil,
    tap,
} from "rxjs/operators";

import {
    RESULTS_PER_PAGE,
} from "../filtered-view-table-with-virtual-scroll-data";
import { FilteredViewTableWithVirtualScrollDataSource } from "../filtered-view-table-with-virtual-scroll-data-source.service";
import { IServer } from "../types";

@Component({
    selector: "app-filtered-view-table-with-virtual-scroll-table",
    templateUrl: "./filtered-view-table.component.html",
    styleUrls: ["./filtered-view-table.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class FilteredViewTableComponent implements OnInit, OnDestroy, AfterViewInit {
    public items: IServer[] = [];
    public isBusy: boolean = false;
    // This value is obtained from the server and used to evaluate the total number of pages to display
    public totalItems: number = 0;

    // columns of the table
    public displayedColumns = ["name", "location", "status"];
    public pageSize: number = RESULTS_PER_PAGE;

    @ViewChild(TableComponent) table: TableComponent<IServer>;
    @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

    // the height in px of a single row from the table
    public rowHeight = 40;

    private destroy$ = new Subject();

    constructor(
        @Inject(DataSourceService) private dataSource: FilteredViewTableWithVirtualScrollDataSource<IServer>,
        private viewportManager: VirtualViewportManager,
        private changeDetection: ChangeDetectorRef
    ) {
    }

    public ngOnInit(): void {
        this.dataSource.busy.pipe(
            tap(val => {
                this.isBusy = val;
                this.changeDetection.detectChanges();
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    public ngAfterViewInit(): void {
        this.dataSource.registerComponent({
            virtualScroll: { componentInstance: this.viewportManager },
        });
        this.viewportManager
            // Note: Initializing viewportManager with the repeat's CDK Viewport Ref
            .setViewport(this.viewport)
            // Note: Initializing the stream with the desired page size, based on which
            // VirtualViewportManager will perform the observations and will emit
            // distinct ranges with step equal to provided pageSize
            .observeNextPage$({ pageSize: this.pageSize }).pipe(
                // Since we know the total number of items we can stop the stream when dataset end is reached
                // Otherwise we can let VirtualViewportManager to stop when last received page range will not match requested range
                filter(() => !this.items.length || this.items.length < this.totalItems),
                tap(async () => this.applyFilters(false)),
                // Note: Using the same stream to subscribe to the outputsSubject and update the items list
                switchMap(() => this.dataSource.outputsSubject.pipe(
                    tap((data: IFilteringOutputs) => {
                        // update the list of items to be rendered
                        const items = data.repeat?.itemsSource || [];

                        // after receiving data we need to append it to our previous fetched results
                        this.items = this.items.concat(items);
                        this.totalItems = data.paginator?.total || 0;
                        this.changeDetection.detectChanges();
                    })
                )
                ),
                takeUntil(this.destroy$)
            ).subscribe();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async applyFilters(resetVirtualScroll: boolean = true): Promise<void> {
        if (resetVirtualScroll) {
            // it is important to reset viewportManager to start page
            // so that the datasource performs the search with 1st page
            this.viewportManager.reset({ emitFirstPage: false });
        }

        // Every new search request or filter change should
        // clear the cache in order to correctly display a new set of data
        const filters = this.dataSource.getFilters();
        const reset = this.dataSource.computeFiltersChange(filters);
        if (reset || filters.virtualScroll?.value.start === 0) {
            this.items = [];
        }

        await this.dataSource.applyFilters();
    }
}
