import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { ClientSideDataSource, INovaFilteringOutputs, ISelection, PaginatorComponent, SelectorService } from "@nova-ui/bits";
import { Subscription } from "rxjs";

interface IExampleTableModel {
    position: number;
    item: string;
    description: string;
    status: string;
    location: string;
}

@Component({
    selector: "nui-table-select",
    providers: [ClientSideDataSource],
    templateUrl: "./table-select.example.component.html",
})
export class TableSelectExampleComponent implements AfterViewInit, OnDestroy {
    public displayedColumns = ["position", "item", "description", "status", "location"];
    public dataSource?: IExampleTableModel[] = [];
    public paginationTotal?: number;
    public selectedItems: IExampleTableModel[] = [];
    public selection: ISelection = {
        isAllPages: false,
        include: [2, 3],
        exclude: [
        ],
    };

    @ViewChild("filteringPaginator") filteringPaginator: PaginatorComponent;

    private outputsSubscription: Subscription;

    constructor(public dataSourceService: ClientSideDataSource<IExampleTableModel>,
        public selectorService: SelectorService) {
    }

    ngAfterViewInit(): void {
        this.dataSourceService.componentTree = {
            paginator: {
                componentInstance: this.filteringPaginator,
            },
        };
        this.outputsSubscription = this.dataSourceService.outputsSubject.subscribe((data: INovaFilteringOutputs) => {
            this.dataSource = data.repeat?.itemsSource;
            this.paginationTotal = data.paginator?.total;
        });
        this.applyFilters();
    }

    public async changePagination($event: any): Promise<void> {
        this.applyFilters();
    }

    public async applyFilters(): Promise<void> {
        this.dataSourceService.setData(getData());
        this.dataSourceService.applyFilters();
    }

    public ngOnDestroy(): void {
        this.outputsSubscription.unsubscribe();
    }

    public trackBy(index: number, item: IExampleTableModel): number {
        return item.position;
    }
}

/** Table data */
function getData(): IExampleTableModel[] {
    return [
        {
            position: 1,
            item: "FOCUS-SVR-02258123",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            status: "status_inactive",
            location: "Brno",
        },
        {
            position: 2,
            item: "Man-LT-JYJ4AD5",
            description: "Sed ut perspiciatis unde omnis iste natus error sit.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 3,
            item: "FOCUS-SVR-02258",
            description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 4,
            item: "Man-LT-JYJ4AD5",
            description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 5,
            item: "Man-LT-JYJ4AD5",
            description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 6,
            item: "Man-LT-JYJ4AD5",
            description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 7,
            item: "Man-LT-JYJ4AD5",
            description: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 8,
            item: "Man-LT-JYJ4AD5",
            description: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 9,
            item: "Man-LT-JYJ4AD5",
            description: "Quis autem vel eum iure reprehenderit qui in ea voluptate.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 10,
            item: "Man-LT-JYJ4AD5",
            description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 11,
            item: "FOCUS-SVR-111111",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            status: "status_inactive",
            location: "Brno",
        },
        {
            position: 12,
            item: "Man-LT-2222222",
            description: "Sed ut perspiciatis unde omnis iste natus error sit.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 13,
            item: "FOCUS-SVR-333333",
            description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 14,
            item: "Man-LT-444444",
            description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 15,
            item: "Man-LT-555555",
            description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 16,
            item: "Man-LT-666666",
            description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 17,
            item: "Man-LT-777777",
            description: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 18,
            item: "Man-LT-888888",
            description: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 19,
            item: "Man-LT-999999",
            description: "Quis autem vel eum iure reprehenderit qui in ea voluptate.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 20,
            item: "Man-LT-200000",
            description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.",
            status: "status_up",
            location: "Brno",
        },
    ];
}
