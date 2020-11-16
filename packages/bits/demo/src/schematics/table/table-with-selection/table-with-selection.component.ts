import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import {
    DataSourceService,
    INovaFilteringOutputs,
    ISelection,
    ISortedItem,
    nameof,
    PaginatorComponent,
    SearchComponent,
    SorterDirection,
    TableComponent,
} from "@solarwinds/nova-bits";
import { Subject } from "rxjs";
import {
    debounceTime,
    takeUntil,
    tap,
} from "rxjs/operators";

import {
    RESULTS_PER_PAGE,
} from "./table-with-selection-data";
import { TableWithSelectionDataSource } from "./table-with-selection-data-source.service";
import { IServer, IServerFilters } from "./types";

@Component({
    selector: "app-table-with-selection",
    templateUrl: "./table-with-selection.component.html",
    styleUrls: ["./table-with-selection.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DataSourceService,
            useClass: TableWithSelectionDataSource,
        },
    ],
})
export class TableWithSelectionComponent implements OnInit, OnDestroy, AfterViewInit {
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
        @Inject(DataSourceService) private dataSource: TableWithSelectionDataSource<IServer>,
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

    public onSelectionChanged(selection: ISelection) {
        // do something with the selection

        // make component aware of the new selection value
        // so it's displayed correctly
        this.changeDetection.detectChanges();
    }

    // trackBy handler used to identify uniquely each item in the table
    public trackBy(index: number, item: IServer) {
        return item.name;
    }

    public async applyFilters() {
        await this.dataSource.applyFilters();
    }
}
