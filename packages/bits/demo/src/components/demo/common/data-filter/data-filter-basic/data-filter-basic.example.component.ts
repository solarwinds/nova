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
    AfterViewInit,
    Component,
    EventEmitter,
    Injectable,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import moment from "moment/moment";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    DataFilterService,
    IFilter,
    IFilterPub,
    IMenuItem,
    INovaFilteringOutputs,
    IRange,
    ISorterChanges,
    ITimeframe,
    LocalFilteringDataSource,
    SearchComponent,
    SearchService,
    SorterComponent,
    SorterDirection,
    TimeframeService,
} from "@nova-ui/bits";

import { ListModel, LIST_DATA, TableModel, TABLE_DATA } from "./mocked-data";

// custom data sources used for filtering
@Injectable()
export class ListDatasource
    extends LocalFilteringDataSource<ListModel>
    implements OnDestroy
{
    private onDestroy$ = new Subject<void>();
    constructor(
        searchService: SearchService,
        private filterService: DataFilterService
    ) {
        super(searchService);
        // Subscribe to service, and automatically unsubscribe upon `ngOnDestroy`
        this.filterService.filteringSubject
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                this.applyFilters();
            });
        super.setData(LIST_DATA);
    }

    public async getFilteredData(): Promise<INovaFilteringOutputs> {
        const filters = this.filterService.getFilters();
        const timeFramePickerFilter = filters.timeFramePicker;
        const filteredData = await super.getFilteredData(filters);
        let nextChunk: any[] | undefined = filteredData.repeat?.itemsSource;
        // TIME FRAME PICKER FILTERING
        if (timeFramePickerFilter) {
            nextChunk = nextChunk?.filter(
                (item: ListModel) =>
                    item.date.isBetween(
                        timeFramePickerFilter.value.start,
                        timeFramePickerFilter.value.end
                    ) ||
                    item.date.isSame(timeFramePickerFilter.value.start) ||
                    item.date.isSame(timeFramePickerFilter.value.end)
            );
        }
        if (!filteredData.repeat?.itemsSource || !nextChunk) {
            throw new Error("filteredData.repeat is not defined");
        }
        filteredData.repeat.itemsSource = nextChunk;
        return filteredData;
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}

