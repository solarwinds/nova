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
import { takeUntil, tap } from "rxjs/operators";

import {
    DataSourceService,
    INovaFilteringOutputs,
    TableComponent,
    VirtualViewportManager,
} from "@nova-ui/bits";

import {
    CUSTOM_SCROLL_ITEMS_PER_PAGE,
    RESULTS_PER_PAGE,
} from "../filtered-view-table-with-custom-virtual-scroll-data";
import { FilteredViewTableWithCustomVirtualScrollDataSource } from "../filtered-view-table-with-custom-virtual-scroll-data-source.service";
import { IServer } from "../types";
import { VirtualScrollCustomStrategyService } from "./virtual-scroll-custom-strategy.service";

@Component({
    selector: "app-filtered-view-table-with-custom-virtual-scroll-table",
    templateUrl: "./filtered-view-table.component.html",
    styleUrls: ["./filtered-view-table.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [
        VirtualViewportManager,
        VirtualScrollCustomStrategyService,
        {
            provide: CUSTOM_SCROLL_ITEMS_PER_PAGE,
            useValue: RESULTS_PER_PAGE,
        },
    ],
})
export class FilteredViewTableComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    public items: IServer[] = [];
    public isBusy: boolean = false;

    // columns of the table
    public displayedColumns = ["name", "location", "status"];
    public pageSize: number = RESULTS_PER_PAGE;

    @ViewChild(TableComponent) table: TableComponent<IServer>;
    @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

    // the height in px of a single row from the table
    public rowHeight = 40;

    private previouslyLoadedCount: number;

    private destroy$ = new Subject<void>();

    constructor(
        @Inject(DataSourceService)
        private dataSource: FilteredViewTableWithCustomVirtualScrollDataSource<IServer>,
        private viewportManager: VirtualViewportManager,
        private customVirtualScrollStrategyService: VirtualScrollCustomStrategyService,
        private changeDetection: ChangeDetectorRef
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
            virtualScroll: {
                componentInstance: this.customVirtualScrollStrategyService,
            },
        });
        this.viewportManager
            // Note: Initializing viewportManager with the repeat's CDK Viewport Ref
            .setViewport(this.viewport);

        this.dataSource.outputsSubject
            .pipe(
                tap((data: INovaFilteringOutputs) => {
                    // update the list of items to be rendered
                    let items = data.repeat?.itemsSource || [];

                    // number of fetched items from our data source
                    const fetchedItemsCount = items.length;

                    // number of useful items after eliminating the leftovers;
                    // leftovers appear when we reach the end of all our data
                    // since we're keep requesting the same page multiple times
                    // waiting for new items to be added between subsequent requests
                    const usefulItemsCount =
                        fetchedItemsCount < this.pageSize
                            ? this.previouslyLoadedCount - fetchedItemsCount
                            : fetchedItemsCount;

                    items = items.slice(0, usefulItemsCount);

                    this.previouslyLoadedCount = items.length;

                    // append current useful items we need to append it to our previous fetched results
                    this.items = this.items.concat(items);

                    this.customVirtualScrollStrategyService.prepareNextPage(
                        fetchedItemsCount
                    );
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();

        await this.applyFilters();
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
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
            this.items = [];
            this.customVirtualScrollStrategyService.reset();
        }

        await this.dataSource.applyFilters();
    }
}
