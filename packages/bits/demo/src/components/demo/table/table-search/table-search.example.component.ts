// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { AfterViewInit, Component, OnDestroy, viewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

import {
    ClientSideDataSource,
    INovaFilteringOutputs,
    SearchComponent,
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
    selector: "nui-table-search-example",
    providers: [ClientSideDataSource],
    templateUrl: "./table-search.example.component.html",
    styleUrls: ["./table-search.example.component.less"],
    standalone: false,
})
export class TableSearchExampleComponent implements AfterViewInit, OnDestroy {
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
    public dataSource: any = [];
    public searchTerm: string;
    public columnsToApplySearch: any = [];
    readonly filteringSearch = viewChild.required<SearchComponent>("filteringSearch");
    readonly filteringTable = viewChild.required<TableComponent<IExampleTableModel>>("filteringTable");

    private outputsSubscription: Subscription;
    private searchSubscription: Subscription;

    constructor(
        public dataSourceService: ClientSideDataSource<IExampleTableModel>
    ) {
        dataSourceService.setData(getData());
    }

    public ngAfterViewInit(): void {
        this.dataSourceService.componentTree = {
            search: {
                componentInstance: this.filteringSearch(),
            },
        };
        this.outputsSubscription =
            this.dataSourceService.outputsSubject.subscribe(
                (data: INovaFilteringOutputs) => {
                    this.dataSource = data.repeat?.itemsSource;
                }
            );
        this.searchSubscription = this.filteringSearch().inputChange
            .pipe(debounceTime(500))
            .subscribe(() => {
                this.onSearch(undefined);
            });

        this.dataSourceService.applyFilters();
    }

    public applySearchField(): void {
        if (!this.columnsToApplySearch.length) {
            this.columnsToApplySearch = ["location"];
        } else {
            this.columnsToApplySearch = [];
        }
    }

    public onSearch(value?: string): void {
        this.dataSourceService.setSearchProperties(this.columnsToApplySearch);
        this.dataSourceService.applyFilters();
    }

    public onSearchCancel(): void {
        this.dataSourceService.applyFilters();
    }

    public ngOnDestroy(): void {
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
            features: [
                "remote-access-vpn-tunnel",
                "tools",
                "database",
                "orion-ape-backup",
                "patch-manager01",
            ],
            asset: "Workstation",
            location: "Brno",
            status: "Active",
            outages: 90,
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
            location: "Brno",
            status: "Active",
            outages: 9,
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
            location: "Brno",
            status: "Active",
            outages: 17,
            checks: [
                {
                    icon: "status_down",
                    num: 25,
                },
            ],
        },
        {
            position: 4,
            name: "Man-ATFLT-BRNO1",
            features: [
                "remote-access-vpn-tunnel",
                "tools",
                "database",
                "orion-ape-backup",
                "patch-manager01",
            ],
            asset: "Workstation",
            location: "Austin",
            status: "Active",
            outages: 3,
            checks: [
                {
                    icon: "status_up",
                    num: 25,
                },
            ],
        },
        {
            position: 5,
            name: "Man-LTF-JYAF75J4AD5",
            features: [
                "remote-access-vpn-tunnel",
                "tools",
                "database",
                "orion-ape-backup",
                "patch-manager01",
            ],
            asset: "Workstation",
            location: "Austin",
            status: "Active",
            outages: 56,
            checks: [
                {
                    icon: "status_up",
                    num: 25,
                },
            ],
        },
    ];
}
