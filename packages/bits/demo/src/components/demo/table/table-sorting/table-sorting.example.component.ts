import { AfterViewInit, Component, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";

import {
    ClientSideDataSource,
    INovaFilteringOutputs,
    ISortedItem,
    SorterDirection,
    TableComponent,
} from "@nova-ui/bits";

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
    selector: "nui-table-sorting-example",
    templateUrl: "./table-sorting.example.component.html",
    providers: [ClientSideDataSource],
})
export class TableSortingExampleComponent implements AfterViewInit, OnDestroy {
    public displayedColumns = [
        "position",
        "name",
        "features",
        "asset",
        "location",
        "status",
        "outages",
        "checks",
    ];
    public dataSource?: IExampleTableModel[] = getData();
    public sortedColumn: ISortedItem = {
        sortBy: "position",
        direction: SorterDirection.ascending,
    };
    public nameSortedDesc = false;
    @ViewChild("sortableTable")
    sortableTable: TableComponent<IExampleTableModel>;
    private outputsSubscription: Subscription;

    constructor(
        public dataSourceService: ClientSideDataSource<IExampleTableModel>
    ) {
        dataSourceService.setData(this.dataSource);
    }

    public sortData(sortedColumn: ISortedItem) {
        this.sortedColumn = sortedColumn;
        this.dataSourceService.applyFilters();
    }

    public sortByName() {
        this.nameSortedDesc = !this.nameSortedDesc;
        this.sortedColumn = {
            sortBy: "name",
            direction: this.nameSortedDesc
                ? SorterDirection.descending
                : SorterDirection.ascending,
        };
    }

    ngAfterViewInit() {
        this.dataSourceService.registerComponent(
            this.sortableTable.getFilterComponents()
        );
        this.outputsSubscription =
            this.dataSourceService.outputsSubject.subscribe(
                (data: INovaFilteringOutputs) => {
                    this.dataSource = data.repeat?.itemsSource;
                }
            );

        this.dataSourceService.applyFilters();
    }

    ngOnDestroy() {
        this.outputsSubscription.unsubscribe();
    }
}

/** Table data */
function getData(): IExampleTableModel[] {
    return [
        {
            position: 1,
            name: "FOCUS-SVR-02258",
            features: [
                "remote-access-vpn-tunnel",
                "tools",
                "database",
                "orion-ape-backup",
                "patch-manager01",
            ],
            asset: "Company secrets",
            location: "Kyiv",
            status: "Critical",
            outages: 17,
            checks: [
                {
                    icon: "status_up",
                    num: 25,
                },
            ],
        },
        {
            position: 2,
            name: "Man-LT-JYJ4AD5",
            features: [
                "remote-access-vpn-tunnel",
                "tools",
                "database",
                "orion-ape-backup",
                "patch-manager01",
            ],
            asset: "Workstation",
            location: "Prague",
            status: "Down",
            outages: 71,
            checks: [
                {
                    icon: "status_critical",
                    num: 25,
                },
            ],
        },
        {
            position: 3,
            name: "FOCUS-SVR-02258",
            features: [
                "remote-access-vpn-tunnel",
                "tools",
                "database",
                "orion-ape-backup",
                "patch-manager01",
            ],
            asset: "Workstation",
            location: "London",
            status: "Inactive",
            outages: 56,
            checks: [
                {
                    icon: "status_down",
                    num: 25,
                },
            ],
        },
        {
            position: 4,
            name: "ABN-LT-JYJ4AD5",
            features: [
                "remote-access-vpn-tunnel",
                "tools",
                "database",
                "orion-ape-backup",
                "patch-manager01",
            ],
            asset: "Patents",
            location: "NY",
            status: "Warning",
            outages: 48,
            checks: [
                {
                    icon: "status_up",
                    num: 25,
                },
            ],
        },
        {
            position: 5,
            name: "KLM-LFT-JAD5",
            features: [
                "remote-access-vpn-tunnel",
                "tools",
                "database",
                "orion-ape-backup",
                "patch-manager01",
            ],
            asset: "Blueprints",
            location: "Austin",
            status: "Active",
            outages: 81,
            checks: [
                {
                    icon: "status_up",
                    num: 25,
                },
            ],
        },
    ];
}
