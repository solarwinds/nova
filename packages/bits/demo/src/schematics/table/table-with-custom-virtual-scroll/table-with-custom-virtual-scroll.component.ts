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
    INovaFilteringOutputs,
    ISortedItem,
    SearchComponent,
    SorterDirection,
    TableComponent,
    VirtualViewportManager,
} from "@nova-ui/bits";
import { Subject } from "rxjs";
import {
    debounceTime,
    takeUntil,
    tap,
} from "rxjs/operators";

import {
    CUSTOM_SCROLL_ITEMS_PER_PAGE,
    RESULTS_PER_PAGE,
} from "./table-with-custom-virtual-scroll-data";
import { TableWithCustomVirtualScrollDataSource } from "./table-with-custom-virtual-scroll-data-source.service";
import { IServer } from "./types";
import { VirtualScrollCustomStrategyService } from "./virtual-scroll-custom-strategy.service";

@Component({
    selector: "app-table-with-custom-virtual-scroll",
    templateUrl: "./table-with-custom-virtual-scroll.component.html",
    styleUrls: ["./table-with-custom-virtual-scroll.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [
        VirtualViewportManager,
        VirtualScrollCustomStrategyService,
        {
            provide: CUSTOM_SCROLL_ITEMS_PER_PAGE,
            useValue: RESULTS_PER_PAGE,
        },
        {
            provide: DataSourceService,
            useClass: TableWithCustomVirtualScrollDataSource,
        },
    ],
})
export class TableWithCustomVirtualScrollComponent implements OnInit, OnDestroy, AfterViewInit {
    public items: IServer[] = [];
    public isBusy: boolean = false;

    // columns of the table
    public displayedColumns = ["name", "location", "status"];

    // sorting
    public sortedColumn: ISortedItem = {
        sortBy: "name",
        direction: SorterDirection.ascending,
    };

    // search
    public searchTerm: string;
    public columnsToApplySearch = ["name"];
    public pageSize: number = RESULTS_PER_PAGE;

    @ViewChild(TableComponent) table: TableComponent<IServer>;
    @ViewChild(SearchComponent) search: SearchComponent;
    @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

    // the height in px of a single row from the table
    public rowHeight = 40;

    private previouslyLoadedCount: number;

    private destroy$ = new Subject();

    constructor(
        @Inject(DataSourceService) private dataSource: TableWithCustomVirtualScrollDataSource<IServer>,
        private viewportManager: VirtualViewportManager,
        private customVirtualScrollStrategyService: VirtualScrollCustomStrategyService,
        private changeDetection: ChangeDetectorRef
    ) {
    }

    public ngOnInit() {
        this.dataSource.busy.pipe(
            tap(val => {
                this.isBusy = val;
                this.changeDetection.detectChanges();
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    public async ngAfterViewInit() {
        // register filter to be able to sort
        this.dataSource.registerComponent(this.table.getFilterComponents());
        this.dataSource.registerComponent({
            search: { componentInstance: this.search },
            virtualScroll: {componentInstance: this.customVirtualScrollStrategyService },
        });
        this.viewportManager
            // Note: Initializing viewportManager with the repeat's CDK Viewport Ref
            .setViewport(this.viewport);

        this.dataSource.outputsSubject.pipe(
            tap((data: INovaFilteringOutputs) => {
                // update the list of items to be rendered
                let items = data.repeat?.itemsSource || [];

                // number of fetched items from our data source
                const fetchedItemsCount = items.length;

                // number of useful items after eliminating the leftovers;
                // leftovers appear when we reach the end of all our data
                // since we're keep requesting the same page multiple times
                // waiting for new items to be added between subsequent requests
                const usefulItemsCount = fetchedItemsCount < this.pageSize
                    ? this.previouslyLoadedCount - fetchedItemsCount
                    : fetchedItemsCount;

                items = items.slice(0, usefulItemsCount);

                this.previouslyLoadedCount = items.length;

                // append current useful items we need to append it to our previous fetched results
                this.items = this.items.concat(items);

                this.customVirtualScrollStrategyService.prepareNextPage(fetchedItemsCount);
            }),
            takeUntil(this.destroy$)
        ).subscribe();

        // listen for input change in order to perform the search
        this.search.inputChange.pipe(
            debounceTime(500),
            // perform actual search
            tap(() => this.onSearch()),
            takeUntil(this.destroy$)
        ).subscribe();

        await this.applyFilters();
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async onSearch() {
        await this.applyFilters();
    }

    public async onSearchCancel() {
        await this.applyFilters();
    }

    public async sortData(sortedColumn: ISortedItem) {
        this.sortedColumn = sortedColumn;
        await this.applyFilters();
    }

    public async applyFilters(resetVirtualScroll: boolean = true) {
        if (resetVirtualScroll) {
            // it is important to reset viewportManager to start page
            // so that the datasource performs the search with 1st page
            this.viewportManager.reset({emitFirstPage: false});
        }

        // Every new search request or filter change should
        // clear the cache in order to correctly display a new set of data
        const filters = this.dataSource.getFilters();
        const reset = this.dataSource.computeFiltersChange(filters);
        if (reset || filters.virtualScroll?.value.start === 0) {
            this.items = [];
            this.customVirtualScrollStrategyService.reset();
        }

        await this.dataSource.applyFilters();
    }
}
