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

import {
    Component,
    Inject,
    Injectable,
    OnDestroy,
    ViewChild,
} from "@angular/core";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import { Subject, Subscription } from "rxjs";
import { delay } from "rxjs/operators";

import {
    DataSourceService,
    IFilteringOutputs,
    IFilters,
    LocalFilteringDataSource,
    RepeatComponent,
} from "@nova-ui/bits";

import {
    ExampleItem,
    ICustomDSFilteredData,
    IFilterGroupItem,
} from "./custom-data-source-filter-group/public-api";

const RANDOM_ARRAY = [
    { color: "regular-azure", status: "Critical" },
    { color: "regular-black", status: "Warning" },
    { color: "regular-blue", status: "Up" },
    { color: "regular-yellow", status: "Critical" },
    { color: "regular-yellow", status: "Warning" },
    { color: "regular-black", status: "Up" },
    { color: "regular-blue", status: "Up" },
    { color: "regular-azure", status: "Up" },
    { color: "regular-blue", status: "Up" },
    { color: "regular-azure", status: "Critical" },
];

const filterGroupItems: IFilterGroupItem[] = [
    {
        id: "color",
        title: "Color",
        expanded: true,
        allFilterOptions: [
            {
                value: "azure",
                displayValue: "Azure",
                count: 3,
            },
            {
                value: "black",
                displayValue: "Black",
                count: 2,
            },
            {
                value: "blue",
                displayValue: "Blue",
                count: 3,
            },
            {
                value: "yellow",
                displayValue: "Yellow",
                count: 2,
            },
        ],
        selectedFilterValues: [],
    },
    {
        id: "status",
        title: "Status",
        allFilterOptions: [
            {
                value: "warning",
                displayValue: "Warning",
                count: 2,
            },
            {
                value: "critical",
                displayValue: "Critical",
                count: 2,
            },
            {
                value: "up",
                displayValue: "Up",
                count: 5,
            },
        ],
        selectedFilterValues: [],
    },
    {
        id: "vendor",
        title: "Vendors",
        allFilterOptions: [],
        selectedFilterValues: [],
    },
];

/** @ignore */
@Injectable()
export class FakeHTTPService {
    public receiveFilteredDataSubject: Subject<ICustomDSFilteredData> =
        new Subject<ICustomDSFilteredData>();
    public getFilteredDataSubject: Subject<IFilters> = new Subject<IFilters>();

    constructor() {}

    public async getData(filters: IFilters): Promise<ICustomDSFilteredData> {
        this.getFilteredDataSubject.next(filters);

        return new Promise((resolve) => {
            this.receiveFilteredDataSubject.subscribe(
                (filteredData: ICustomDSFilteredData) => {
                    resolve(filteredData);
                }
            );
        });
    }

    public receiveFilteredData(filteredData: ICustomDSFilteredData): void {
        this.receiveFilteredDataSubject.next(filteredData);
    }
}

/** @ignore */
@Component({
    selector: "nui-fake-filtering-datasource-backend-component",
    template: ``,
    providers: [
        {
            provide: DataSourceService,
            useClass: LocalFilteringDataSource,
        },
    ],
    standalone: false
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class FakeServer implements OnDestroy {
    public filterGroupItems: IFilterGroupItem[] = filterGroupItems;
    public filteringState: IFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
        color: [],
        status: [],
    };

    private filterGroupSubscriptions: Array<Subscription> = [];

    @ViewChild(RepeatComponent) filteringRepeat: RepeatComponent;

    constructor(
        @Inject(DataSourceService)
        private dataSourceService: DataSourceService<ExampleItem>,
        @Inject(FakeHTTPService) private httpService: FakeHTTPService
    ) {
        (
            this.dataSourceService as LocalFilteringDataSource<ExampleItem>
        ).setData(RANDOM_ARRAY);

        this.filterGroupSubscriptions.push(
            this.dataSourceService.outputsSubject.subscribe(
                (filteringState: IFilteringOutputs) => {
                    this.filteringState = filteringState;
                    this.recalculateCounts(filteringState);
                }
            )
        );

        this.filterGroupSubscriptions.push(
            this.httpService.getFilteredDataSubject
                .pipe(delay(500))
                .subscribe(async (filters: IFilters) => {
                    this.filteringState =
                        await this.dataSourceService.getFilteredData(filters);
                    this.recalculateCounts(this.filteringState);
                    this.sendFilteredData();
                })
        );
    }

    private sendFilteredData(): void {
        this.httpService.receiveFilteredData({
            filterGroupItems: this.filterGroupItems,
            filteringState: this.filteringState,
        });
    }

    private recalculateCounts(filterData: IFilteringOutputs): void {
        this.filterGroupItems.forEach((filterGroupItem) => {
            filterGroupItem.allFilterOptions.forEach((filterOption) => {
                const counts = filterData[filterGroupItem.id];

                if (!_isEmpty(counts)) {
                    filterOption.count = counts[filterOption.value];
                }
            });
        });
    }

    public hasItems(): boolean {
        return !_isEmpty(_get(this, "filteringState.repeat.itemsSource"));
    }

    public ngOnDestroy(): void {
        this.filterGroupSubscriptions.forEach((subscription) =>
            subscription.unsubscribe()
        );
    }
}
