import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import {
    ClientSideDataSource,
    INovaFilteringOutputs, SearchComponent, TableComponent,
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
    selector: "nui-table-search-example",
    providers: [ClientSideDataSource],
    templateUrl: "./table-search.example.component.html",
    styleUrls: ["./table-search.example.component.less"],
})
export class TableSearchExampleComponent implements AfterViewInit, OnDestroy {
    public displayedColumns = ["position", "name", "features", "asset", "location", "status", "outages", "checks"];
    public dataSource: any = [];
    public searchTerm: string;
    public columnsToApplySearch: any = [];
    @ViewChild("filteringSearch") filteringSearch: SearchComponent;
    @ViewChild("filteringTable") filteringTable: TableComponent<IExampleTableModel>;

    private outputsSubscription: Subscription;
    private searchSubscription: Subscription;

    constructor(public dataSourceService: ClientSideDataSource<IExampleTableModel>) {
        dataSourceService.setData(getData());
    }

    ngAfterViewInit() {
        this.dataSourceService.componentTree = {
            search: {
                componentInstance: this.filteringSearch,
            },
        };
        this.outputsSubscription = this.dataSourceService.outputsSubject.subscribe((data: INovaFilteringOutputs) => {
            this.dataSource = data.repeat?.itemsSource;
        });
        this.searchSubscription = this.filteringSearch.inputChange.pipe(debounceTime(500))
            .subscribe(() => {
                this.onSearch(undefined);
            });

        this.dataSourceService.applyFilters();
    }

    public applySearchField() {
        if (!this.columnsToApplySearch.length) {
            this.columnsToApplySearch = ["location"];
        } else {
            this.columnsToApplySearch = [];
        }
    }

    public onSearch(value?: string) {
        this.dataSourceService.setSearchProperties(this.columnsToApplySearch);
        this.dataSourceService.applyFilters();
    }

    public onSearchCancel() {
        this.dataSourceService.applyFilters();
    }

    ngOnDestroy() {
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
    ];
}
