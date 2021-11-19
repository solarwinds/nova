import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import {
    ClientSideDataSource,
    INovaFilteringOutputs, ISelection, PaginatorComponent, SearchComponent, TableComponent,
} from "@nova-ui/bits";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

interface IExampleTableModel {
    position: number;
    name: string;
    features: any;
    asset: string;
    location: string;
    status: string;
    outages: number;
    checks: any;
}

@Component({
    selector: "nui-table-search-with-select-and-pagination",
    providers: [ClientSideDataSource],
    templateUrl: "./table-search-with-select-and-pagination.example.component.html",
    styleUrls: ["./table-search-with-select-and-pagination.example.component.less"],
})
export class TableSearchWithSelectAndPaginationComponent implements AfterViewInit, OnDestroy {
    public displayedColumns = ["position", "name", "features", "asset", "location", "status", "outages", "checks"];
    public dataSource: any = [];
    public paginationTotal?: number;
    public searchTerm: string;
    public selection: ISelection = {
        isAllPages: false,
        include: [],
        exclude: [],
    };
    @ViewChild("filteringPaginator") filteringPaginator: PaginatorComponent;
    @ViewChild("filteringSearch") filteringSearch: SearchComponent;
    @ViewChild("filteringTable") filteringTable: TableComponent<IExampleTableModel>;

    private outputsSubscription: Subscription;
    private searchSubscription: Subscription;

    constructor(public dataSourceService: ClientSideDataSource<IExampleTableModel>) {
        dataSourceService.setData(getData());
    }

    ngAfterViewInit(): void {
        this.dataSourceService.componentTree = {
            search: {
                componentInstance: this.filteringSearch,
            },
            paginator: {
                componentInstance: this.filteringPaginator,
            },
        };
        this.outputsSubscription = this.dataSourceService.outputsSubject.subscribe((data: INovaFilteringOutputs) => {
            this.dataSource = data.repeat?.itemsSource;
            this.paginationTotal = data.paginator?.total;
        });
        this.searchSubscription = this.filteringSearch.inputChange.pipe(debounceTime(500))
            .subscribe(() => {
                this.onSearch(undefined);
            });

        this.dataSourceService.applyFilters();
    }

    public async onSearch(value?: string): Promise<void> {
        await this.dataSourceService.applyFilters();
    }

    public async onSearchCancel(): Promise<void> {
        await this.dataSourceService.applyFilters();
    }

    public async changePagination($event: any): Promise<void> {
        await this.dataSourceService.applyFilters();
    }

    public trackBy(index: number, item: IExampleTableModel): number {
        return item.position;
    }

    ngOnDestroy(): void {
        this.searchSubscription.unsubscribe();
        this.outputsSubscription.unsubscribe();
    }
}

/** Table data */
function getData(): IExampleTableModel[] {
    return [
        {
            position: 1,
            name: "FOCUS-SVR-02258",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 90,
            checks: [{
                icon: "status_up",
                num: 25,
            }],
        },
        {
            position: 2,
            name: "Man-LT-JYJ4AD5",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 9,
            checks: [{
                icon: "status_critical",
                num: 25,
            }],
        },
        {
            position: 3,
            name: "FOCUS-SVR-02258",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 17,
            checks: [{
                icon: "status_down",
                num: 25,
            }],
        },
        {
            position: 4,
            name: "Man-ATFLT-BRNO1",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Austin",
            status: "Active",
            outages: 3,
            checks: [{
                icon: "status_up",
                num: 25,
            }],
        },
        {
            position: 5,
            name: "Man-LTF-JYAF75J4AD5",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Austin",
            status: "Active",
            outages: 56,
            checks: [{
                icon: "status_up",
                num: 25,
            }],
        },
        {
            position: 6,
            name: "Man-LTF-JYAF75J4AD5",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Kyiv",
            status: "Active",
            outages: 52,
            checks: [{
                icon: "status_up",
                num: 28,
            }],
        },
        {
            position: 7,
            name: "Man-LTF-JYAF75J4AD5",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Paris",
            status: "Active",
            outages: 12,
            checks: [{
                icon: "status_up",
                num: 32,
            }],
        },
        {
            position: 8,
            name: "FOCUS-SVR-02258",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Kyiv",
            status: "Active",
            outages: 11,
            checks: [{
                icon: "status_up",
                num: 10,
            }],
        },
        {
            position: 9,
            name: "FOCUS-SVR-02258",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Berlin",
            status: "Active",
            outages: 79,
            checks: [{
                icon: "status_up",
                num: 43,
            }],
        },
        {
            position: 10,
            name: "FOCUS-SVR-02258",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 8,
            checks: [{
                icon: "status_critical",
                num: 12,
            }],
        },
        {
            position: 11,
            name: "FOCUS-SVR-02258",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Paris",
            status: "Active",
            outages: 10,
            checks: [{
                icon: "status_critical",
                num: 12,
            }],
        },
        {
            position: 12,
            name: "FOCUS-SVR-02258",
            features: ["remote-access-vpn-tunnel", "tools", "database", "orion-ape-backup", "patch-manager01"],
            asset: "Workstation",
            location: "Amsterdam",
            status: "Active",
            outages: 22,
            checks: [{
                icon: "status_up",
                num: 32,
            }],
        },
    ];
}
