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
    SorterDirection,
    TableComponent,
} from "@nova-ui/bits";
import { Subject } from "rxjs";
import {
    takeUntil,
    tap,
} from "rxjs/operators";

import {
    RESULTS_PER_PAGE,
} from "./table-with-sort-data";
import { TableWithSortDataSource } from "./table-with-sort-data-source.service";
import { IServer } from "./types";

@Component({
    selector: "app-table-with-sort",
    templateUrl: "./table-with-sort.component.html",
    styleUrls: ["./table-with-sort.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DataSourceService,
            useClass: TableWithSortDataSource,
        },
    ],
})
export class TableWithSortComponent implements OnInit, OnDestroy, AfterViewInit {
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

    // pagination
    public page: number = 1;
    public pageSize: number = RESULTS_PER_PAGE;

    @ViewChild(TableComponent) table: TableComponent<IServer>;
    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

    private destroy$ = new Subject();

    constructor(
        @Inject(DataSourceService) private dataSource: TableWithSortDataSource<IServer>,
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

        await this.applyFilters();
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
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
