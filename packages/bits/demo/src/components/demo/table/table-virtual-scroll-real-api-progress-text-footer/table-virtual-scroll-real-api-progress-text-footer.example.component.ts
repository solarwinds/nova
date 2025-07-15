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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  viewChild
} from "@angular/core";
import { Subject } from "rxjs";
// eslint-disable-next-line import/no-deprecated
import { filter, switchMap, takeUntil, tap } from "rxjs/operators";

import {
    IFilteringOutputs,
    SelectorService,
    VirtualViewportManager,
} from "@nova-ui/bits";

import { IRandomUserTableModel } from "../index";
import { RandomuserTableDataSource } from "../table-virtual-scroll-datasource";

@Component({
    selector: "nui-table-virtual-scroll-real-api-progress-text-footer-example",
    templateUrl: "./table-virtual-scroll-real-api-progress-text-footer.example.component.html",
    styleUrls: [
        "./table-virtual-scroll-real-api-progress-text-footer.example.component.less",
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [VirtualViewportManager],
    standalone: false,
})
export class TableVirtualScrollRealApiProgressTextFooterExampleComponent
    implements AfterViewInit, OnDestroy, OnInit
{
    // The range of items to fetch from the server and display within the viewport.
    public range: number = 40;

    // This value is obtained from the server and used to evaluate the total number of pages to display
    private _totalItems: number = 0;
    private _isBusy: boolean = false;
    private onDestroy$: Subject<void> = new Subject<void>();

    get totalItems(): number {
        return this._totalItems;
    }

    get isBusy(): boolean {
        return this._isBusy;
    }

    // The dynamically changed array of items to render by the table
    public users: IRandomUserTableModel[] = [];
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
    private dataSource: RandomuserTableDataSource;

    constructor(
        public selectorService: SelectorService,
        private cd: ChangeDetectorRef,
        private viewportManager: VirtualViewportManager
    ) {
        this.dataSource = new RandomuserTableDataSource();
    }

    readonly viewport = viewChild(CdkVirtualScrollViewport);

    public ngOnInit(): void {
        this.dataSource.busy
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((busy) => {
                this._isBusy = busy;
            });
    }

    public ngAfterViewInit(): void {
        this.registerVirtualScroll();
        this.viewportManager
            // Note: Initializing viewportManager with the repeat's CDK Viewport Ref
            .setViewport(this.viewport())
            // Note: Initializing the stream with the desired page size, based on which
            // VirtualViewportManager will perform the observations and will emit
            // distinct ranges with step equal to provided pageSize
            .observeNextPage$({ pageSize: this.range })
            .pipe(
                // Note: In case we know the total number of items we can stop the stream when dataset end is reached
                // Otherwise we can let VirtualViewportManager to stop when last received page range will not match requested range
                filter((range) =>
                    this.totalItems ? this.totalItems >= range.end : true
                ),
                tap((range) => {
                    // Note: Keeping backward compatibility with RandomuserTableDataSource which requires page number to be set by consumer
                    // It also can be calculated directly on the Datasource level
                    this.dataSource.page =
                        range.end / (range.end - range.start);
                    this.dataSource.applyFilters();
                }),
                // Note: Using the same stream to subscribe to the outputsSubject and update the items list
                // eslint-disable-next-line import/no-deprecated
                switchMap(() =>
                    this.dataSource.outputsSubject.pipe(
                        tap((outputs: IFilteringOutputs) => {
                            this._totalItems = outputs.totalItems;
                            this.users = outputs.repeat.itemsSource || [];
                            this.cd.detectChanges();
                        })
                    )
                ),
                takeUntil(this.onDestroy$)
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private registerVirtualScroll() {
        this.dataSource.registerComponent({
            virtualScroll: { componentInstance: this.viewportManager },
        });
    }
}
