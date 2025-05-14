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
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, takeUntil, tap } from "rxjs/operators";

import {
    DataSourceService,
    INovaFilteringOutputs,
    PaginatorComponent,
    SearchComponent,
    TableComponent,
} from "@nova-ui/bits";

import { RESULTS_PER_PAGE } from "./table-with-search-data";
import { TableWithSearchDataSource } from "./table-with-search-data-source.service";
import { IServer } from "./types";

@Component({
    selector: "app-table-with-search",
    templateUrl: "./table-with-search.component.html",
    styleUrls: ["./table-with-search.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DataSourceService,
            useClass: TableWithSearchDataSource,
        },
    ],
    standalone: false,
})
export class TableWithSearchComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    public items: IServer[] = [];
    public isBusy: boolean = false;
    // This value is obtained from the server and used to evaluate the total number of pages to display
    public totalItems: number = 0;

    // columns of the table
    public displayedColumns = ["name", "location", "status"];

    // search
    public searchTerm: string;
    public columnsToApplySearch = ["name"];

    // pagination
    public page: number = 1;
    public pageSize: number = RESULTS_PER_PAGE;

    @ViewChild(TableComponent) table: TableComponent<IServer>;
    @ViewChild(SearchComponent) search: SearchComponent;
    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

    private readonly destroy$ = new Subject<void>();

    constructor(
        @Inject(DataSourceService)
        private dataSource: TableWithSearchDataSource<IServer>,
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
            search: { componentInstance: this.search },
            paginator: { componentInstance: this.paginator },
        });

        this.dataSource.outputsSubject
            .pipe(
                tap((data: INovaFilteringOutputs) => {
                    // update the list of items to be rendered
                    this.items = data.repeat?.itemsSource || [];
                    this.totalItems = data.paginator?.total ?? 0;
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();

        // listen for input change in order to perform the search
        this.search.inputChange
            .pipe(
                debounceTime(500),
                // perform actual search
                tap(async () => this.onSearch()),
                takeUntil(this.destroy$)
            )
            .subscribe();

        await this.applyFilters();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async onSearch(): Promise<void> {
        await this.applyFilters();
    }

    public async onSearchCancel(): Promise<void> {
        await this.applyFilters();
    }

    public async changePagination($event: any): Promise<void> {
        await this.applyFilters();
    }

    public async applyFilters(): Promise<void> {
        await this.dataSource.applyFilters();
    }
}
