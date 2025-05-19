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
import { Subject } from "rxjs";
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
    ISelection,
    TableComponent,
    VirtualViewportManager,
} from "@nova-ui/bits";

import { RESULTS_PER_PAGE } from "../filtered-view-table-with-virtual-scroll-selection-data";
import { FilteredViewTableWithVirtualScrollSelectionDataSource } from "../filtered-view-table-with-virtual-scroll-selection-data-source.service";
import { IServer } from "../types";

@Component({
    selector: "app-filtered-view-table-with-virtual-scroll-selection-table",
    templateUrl: "./filtered-view-table.component.html",
    styleUrls: ["./filtered-view-table.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class FilteredViewTableComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    public items: IServer[] = [];
    public isBusy: boolean = false;
    // This value is obtained from the server and used to evaluate the total number of pages to display
    public totalItems: number = 0;

    // columns of the table
    public displayedColumns = ["name", "location", "status"];
    public pageSize: number = RESULTS_PER_PAGE;

    // row selection
    public selectedItems: IServer[] = [];
    public selection: ISelection = {
        isAllPages: false,
        include: ["ABERN-SVR-ATQU9404"],
        exclude: [],
    };

    @ViewChild(TableComponent) table: TableComponent<IServer>;
    @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

    // the height in px of a single row from the table
    public rowHeight = 40;

    private readonly destroy$ = new Subject<void>();

    constructor(
        @Inject(DataSourceService)
        private dataSource: FilteredViewTableWithVirtualScrollSelectionDataSource<IServer>,
        private viewportManager: VirtualViewportManager,
        private changeDetection: ChangeDetectorRef
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
        this.dataSource.registerComponent({
            virtualScroll: { componentInstance: this.viewportManager },
        });
        this.viewportManager
            // Note: Initializing viewportManager with the repeat's CDK Viewport Ref
            .setViewport(this.viewport)
            // Note: Initializing the stream with the desired page size, based on which
            // VirtualViewportManager will perform the observations and will emit
            // distinct ranges with step equal to provided pageSize
            .observeNextPage$({ pageSize: this.pageSize })
            .pipe(
                // Since we know the total number of items we can stop the stream when dataset end is reached
                // Otherwise we can let VirtualViewportManager to stop when last received page range will not match requested range
                filter(
                    () =>
                        !this.items.length ||
                        this.items.length < this.totalItems
                ),
                tap(async () => this.applyFilters(false)),
                // Note: Using the same stream to subscribe to the outputsSubject and update the items list
                // eslint-disable-next-line import/no-deprecated
                switchMap(() =>
                    this.dataSource.outputsSubject.pipe(
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
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onSelectionChanged(selection: ISelection): void {
        // do something with the selection

        // make component aware of the new selection value
        // so it's displayed correctly
        this.changeDetection.detectChanges();
    }

    // trackBy handler used to identify uniquely each item in the table
    public trackBy(index: number, item: IServer): string {
        return item.name;
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
            this.items = [];
        }

        await this.dataSource.applyFilters();
    }
}
