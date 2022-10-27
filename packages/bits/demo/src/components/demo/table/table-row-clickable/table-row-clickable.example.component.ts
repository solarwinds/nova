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

import { AfterViewInit, Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import {
    ClientSideDataSource,
    INovaFilteringOutputs,
    ISelection,
    SelectorService,
} from "@nova-ui/bits";

interface IExampleTableModel {
    position: number;
    description: string;
    status: string;
    location: string;
}

@Component({
    selector: "nui-table-row-clickable",
    providers: [ClientSideDataSource],
    templateUrl: "./table-row-clickable.example.component.html",
})
export class TableRowClickableExampleComponent
    implements AfterViewInit, OnDestroy
{
    public displayedColumns = [
        "position",
        "description",
        "status",
        "location",
        "actions",
    ];
    public dataSource?: IExampleTableModel[] = [];
    public selectedItems: IExampleTableModel[] = [];
    public selection: ISelection = {
        isAllPages: false,
        include: [2, 3],
        exclude: [],
    };

    private outputsSubscription: Subscription;

    constructor(
        public dataSourceService: ClientSideDataSource<IExampleTableModel>,
        public selectorService: SelectorService
    ) {}

    ngAfterViewInit() {
        this.outputsSubscription =
            this.dataSourceService.outputsSubject.subscribe(
                (data: INovaFilteringOutputs) => {
                    this.dataSource = data.repeat?.itemsSource;
                }
            );
        this.applyFilters();
    }

    public applyFilters() {
        this.dataSourceService.setData(getData());
        this.dataSourceService.applyFilters();
    }

    public ngOnDestroy() {
        this.outputsSubscription.unsubscribe();
    }

    public trackBy(index: number, item: IExampleTableModel) {
        return item.position;
    }
}

/** Table data */
function getData(): IExampleTableModel[] {
    return [
        {
            position: 1,
            description:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            status: "status_inactive",
            location: "Brno",
        },
        {
            position: 2,
            description: "Sed ut perspiciatis unde omnis iste natus error sit.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 3,
            description:
                "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 4,
            description:
                "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 5,
            description:
                "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 6,
            description:
                "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 7,
            description:
                "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 8,
            description:
                "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 9,
            description:
                "Quis autem vel eum iure reprehenderit qui in ea voluptate.",
            status: "status_up",
            location: "Brno",
        },
        {
            position: 10,
            description:
                "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.",
            status: "status_up",
            location: "Brno",
        },
    ];
}
