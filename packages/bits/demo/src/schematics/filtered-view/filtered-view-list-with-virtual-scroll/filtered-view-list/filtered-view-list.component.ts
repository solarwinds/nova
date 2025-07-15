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

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  viewChild
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import {
    filter,
    // eslint-disable-next-line import/no-deprecated
    switchMap,
    takeUntil,
    tap,
} from "rxjs/operators";

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

import { RESULTS_PER_PAGE } from "../filtered-view-list-with-virtual-scroll-data";
import { FilteredViewListWithVirtualScrollDataSource } from "../filtered-view-list-with-virtual-scroll-data-source.service";
import { IServer, IServerFilters } from "../types";

@Component({
    selector: "app-filtered-view-list-with-virtual-scroll-list",
    templateUrl: "./filtered-view-list.component.html",
    styleUrls: ["./filtered-view-list.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class FilteredViewListComponent
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
        trackBy: (_: number, item: IServer): string => item?.name,
    };

    readonly repeat = viewChild.required(RepeatComponent);
    readonly search = viewChild.required(SearchComponent);
    readonly sorter = viewChild.required(SorterComponent);

    private readonly destroy$ = new Subject<void>();

    constructor(
        @Inject(DataSourceService)
        private dataSource: FilteredViewListWithVirtualScrollDataSource<IServer>,
        private changeDetection: ChangeDetectorRef,
        private viewportManager: VirtualViewportManager
    ) {}

    public ngOnInit(): void {
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

    public async ngAfterViewInit(): Promise<void> {
        const search = this.search();
        const repeat = this.repeat();
        this.dataSource.registerComponent({
            virtualScroll: { componentInstance: this.viewportManager },
            search: { componentInstance: search },
            sorter: { componentInstance: this.sorter() },
            repeat: { componentInstance: repeat },
        });

        this.viewportManager
            // Note: Initializing viewportManager with the repeat's CDK Viewport Ref
            .setViewport(repeat.viewportRef)

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
                tap(async () => this.applyFilters(false)),
                // Note: Using the same stream to subscribe to the outputsSubject and update the items list
                // eslint-disable-next-line import/no-deprecated
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

        search.focusChange
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

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async onSearch(): Promise<void> {
        await this.applyFilters();
    }

    public async onCancelSearch(): Promise<void> {
        await this.applyFilters();
    }

    public async applyFilters(
        resetVirtualScroll: boolean = true
    ): Promise<void> {
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

    public async onSorterAction(changes: ISorterChanges): Promise<void> {
        this.sortBy = changes.newValue.sortBy;
        await this.applyFilters();
    }
}
