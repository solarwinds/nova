import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    ViewChild,
} from "@angular/core";
import {
    DataSourceService,
    IMenuItem,
    INovaFilteringOutputs,
    IRepeatItemConfig,
    ISorterChanges,
    LocalFilteringDataSource,
    nameof,
    PaginatorComponent,
    RepeatComponent,
    SearchComponent,
    SorterComponent,
    SorterDirection,
} from "@nova-ui/bits";
import {
    Subject,
} from "rxjs";
import {
    takeUntil,
    tap,
} from "rxjs/operators";

import {
    LOCAL_DATA,
    RESULTS_PER_PAGE,
} from "../filtered-view-with-list-data";
import {
    IServer,
    IServerFilters,
} from "../types";

@Component({
    selector: "app-filtered-view-with-list-list",
    templateUrl: "./filtered-view-list.component.html",
    styleUrls: ["./filtered-view-list.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilteredViewListComponent implements AfterViewInit, OnDestroy {
    public readonly sorterItems: IMenuItem[] = [
        {
            title: $localize`Name`,
            value: "name",
        },
        {
            title: $localize`Status`,
            value: "status",
        },
        {
            title: $localize`Location`,
            value: "location",
        },
    ];

    public readonly initialSortDirection = SorterDirection.ascending;
    public sortBy = this.sorterItems[0].value;

    public filteringState: INovaFilteringOutputs = {};

    // This value is obtained from the server and used to evaluate the total number of pages to display
    public totalItems: number = 0;

    // pagination
    public page: number = 1;
    public pageSize: number = RESULTS_PER_PAGE;

    public itemConfig: IRepeatItemConfig<IServer> = {
        trackBy: (index, item): string | undefined => item?.name,
    };

    @ViewChild(RepeatComponent) repeat: RepeatComponent;
    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
    @ViewChild(SearchComponent) search: SearchComponent;
    @ViewChild(SorterComponent) sorter: SorterComponent;

    private destroy$ = new Subject();

    constructor(
        @Inject(DataSourceService) private dataSource: LocalFilteringDataSource<IServer>,
        private changeDetection: ChangeDetectorRef
    ) {
        this.dataSource.setData(LOCAL_DATA);
    }

    public ngAfterViewInit(): void {
        this.dataSource.registerComponent({
            paginator: { componentInstance: this.paginator },
            search: { componentInstance: this.search },
            sorter: { componentInstance: this.sorter },
            repeat: { componentInstance: this.repeat },
        });

        this.search.focusChange.pipe(
            tap(async (focused: boolean) => {
                // we want to perform a new search on blur event
                // only if the search filter changed
                if (!focused && this.dataSource.filterChanged(nameof<IServerFilters>("search"))) {
                    await this.applyFilters();
                }
            }),
            takeUntil(this.destroy$)
        ).subscribe();

        this.dataSource.outputsSubject.pipe(
            tap((data: INovaFilteringOutputs) => {
                this.filteringState = data;

                this.totalItems = data.paginator?.total ?? 0;

                this.changeDetection.detectChanges();
            }),
            takeUntil(this.destroy$)
        ).subscribe();

        // make 1st call to retrieve initial results
        this.applyFilters();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async onSearch(): Promise<void> {
        await this.applyFilters();
    }

    public async onCancelSearch(): Promise<void> {
        await this.applyFilters();
    }

    public async applyFilters(): Promise<void> {
        await this.dataSource.applyFilters();
    }

    public async onSorterAction(changes: ISorterChanges): Promise<void> {
        this.sortBy = changes.newValue.sortBy;
        await this.applyFilters();
    }
}
