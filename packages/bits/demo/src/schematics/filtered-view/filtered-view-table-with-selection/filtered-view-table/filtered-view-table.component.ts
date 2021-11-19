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
    ISelection,
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
} from "../filtered-view-table-with-selection-data";
import { FilteredViewTableWithSelectionDataSource } from "../filtered-view-table-with-selection-data-source.service";
import { IServer } from "../types";

@Component({
    selector: "app-filtered-view-table-with-selection-table",
    templateUrl: "./filtered-view-table.component.html",
    styleUrls: ["./filtered-view-table.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class FilteredViewTableComponent implements OnInit, OnDestroy, AfterViewInit {
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

    // row selection
    public selectedItems: IServer[] = [];
    public selection: ISelection = {
        isAllPages: false,
        include: ["ABERN-SVR-ATQU9404"],
        exclude: [],
    };

    @ViewChild(TableComponent) table: TableComponent<IServer>;
    @ViewChild(SearchComponent) search: SearchComponent;
    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

    private destroy$ = new Subject();

    constructor(
        @Inject(DataSourceService) private dataSource: FilteredViewTableWithSelectionDataSource<IServer>,
        private changeDetection: ChangeDetectorRef
    ) {
    }

    public ngOnInit(): void {
        this.dataSource.busy.pipe(
            tap(val => {
                this.isBusy = val;
                this.changeDetection.detectChanges();
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }

    public ngAfterViewInit(): void {
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
            tap(async () => this.onSearch()),
            takeUntil(this.destroy$)
        ).subscribe();

        this.applyFilters();
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

    public async sortData(sortedColumn: ISortedItem): Promise<void> {
        this.sortedColumn = sortedColumn;
        await this.applyFilters();
    }

    public async changePagination($event: any): Promise<void> {
        await this.applyFilters();
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

    public async applyFilters(): Promise<void> {
        await this.dataSource.applyFilters();
    }
}
