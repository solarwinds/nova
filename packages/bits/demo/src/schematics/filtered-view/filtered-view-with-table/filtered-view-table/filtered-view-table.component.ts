import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import {
    DataSourceService,
    INovaFilteringOutputs,
    LocalFilteringDataSource,
    PaginatorComponent,
    TableComponent,
} from "@nova-ui/bits";
import { Subject } from "rxjs";
import {
    takeUntil,
    tap,
} from "rxjs/operators";

import {
    LOCAL_DATA,
    RESULTS_PER_PAGE,
} from "../filtered-view-with-table-data";
import { IServer } from "../types";

@Component({
    selector: "app-filtered-view-with-table-table",
    templateUrl: "./filtered-view-table.component.html",
    styleUrls: ["./filtered-view-table.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class FilteredViewTableComponent implements OnDestroy, AfterViewInit {
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
        @Inject(DataSourceService) private dataSource: LocalFilteringDataSource<IServer>
    ) {
        this.dataSource.setData(LOCAL_DATA);
    }

    public async ngAfterViewInit() {
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

    public async changePagination($event: any) {
        await this.applyFilters();
    }

    public async applyFilters() {
        await this.dataSource.applyFilters();
    }
}
