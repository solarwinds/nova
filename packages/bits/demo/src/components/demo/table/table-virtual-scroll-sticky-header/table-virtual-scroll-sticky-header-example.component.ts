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

import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    TrackByFunction,
    ViewChild,
} from "@angular/core";
import sample from "lodash/sample";
import { BehaviorSubject } from "rxjs";

import {
    ClientSideDataSource,
    IFilteringOutputs,
    TableStickyHeaderDirective,
} from "@nova-ui/bits";

interface IRandomUserTableModel {
    no: number;
    nameFirst: string;
    nameLast: string;
    city: string;
    postcode: number;
}

@Component({
    selector: "nui-table-virtual-scroll-sticky-header-example",
    templateUrl: "./table-virtual-scroll-sticky-header-example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ClientSideDataSource],
    standalone: false,
})
export class TableVirtualScrollStickyHeaderExampleComponent
    implements AfterViewInit
{
    @ViewChild(CdkVirtualScrollViewport)
    public viewport: CdkVirtualScrollViewport;
    // Note: Used only for demo purposes
    @ViewChild(TableStickyHeaderDirective)
    public stickyHeaderDirective: TableStickyHeaderDirective;

    public displayedColumns: string[] = [
        "no",
        "nameFirst",
        "nameLast",
        "city",
        "postcode",
    ];
    public items$ = new BehaviorSubject<IRandomUserTableModel[]>([]);

    public makeSticky: boolean = true;
    public itemSize: number = 40;
    public gridHeight = 400;
    public trackByNo: TrackByFunction<IRandomUserTableModel> = (
        index: number,
        item: IRandomUserTableModel
    ): number => item?.no;

    constructor(
        public dataSourceService: ClientSideDataSource<IRandomUserTableModel>
    ) {
        this.dataSourceService.setData(generateUsers(100000));
    }

    public ngAfterViewInit(): void {
        this.dataSourceService.outputsSubject.subscribe(
            (outputs: IFilteringOutputs) => {
                this.items$.next(outputs.repeat.itemsSource);
            }
        );

        this.dataSourceService.applyFilters();
    }

    // Note: Used only for demo purposes
    public updateStickyState(state: boolean): void {
        this.stickyHeaderDirective.tableStickyHeader = state;
        this.makeSticky = state;
    }
}

const PEOPLE = [
    "Elena",
    "Madelyn",
    "Baggio",
    "Josh",
    "Lukas",
    "Blake",
    "Frantz",
    "Dima",
    "Serhii",
    "Vita",
    "Vlad",
    "Ivan",
    "Dumitru",
];
const CITIES = [
    "Bucharest",
    "Kiev",
    "Austin",
    "Brno",
    "Frankfurt pe Main",
    "Sutton-under-Whitestonecliffe",
    "Vila Bela da Santíssima Trindade",
];
function generateUsers(length: number): IRandomUserTableModel[] {
    return Array.from({ length }).map((obj: unknown, id: number) => {
        const personName = sample(PEOPLE) || PEOPLE[0];
        return {
            no: id,
            postcode: id * 1000000 * id,
            city: sample(CITIES) || CITIES[0],
            nameFirst: personName,
            nameLast: "UnknownLast",
        };
    });
}
