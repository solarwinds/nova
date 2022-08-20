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
    INovaFilteringOutputs,
    IRepeatItemConfig,
    RepeatComponent,
    VirtualViewportManager,
} from "@nova-ui/bits";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, switchMap, takeUntil, tap } from "rxjs/operators";

import { RESULTS_PER_PAGE } from "./repeat-virtual-scroll-data";
import { RepeatVirtualScrollDataSource } from "./repeat-virtual-scroll-data-source";
import { IServer } from "./types";

@Component({
    selector: "repeat-virtual-scroll",
    templateUrl: "./repeat-virtual-scroll.component.html",
    styleUrls: ["./repeat-virtual-scroll.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        VirtualViewportManager,
        {
            provide: DataSourceService,
            useClass: RepeatVirtualScrollDataSource,
        },
    ],
})
export class RepeatVirtualScrollComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    public listItems$ = new BehaviorSubject<IServer[]>([]);

    public filteringState: INovaFilteringOutputs = {};
    public isBusy = false;

    public totalItems: number = 0;

    public itemConfig: IRepeatItemConfig<IServer> = {
        trackBy: (index, item) => item?.name,
    };

    @ViewChild(RepeatComponent) repeat: RepeatComponent;

    private destroy$ = new Subject();

    constructor(
        @Inject(DataSourceService)
        private dataSource: RepeatVirtualScrollDataSource<IServer>,
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
                            this.totalItems = data.repeat?.itemsSource.length;

                            // after receiving data we need to append it to our previous fetched results
                            this.listItems$.next(
                                this.listItems$.getValue().concat(items)
                            );
                            this.changeDetection.detectChanges();
                        })
                    )
                ),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async applyFilters(resetVirtualScroll: boolean = true) {
        if (resetVirtualScroll) {
            // it is important to reset viewportManager to start page
            // so that the data source performs the search with 1st page
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
}
