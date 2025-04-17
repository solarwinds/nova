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
import { Observable } from "rxjs";
// eslint-disable-next-line import/no-deprecated
import { map, startWith, switchMap, tap } from "rxjs/operators";

import {
    ClientSideDataSource,
    IFilteringOutputs,
    TableStickyHeaderDirective,
} from "@nova-ui/bits";

interface IRandomUserTableModel {
    no: number;
    icon: string;
    nameFirst: string;
    nameLast: string;
    city: string;
    postcode: number;
}

@Component({
    selector: "nui-table-virtual-scroll-sticky-header-test-example",
    templateUrl: "./table-virtual-scroll-sticky-header-test-example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ClientSideDataSource],
    standalone: false
})
export class TableVirtualScrollStickyHeaderTestExampleComponent
    implements AfterViewInit
{
    @ViewChild(CdkVirtualScrollViewport)
    public viewport: CdkVirtualScrollViewport;
    // Note: Used only for demo purposes
    @ViewChild(TableStickyHeaderDirective)
    public stickyHeaderDirective: TableStickyHeaderDirective;

    // Note: Mock items list is used to fake that the data is already loaded
    // and let CDK Viewport perform the scrolling on a known number of items
    public placeholderItems: undefined[] = [];
    public visibleItems$: Observable<IRandomUserTableModel[]>;
    // The dynamically changed array of items to render by the table
    public displayedColumns: string[] = [
        "no",
        "icon",
        "nameFirst",
        "nameLast",
        "city",
        "postcode",
    ];

    public makeSticky: boolean = true;
    public itemSize: number = 40;
    public gridHeight = 400;
    // trackBy handler used to identify uniquely each item in the table
    public trackByNo: TrackByFunction<IRandomUserTableModel> = (
        index: number,
        item: IRandomUserTableModel
    ): number => item?.no;

    constructor(
        public dataSourceService: ClientSideDataSource<IRandomUserTableModel>
    ) {
        // Note: Initiating data source with data to be displayed
        this.dataSourceService.setData(generateUsers(100000));
    }

    public ngAfterViewInit(): void {
        this.dataSourceService.componentTree = {
            // Note: Using paginator as filter to be able to get specific range
            paginator: {
                componentInstance: {
                    getFilters: () => ({
                        value: this.viewport.getRenderedRange(),
                    }),
                },
            },
        };

        // Note: Creating a stream of visible items to be bound to the table and increase the performance
        this.visibleItems$ = this.viewport.renderedRangeStream.pipe(
            // eslint-disable-next-line import/no-deprecated
            startWith({ start: 0, end: 10 }),
            // Note: On range change applying filters
            tap(async () => this.dataSourceService.applyFilters()),
            // Subscribing to the filter results transforming and merging them into the stream
            // eslint-disable-next-line import/no-deprecated
            switchMap(() =>
                this.dataSourceService.outputsSubject.pipe(
                    map((result: IFilteringOutputs) => {
                        // Updating mock items list
                        if (
                            this.placeholderItems.length !==
                            result.paginator.total
                        ) {
                            this.placeholderItems = Array.from({
                                length: result.paginator.total,
                            });
                        }
                        // Mapping the values to array to be able to bind them to the table dataSource
                        return result.repeat.itemsSource;
                    })
                )
            )
        );
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
const ICONS = ["status_up", "status_unplugged"];

function generateUsers(length: number): IRandomUserTableModel[] {
    let peopleIndex = 0;
    let citiesIndex = 0;

    return Array.from({ length }).map((obj: unknown, no: number) => {
        const nameFirst = PEOPLE[peopleIndex];
        const city = CITIES[citiesIndex];

        // wrap indexes when we reach the last one
        peopleIndex = (peopleIndex + 1) % PEOPLE.length;
        citiesIndex = (citiesIndex + 1) % CITIES.length;

        return {
            no,
            icon: ICONS[no % 2],
            nameFirst,
            nameLast: "UnknownLast",
            city,
            postcode: 1000000,
        };
    });
}
