import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    ViewChild,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import {
    ClientSideDataSource,
    DataSourceService,
    IMenuItem,
    INovaFilteringOutputs,
    IRepeatItemConfig,
    ISorterChanges,
    ListService,
    nameof,
    PaginatorComponent,
    RepeatComponent,
    RepeatSelectionMode,
    SearchComponent,
    SelectionType,
    SorterComponent,
    SorterDirection,
} from "@nova-ui/bits";

import { LOCAL_DATA, RESULTS_PER_PAGE } from "./selection-list-data";
import { IServer, IServerFilters } from "./types";

@Component({
    selector: "app-selection-list",
    templateUrl: "./selection-list.component.html",
    styleUrls: ["./selection-list.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: DataSourceService,
            useClass: ClientSideDataSource,
        },
    ],
})
export class SelectionListComponent implements AfterViewInit, OnDestroy {
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
        trackBy: (index, item) => item?.name,
    };

    @ViewChild(RepeatComponent) repeat: RepeatComponent;
    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;
    @ViewChild(SearchComponent) search: SearchComponent;
    @ViewChild(SorterComponent) sorter: SorterComponent;

    private destroy$ = new Subject();

    constructor(
        @Inject(DataSourceService)
        private dataSource: ClientSideDataSource<IServer>,
        private changeDetection: ChangeDetectorRef,
        private listService: ListService
    ) {
        this.dataSource.setData(LOCAL_DATA);
    }

    public async ngAfterViewInit() {
        this.dataSource.registerComponent({
            paginator: { componentInstance: this.paginator },
            search: { componentInstance: this.search },
            sorter: { componentInstance: this.sorter },
            repeat: { componentInstance: this.repeat },
        });

        this.search.focusChange
            .pipe(
                tap(async (focused: boolean) => {
                    // we want to perform a new search on blur event
                    // only if the search filter changed
                    if (
                        !focused &&
                        this.dataSource.filterChanged(
                            nameof<IServerFilters>("search")
                        )
                    ) {
                        await this.applyFilters();
                    }
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();

        this.dataSource.outputsSubject
            .pipe(
                tap((data: INovaFilteringOutputs) => {
                    this.filteringState = { ...this.filteringState, ...data };
                    this.filteringState = this.listService.updateSelectionState(
                        this.filteringState
                    );

                    this.totalItems = data.paginator?.total ?? 0;

                    this.changeDetection.detectChanges();
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();

        // make 1st call to retrieve initial results
        await this.applyFilters();
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public async onSearch() {
        await this.applyFilters();
    }

    public async onCancelSearch() {
        await this.applyFilters();
    }

    public async applyFilters() {
        await this.dataSource.applyFilters();
    }

    public async onSorterAction(changes: ISorterChanges) {
        this.sortBy = changes.newValue.sortBy;
        await this.applyFilters();
    }

    public onSelectorOutput(selectionType: SelectionType) {
        this.filteringState = this.listService.applySelector(
            selectionType,
            this.filteringState
        );
    }

    public onRepeatOutput(selectedItems: IServer[]) {
        this.filteringState = this.listService.selectItems(
            selectedItems,
            RepeatSelectionMode.multi,
            this.filteringState
        );
    }
}
