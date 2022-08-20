import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import {
    DataSourceService,
    IFilteringOutputs,
    IMenuItem,
    INovaFilteringOutputs,
    IRepeatItemConfig,
    ISorterChanges,
    nameof,
    RepeatComponent,
    SearchComponent,
    SorterComponent,
    SorterDirection,
    VirtualViewportManager,
} from "@nova-ui/bits";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, switchMap, takeUntil, tap } from "rxjs/operators";

import { IServer, IServerFilters } from "./types";
import { RESULTS_PER_PAGE } from "./virtual-scroll-list-data";
import { VirtualScrollListDataSource } from "./virtual-scroll-list-data-source.service";

@Component({
    selector: "app-virtual-scroll-list",
    templateUrl: "./virtual-scroll-list.component.html",
    styleUrls: ["./virtual-scroll-list.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        VirtualViewportManager,
        {
            provide: DataSourceService,
            useClass: VirtualScrollListDataSource,
        },
    ],
})
export class VirtualScrollListComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    public listItems$ = new BehaviorSubject<IServer[]>([]);
    public readonly sorterItems: IMenuItem[] = [
        {
            title: $localize`Name`,
            value: "name",
        },
        {
            title: $localize`Status`,
            value: "status",
        },
        {
            title: $localize`Location`,
            value: "location",
        },
    ];

    public readonly initialSortDirection = SorterDirection.ascending;
    public sortBy = this.sorterItems[0].value;

    public filteringState: INovaFilteringOutputs = {};
    public isBusy = false;

    // This value is obtained from the server and used to evaluate the total number of pages to display
    public totalItems: number = 0;

    public itemConfig: IRepeatItemConfig<IServer> = {
        trackBy: (index, item) => item?.name,
    };

    @ViewChild(RepeatComponent) repeat: RepeatComponent;
    @ViewChild(SearchComponent) search: SearchComponent;
    @ViewChild(SorterComponent) sorter: SorterComponent;

    private destroy$ = new Subject();

    constructor(
        @Inject(DataSourceService)
        private dataSource: VirtualScrollListDataSource<IServer>,
        private changeDetection: ChangeDetectorRef,
        private viewportManager: VirtualViewportManager
    ) {}

    public ngOnInit() {
        this.dataSource.busy
            .pipe(
                tap((val) => {
                    this.isBusy = val;
                    this.changeDetection.detectChanges();
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    public async ngAfterViewInit() {
        this.dataSource.registerComponent({
            virtualScroll: { componentInstance: this.viewportManager },
            search: { componentInstance: this.search },
            sorter: { componentInstance: this.sorter },
            repeat: { componentInstance: this.repeat },
        });

        this.viewportManager
            // Note: Initializing viewportManager with the repeat's CDK Viewport Ref
            .setViewport(this.repeat.viewportRef)

            // Note: Initializing the stream with the desired page size, based on which
            // ViewportManager will perform the observations and will emit
            // distinct ranges with step equal to provided pageSize
            .observeNextPage$({ pageSize: RESULTS_PER_PAGE })
            .pipe(
                // Since we know the total number of items we can stop the stream when dataset end is reached
                // Otherwise we can let VirtualViewportManager to stop when last received page range will not match requested range
                filter(() => {
                    const items = this.listItems$.getValue();
                    return !items.length || items.length < this.totalItems;
                }),
                tap(() => this.applyFilters(false)),
                // Note: Using the same stream to subscribe to the outputsSubject and update the items list
                switchMap(() =>
                    this.dataSource.outputsSubject.pipe(
                        tap((data: IFilteringOutputs) => {
                            // update the list of items to be rendered
                            const items = data.repeat?.itemsSource || [];

                            // after receiving data we need to append it to our previous fetched results
                            this.listItems$.next(
                                this.listItems$.getValue().concat(items)
                            );

                            this.totalItems = data.paginator?.total || 0;

                            this.changeDetection.detectChanges();
                        })
                    )
                ),
                takeUntil(this.destroy$)
            )
            .subscribe();

        this.search.focusChange
            .pipe(
                tap(async (focused: boolean) => {
                    // we want to perform a new search on blur event
                    // only if the search filter changed
                    if (
                        !focused &&
                        this.dataSource.filterChanged(
                            nameof<IServerFilters>("search")
                        )
                    ) {
                        await this.applyFilters();
                    }
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async onSearch() {
        await this.applyFilters();
    }

    public async onCancelSearch() {
        await this.applyFilters();
    }

    public async applyFilters(resetVirtualScroll: boolean = true) {
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
            this.listItems$.next([]);
            this.changeDetection.detectChanges();
        }

        await this.dataSource.applyFilters();
    }

    public async onSorterAction(changes: ISorterChanges) {
        this.sortBy = changes.newValue.sortBy;
        await this.applyFilters();
    }
}
