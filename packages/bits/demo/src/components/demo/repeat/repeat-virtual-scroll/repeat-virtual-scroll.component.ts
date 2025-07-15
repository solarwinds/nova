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
// eslint-disable-next-line import/no-deprecated
import { filter, switchMap, takeUntil, tap } from "rxjs/operators";

import {
    DataSourceService,
    IFilteringOutputs,
    INovaFilteringOutputs,
    IRepeatItemConfig,
    RepeatComponent,
    VirtualViewportManager,
} from "@nova-ui/bits";

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
    standalone: false,
})
export class RepeatVirtualScrollComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    public listItems$ = new BehaviorSubject<IServer[]>([]);

    public filteringState: INovaFilteringOutputs = {};
    public isBusy = false;

    public totalItems: number = 0;

    public itemConfig: IRepeatItemConfig<IServer> = {
        trackBy: (_, item): string | undefined => item?.name,
    };

    readonly repeat = viewChild.required(RepeatComponent);

    private readonly destroy$ = new Subject<void>();

    constructor(
        @Inject(DataSourceService)
        private dataSource: RepeatVirtualScrollDataSource<IServer>,
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
        const repeat = this.repeat();
        this.dataSource.registerComponent({
            virtualScroll: { componentInstance: this.viewportManager },
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

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async applyFilters(
        resetVirtualScroll: boolean = true
    ): Promise<void> {
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
