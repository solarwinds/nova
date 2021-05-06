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
import {
    DataSourceService,
    INovaFilteringOutputs,
    ISortedItem,
    PaginatorComponent,
    SearchComponent,
    SorterDirection,
    TableComponent,
} from "@nova-ui/bits";
import { Subject } from "rxjs";
import {
    debounceTime,
    takeUntil,
    tap,
} from "rxjs/operators";

import {
    RESULTS_PER_PAGE,
} from "./table-with-pagination-data";
import { TableWithPaginationDataSource } from "./table-with-pagination-data-source.service";
import { IServer } from "./types";

@Component({
    selector: "app-table-with-pagination",
    templateUrl: "./table-with-pagination.component.html",
    styleUrls: ["./table-with-pagination.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DataSourceService,
            useClass: TableWithPaginationDataSource,
        },
    ],
})
export class TableWithPaginationComponent implements OnInit, OnDestroy, AfterViewInit {
    public items: IServer[] = [];
    public isBusy: boolean = false;
    // This value is obtained from the server and used to evaluate the total number of pages to display
    public totalItems: number = 0;

    // columns of the table
    public displayedColumns = ["name", "location", "status"];

    // sorting
    public sortedColumn: ISortedItem = {
        sortBy: "name",
        direction: SorterDirection.ascending,
    };

    // search
    public searchTerm: string;
    public columnsToApplySearch = ["name"];

    // pagination
    public page: number = 1;
    public pageSize: number = RESULTS_PER_PAGE;

    @ViewChild(TableComponent) table: TableComponent<IServer>;
    @ViewChild(SearchComponent) search: SearchComponent;
    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

    private destroy$ = new Subject();

    constructor(
        @Inject(DataSourceService) private dataSource: TableWithPaginationDataSource<IServer>,
        private changeDetection: ChangeDetectorRef
    ) {
    }

    public ngOnInit() {
        this.dataSource.busy.pipe(
            tap(val => {
                this.isBusy = val;
                this.changeDetection.detectChanges();
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    public async ngAfterViewInit() {
        // register filter to be able to sort
        this.dataSource.registerComponent(this.table.getFilterComponents());
        this.dataSource.registerComponent({
            search: { componentInstance: this.search },
            paginator: { componentInstance: this.paginator },
        });

        this.dataSource.outputsSubject.pipe(
            tap((data: INovaFilteringOutputs) => {
                // update the list of items to be rendered
                this.items = data.repeat?.itemsSource || [];
                this.totalItems = data.paginator?.total ?? 0;
            }),
            takeUntil(this.destroy$)
        ).subscribe();

        // listen for input change in order to perform the search
        this.search.inputChange.pipe(
            debounceTime(500),
            // perform actual search
            tap(() => this.onSearch()),
            takeUntil(this.destroy$)
        ).subscribe();

        await this.applyFilters();
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async onSearch() {
        await this.applyFilters();
    }

    public async onSearchCancel() {
        await this.applyFilters();
    }

    public async sortData(sortedColumn: ISortedItem) {
        this.sortedColumn = sortedColumn;
        await this.applyFilters();
    }

    public async changePagination($event: any) {
        await this.applyFilters();
    }

    public async applyFilters() {
        await this.dataSource.applyFilters();
    }
}
