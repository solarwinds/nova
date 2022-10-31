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
    ChangeDetectorRef,
    Component,
    OnDestroy,
    ViewChild,
} from "@angular/core";
import { Subject } from "rxjs";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

import {
    INovaFilteringOutputs,
    LocalFilteringDataSource,
    PaginatorComponent,
    SearchComponent,
    SorterComponent,
} from "@nova-ui/bits";

const INITIAL_ARRAY = [
    { color: "regular-blue" },
    { color: "regular-green" },
    { color: "regular-yellow" },
    { color: "regular-cyan" },
    { color: "regular-magenta" },
    { color: "regular-black" },
    { color: "dark-blue" },
    { color: "dark-green" },
    { color: "dark-yellow" },
    { color: "dark-cyan" },
    { color: "dark-magenta" },
    { color: "light-blue" },
    { color: "light-green" },
    { color: "light-yellow" },
    { color: "light-cyan" },
    { color: "light-magenta" },
];

/**
 * TODO: Remove in v12 - NUI-5835
 * @deprecated
 */
@Component({
    selector: "nui-deprecated-client-side-delayed-data-source-example",
    providers: [LocalFilteringDataSource],
    templateUrl: "./client-side-delayed.example.component.html",
})
export class DepreacatedDataSourceClientSideDelayedExampleComponent
    implements AfterViewInit, OnDestroy
{
    public searchTerm = "";
    public page = 1;
    public sorter = {
        columns: ["color", "red", "green", "blue"],
        sortedColumn: "color",
        direction: "asc",
    };

    public state: INovaFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
        paginator: {
            // @ts-ignore: used for demo purposes
            total: undefined,
        },
    };

    public filters: any[];
    public selectedFilters: any[];

    private delayActionSubject: Subject<any> = new Subject();
    private outputsSubscription: Subscription;

    @ViewChild("filteringPaginator") filteringPaginator: PaginatorComponent;
    @ViewChild("filteringSearch") filteringSearch: SearchComponent;
    @ViewChild("filteringSorter") filteringSorter: SorterComponent;

    constructor(
        public dataSourceService: LocalFilteringDataSource<any>,
        public changeDetection: ChangeDetectorRef
    ) {
        dataSourceService.setData(INITIAL_ARRAY);

        this.filters = ["regular", "dark", "light"];
        this.selectedFilters = [];
    }

    ngAfterViewInit() {
        this.dataSourceService.componentTree = {
            search: {
                componentInstance: this.filteringSearch,
            },
            paginator: {
                componentInstance: this.filteringPaginator,
            },
        };
        this.dataSourceService.applyFilters();
        this.outputsSubscription =
            this.dataSourceService.outputsSubject.subscribe(
                (data: INovaFilteringOutputs) => {
                    this.state = data;
                    if (data.paginator?.reset) {
                        this.filteringPaginator.page = 1;
                    }
                    this.changeDetection.detectChanges();
                }
            );
        this.delayActionSubject.pipe(debounceTime(500)).subscribe(() => {
            this.dataSourceService.applyFilters();
        });
    }

    ngOnDestroy() {
        this.outputsSubscription.unsubscribe();
    }

    public onSearch() {
        this.delayActionSubject.next();
    }

    public changePagination() {
        this.dataSourceService.applyFilters();
    }
}
