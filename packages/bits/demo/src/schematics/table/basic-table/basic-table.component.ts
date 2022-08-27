import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import {
    ClientSideDataSource,
    DataSourceService,
    INovaFilteringOutputs,
    PaginatorComponent,
    TableComponent,
} from "@nova-ui/bits";

import { LOCAL_DATA, RESULTS_PER_PAGE } from "./basic-table-data";
import { IServer } from "./types";

@Component({
    selector: "app-basic-table",
    templateUrl: "./basic-table.component.html",
    styleUrls: ["./basic-table.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: DataSourceService,
            useClass: ClientSideDataSource,
        },
    ],
})
export class BasicTableComponent implements OnDestroy, AfterViewInit {
    public items: IServer[] = [];
    // This value is obtained from the server and used to evaluate the total number of pages to display
    public totalItems: number = 0;

    // columns of the table
    public displayedColumns = ["name", "location", "status"];

    // pagination
    public page: number = 1;
    public pageSize: number = RESULTS_PER_PAGE;

    @ViewChild(TableComponent) table: TableComponent<IServer>;
    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

    private destroy$ = new Subject();

    constructor(
        @Inject(DataSourceService)
        private dataSource: ClientSideDataSource<IServer>
    ) {
        this.dataSource.setData(LOCAL_DATA);
    }

    public async ngAfterViewInit() {
        this.dataSource.registerComponent({
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

        await this.applyFilters();
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async changePagination($event: any) {
        await this.applyFilters();
    }

    public async applyFilters() {
        await this.dataSource.applyFilters();
    }
}