@Injectable()
export class TableDatasource
    extends LocalFilteringDataSource<TableModel>
    implements OnDestroy
{
    private onDestroy$ = new Subject<void>();
    constructor(
        searchService: SearchService,
        private filterService: DataFilterService
    ) {
        super(searchService);
        // Subscribe to service, and automatically unsubscribe upon `ngOnDestroy`
        this.filterService.filteringSubject
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(() => {
                this.applyFilters();
            });
        super.setData(TABLE_DATA);
    }

    public async getFilteredData(): Promise<INovaFilteringOutputs> {
        const filters = this.filterService.getFilters();
        const timeFramePickerFilter = filters.timeFramePicker;
        const filteredData = await super.getFilteredData(filters);
        if (!filteredData.repeat) {
            throw new Error("filteredData.repeat is not defined");
        }
        let nextChunk = filteredData.repeat.itemsSource;
        // TIME FRAME PICKER FILTERING
        if (timeFramePickerFilter) {
            nextChunk = nextChunk.filter(
                (item: ListModel) =>
                    item.date.isBetween(
                        timeFramePickerFilter.value.start,
                        timeFramePickerFilter.value.end
                    ) ||
                    item.date.isSame(timeFramePickerFilter.value.start) ||
                    item.date.isSame(timeFramePickerFilter.value.end)
            );
        }
        filteredData.repeat.itemsSource = nextChunk;
        return filteredData;
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
// parent component
@Component({
    selector: "nui-data-filter-basic-example",
    templateUrl: "./data-filter-basic.example.component.html",
    providers: [DataFilterService],
})
export class DataFilterBasicExampleComponent implements AfterViewInit {
    @ViewChild("timeFramePicker")
    timeFramePicker: FilteringTimeFramePickerComponent;

    constructor(private filterService: DataFilterService) {}

    public ngAfterViewInit(): void {
        // registering top-level filter which will be applied to all children
        this.filterService.registerFilter({
            timeFramePicker: {
                componentInstance: this.timeFramePicker,
            },
        });
        this.filterService.applyFilters();
    }

    public applyFilters(): void {
        this.filterService.applyFilters();
    }
}

// first child component
@Component({
    selector: "nui-data-filter-table-example",
    template: `
        <div style="border: 1px solid red" class="p-4">
            <div class="mb-2">
                <nui-sorter
                    id="nui-data-filter-basic-sorter"
                    [itemsSource]="sorterItems"
                    [selectedItem]="sortBy"
                    [sortDirection]="initialSortDirection"
                    (sorterAction)="onSorterAction($event)"
                >
                </nui-sorter>
            </div>

            <table
                nui-table
                [dataSource]="dataSource"
                id="nui-data-filter-basic-table"
            >
                <ng-container nuiColumnDef="position">
                    <th nui-header-cell *nuiHeaderCellDef i18n>No.</th>
                    <td nui-cell *nuiCellDef="let element">
                        {{ element.position }}
                    </td>
                </ng-container>

                <ng-container nuiColumnDef="issue">
                    <th nui-header-cell *nuiHeaderCellDef i18n>Issue</th>
                    <td nui-cell *nuiCellDef="let element">
                        {{ element.issue }}
                    </td>
                </ng-container>

                <ng-container nuiColumnDef="date">
                    <th nui-header-cell *nuiHeaderCellDef i18n>Date</th>
                    <td nui-cell *nuiCellDef="let element">
                        {{ element.date | date : "EEEE, MMMM dd, yyyy" }}
                    </td>
                </ng-container>

                <tr nui-header-row *nuiHeaderRowDef="displayedColumns"></tr>
                <tr
                    nui-row
                    *nuiRowDef="let row; columns: displayedColumns"
                    density="tiny"
                ></tr>
            </table>
            <nui-data-filter-list-example></nui-data-filter-list-example>
        </div>
    `,
    providers: [DataFilterService, TableDatasource],
})
export class NuiDataFilterTableComponent implements AfterViewInit, OnDestroy {
    public dataSource?: any[] = [];
    public displayedColumns = ["position", "issue", "date"];

    public readonly sorterItems: IMenuItem[] = [
        {
            title: $localize`Issue`,
            value: "issue",
        },
    ];

    public readonly initialSortDirection = SorterDirection.ascending;
    public sortBy = this.sorterItems[0].value;

    @ViewChild(SorterComponent) sorterComponent: SorterComponent;

    private outputsSubscription: Subscription;

    constructor(
        private dataFilter: DataFilterService,
        private dataSourceService: TableDatasource
    ) {}

    public ngAfterViewInit(): void {
        // this filter will be applied in this component and NuiDataFilterListComponent
        this.dataFilter.registerFilter({
            sorter: {
                componentInstance: this.sorterComponent,
            },
        });
        this.applyFilters();
        this.outputsSubscription =
            this.dataSourceService.outputsSubject.subscribe(
                (data: INovaFilteringOutputs) => {
                    this.dataSource = data.repeat?.itemsSource;
                }
            );
    }

    public applyFilters(): void {
        this.dataFilter.applyFilters();
    }

    public onSorterAction(changes: ISorterChanges): void {
        this.sortBy = changes.newValue.sortBy;
        this.applyFilters();
    }

    public ngOnDestroy(): void {
        this.outputsSubscription.unsubscribe();
    }
}

// second child component
@Component({
    selector: "nui-data-filter-list-example",
    template: `
        <div style="border: 1px solid green" class="p-4">
            <div class="mb-2">
                <nui-search
                    id="nui-data-filter-basic-search"
                    (inputChange)="applyFilters()"
                    (cancel)="applyFilters()"
                    #listSearch
                >
                </nui-search>
            </div>

            <nui-repeat
                id="nui-data-filter-basic-repeat"
                [itemsSource]="state.repeat?.itemsSource"
                [repeatItemTemplateRef]="repeatItemTemplate"
                #filteringRepeat
            >
            </nui-repeat>

            <ng-template #repeatItemTemplate let-item="item">
                <div>
                    {{ item.issue }} -
                    {{ item.date | date : "EEEE, MMMM dd, yyyy" }}
                </div>
            </ng-template>
        </div>
    `,
    providers: [DataFilterService, ListDatasource],
})
export class NuiDataFilterListComponent implements AfterViewInit, OnDestroy {
    public state: INovaFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
    };

    @ViewChild("listSearch") search: SearchComponent;

    private outputsSubscription: Subscription;

    constructor(
        private filterService: DataFilterService,
        private dataSourceService: ListDatasource
    ) {}

    public ngAfterViewInit(): void {
        // this filter will be applied only in this component
        this.filterService.registerFilter({
            search: {
                componentInstance: this.search,
            },
        });
        this.filterService.applyFilters();
        this.outputsSubscription =
            this.dataSourceService.outputsSubject.subscribe(
                (data: INovaFilteringOutputs) => {
                    this.state = data;
                }
            );
    }

    public applyFilters(): void {
        this.filterService.applyFilters();
    }

    public ngOnDestroy(): void {
        this.outputsSubscription.unsubscribe();
    }
}
// custom time frame picker
@Component({
    selector: "nui-filtering-time-frame-picker",
    template: `
        <nui-popover
            trigger="click"
            id="nui-data-filter-basic-time-frame-picker-popover"
            [template]="popoverTimeFramePicker"
            [hasPadding]="false"
            [closePopover]="closePopoverSubject"
            [modal]="true"
        >
            <span class="nui-text-link" style="cursor: pointer;">{{
                tf | timeFrame
            }}</span>
        </nui-popover>

        <ng-template #popoverTimeFramePicker>
            <div class="m-3">
                <nui-time-frame-picker
                    [startModel]="tf"
                    (changed)="updateTf($event)"
                    [maxDate]="maxDate"
                    [minDate]="minDate"
                >
                </nui-time-frame-picker>
            </div>
            <nui-dialog-footer>
                <button
                    nui-button
                    id="nui-data-filter-basic-time-frame-picker-cancel-btn"
                    type="button"
                    displayStyle="action"
                    (click)="cancelPopover()"
                    i18n
                >
                    Cancel
                </button>
                <button
                    nui-button
                    id="nui-data-filter-basic-time-frame-picker-apply-btn"
                    type="button"
                    displayStyle="primary"
                    (click)="confirmPopover()"
                    i18n
                >
                    Apply
                </button>
            </nui-dialog-footer>
        </ng-template>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class FilteringTimeFramePickerComponent implements IFilterPub, OnInit {
    @Output() timeFrameChanged: EventEmitter<any> = new EventEmitter();
    public acceptedTimeframe: ITimeframe;
    public tf: ITimeframe = {
        startDatetime: moment("01/01/2019", "L"),
        endDatetime: moment("02/12/2019", "L"),
    };

    public minDate = moment("12/01/2018", "L"); // "L" is "MM/DD/YYY" in moment.js
    public maxDate = moment();

    public showFooter: boolean = false;

    constructor(public timeframeService: TimeframeService) {}

    public closePopoverSubject = new Subject<void>();
    public openPopoverSubject = new Subject<void>();

    public ngOnInit(): void {
        this.acceptedTimeframe = this.tf;
    }

    public updateTf(value: any): void {
        this.tf = value;
    }

    public confirmPopover(): void {
        this.closePopoverSubject.next();
        this.acceptedTimeframe = this.tf;
        this.timeFrameChanged.emit(this.acceptedTimeframe);
    }

    public cancelPopover(): void {
        this.showFooter = false;
        this.closePopoverSubject.next();
    }

    public getFilters(): IFilter<IRange<Date>> {
        return {
            type: "range",
            value: {
                start: this.acceptedTimeframe.startDatetime.toDate(),
                end: this.acceptedTimeframe.endDatetime.toDate(),
            },
        };
    }
}
