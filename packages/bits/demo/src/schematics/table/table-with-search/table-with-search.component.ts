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
    PaginatorComponent,
    SearchComponent,
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
} from "./table-with-search-data";
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
})
export class TableWithSearchComponent implements OnInit, OnDestroy, AfterViewInit {
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

    private destroy$ = new Subject();

    constructor(
        @Inject(DataSourceService) private dataSource: TableWithSearchDataSource<IServer>,
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

    public async changePagination($event: any): Promise<void> {
        await this.applyFilters();
    }

    public async applyFilters(): Promise<void> {
        await this.dataSource.applyFilters();
    }
}
