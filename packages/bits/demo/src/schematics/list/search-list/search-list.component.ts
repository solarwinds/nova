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
    ViewChild,
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import {
    DataSourceService,
    INovaFilteringOutputs,
    IRepeatItemConfig,
    nameof,
    PaginatorComponent,
    RepeatComponent,
    SearchComponent,
} from "@nova-ui/bits";

import { RESULTS_PER_PAGE } from "./search-list-data";
import { SearchListDataSource } from "./search-list-data-source.service";
import { IServer, IServerFilters } from "./types";

@Component({
    selector: "app-search-list",
    templateUrl: "./search-list.component.html",
    styleUrls: ["./search-list.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: DataSourceService,
            useClass: SearchListDataSource,
        },
    ],
})
export class SearchListComponent implements OnInit, AfterViewInit, OnDestroy {
    public listItems$ = new BehaviorSubject<IServer[]>([]);

    public filteringState: INovaFilteringOutputs = {};
    public isBusy = false;

    // This value is obtained from the server and used to evaluate the total number of pages to display
    public totalItems: number = 0;

    // pagination
    public page: number = 1;
    public pageSize: number = RESULTS_PER_PAGE;

    public itemConfig: IRepeatItemConfig<IServer> = {
        trackBy: (index, item) => item?.name,
    };

    @ViewChild(RepeatComponent) repeat: RepeatComponent;
    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
    @ViewChild(SearchComponent) search: SearchComponent;

    private destroy$ = new Subject<void>();

    constructor(
        @Inject(DataSourceService)
        private dataSource: SearchListDataSource<IServer>,
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
            paginator: { componentInstance: this.paginator },
            search: { componentInstance: this.search },
            repeat: { componentInstance: this.repeat },
        });

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

        this.dataSource.outputsSubject
            .pipe(
                tap((data: INovaFilteringOutputs) => {
                    // update the list of items to be rendered
                    this.listItems$.next(data.repeat?.itemsSource || []);

                    this.filteringState = data;

                    this.totalItems = data.paginator?.total ?? 0;

                    this.changeDetection.detectChanges();
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();

        // make 1st call to retrieve initial results
        await this.applyFilters();
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

    public async applyFilters() {
        await this.dataSource.applyFilters();
    }
}
