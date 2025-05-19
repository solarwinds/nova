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

import { ListRange } from "@angular/cdk/collections";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    IFilter,
    IFilteringOutputs,
    SelectorService,
    TableComponent,
    TableVirtualScrollDirective,
} from "@nova-ui/bits";

import { IRandomUserTableModel } from "../index";
import { RandomuserTableDataSource } from "../table-virtual-scroll-datasource";

@Component({
    selector: "nui-table-virtual-scroll-real-api-progress-footer-example",
    templateUrl:
        "./table-virtual-scroll-real-api-progress-footer.example.component.html",
    styleUrls: [
        "./table-virtual-scroll-real-api-progress-footer.example.component.less",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableVirtualScrollRealApiProgressFooterExampleComponent
    implements AfterViewInit, OnDestroy, OnInit
{
    // This value is obtained from the server and used to evaluate the total number of pages to display
    private _totalItems: number = 0;
    // This value is being depending to obtain the total number of pages available depending on the range of the fatched items selected
    private totalPages: number = 0;
    private lastPageFetched: number = 0;
    // Since we always have the first pagge fetched automatically (on OnInit), it's fair to say we always start with the first page prefetched
    private prefetchedDsPageNumber: number = 1;
    // The range of items to fetch from the server and display within the viewport.
    private range: number = 40;
    private _isBusy: boolean = false;
    private virtualScrollFilterValue: ListRange = { start: 0, end: this.range };
    private onDestroy$: Subject<void> = new Subject<void>();

    get totalItems(): number {
        return this._totalItems;
    }
    get isBusy(): boolean {
        return this._isBusy;
    }

    // The dynamically changed array of items to render by the table
    public users: IRandomUserTableModel[] = [];
    public dataSourceObs = new Subject<any[]>();
    public displayedColumns: string[] = [
        "no",
        "nameTitle",
        "nameFirst",
        "nameLast",
        "gender",
        "country",
        "city",
        "postcode",
        "email",
        "cell",
    ];
    public gridHeight = 400;
    public makeSticky: boolean = true;
    private dataSource: RandomuserTableDataSource;

    constructor(
        public selectorService: SelectorService,
        private cd: ChangeDetectorRef
    ) {
        this.dataSource = new RandomuserTableDataSource();
    }

    @ViewChild(forwardRef(() => TableComponent), { static: false })
    table: TableComponent<any>;
    @ViewChild(forwardRef(() => TableVirtualScrollDirective), { static: false })
    virtualDirective: TableVirtualScrollDirective;
    @ViewChild(CdkVirtualScrollViewport, { static: false })
    viewport: CdkVirtualScrollViewport;

    public ngOnInit(): void {
        this.dataSource.outputsSubject.subscribe(
            (outputs: IFilteringOutputs) => {
                if (outputs) {
                    this.users = outputs.repeat.itemsSource;
                    this._totalItems = outputs.totalItems;
                    this.totalPages = Math.floor(this._totalItems / this.range);
                    // This condition handles the case when the number of items fetched is less than the viewport size.
                    // To have virtual scroll working, we need to prefetch the number of items missing to trigger the scrollbar.
                    if (
                        this.users.length <
                        Math.round(
                            this.viewport.getViewportSize() /
                                this.virtualDirective.rowHeight
                        )
                    ) {
                        this.prefetchedDsPageNumber++;
                        this.dataSource.page = this.prefetchedDsPageNumber;
                        this.dataSource.applyFilters();
                    }
                    this.cd.detectChanges();
                }
            }
        );

        this.dataSource.busy.subscribe((busy) => {
            this._isBusy = busy;
        });
    }

    public ngAfterViewInit(): void {
        this.registerVirtualScroll();

        // Setting the items range to properly evaluate the virtual scroll viewport size
        this.virtualDirective.setMaxItems(this.range);

        this.viewport.renderedRangeStream
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((value) => {
                // There is no use to proceed if we've already fetched all the items
                if (this.users.length === this._totalItems) {
                    return;
                }

                const page = Math.floor(value.end / this.range);
                if (page > this.lastPageFetched && page <= this.totalPages) {
                    const start = page * this.range;
                    const end = start + this.range;
                    this.virtualScrollFilterValue = { start: start, end: end };
                    this.lastPageFetched = page;
                    // Due to a specificity of the chosen API, we explicitly send it the page number, because the API can
                    // return data in pages. This can vary depending on the user's usecase
                    this.dataSource.page = this.prefetchedDsPageNumber + page;

                    this.dataSource.applyFilters();
                }
            });

        this.dataSource.applyFilters();
    }

    public ngOnDestroy(): void {
        this.dataSource.busy.unsubscribe();
        this.dataSource.outputsSubject.unsubscribe();
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private registerVirtualScroll() {
        this.dataSource.registerComponent({
            virtualScroll: {
                componentInstance: {
                    getFilters: () =>
                        <IFilter<ListRange>>{
                            type: "virtualScroll",
                            value: this.virtualScrollFilterValue,
                        },
                },
            },
        });
    }
}
