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
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import moment from "moment/moment";
import { Subject, Subscription } from "rxjs";

import {
    DataFilterService,
    IFilter,
    IFilterPub,
    INovaFilteringOutputs,
    IRange,
    ITimeframe,
    SearchComponent,
} from "@nova-ui/bits";

import {
    FilteringTimeFramePickerComponent,
    ListDatasource,
    TableDatasource,
} from "../data-filter-basic/data-filter-basic.example.component";

@Component({
    selector: "nui-data-filter-isolated-example",
    templateUrl: "data-filter-isolated.example.component.html",
    providers: [DataFilterService],
})
export class DataFilterIsolatedExampleComponent implements AfterViewInit {
    @ViewChild("timeFramePicker")
    timeFramePicker: FilteringTimeFramePickerComponent;

    constructor(private filterService: DataFilterService) {}

    public ngAfterViewInit(): void {
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

@Component({
    selector: "nui-data-filter-isolated-table-example",
    template: `
        <div class="mb-2">
            <nui-search
                id="nui-data-filter-isolated-table-search"
                class="d-flex justify-content-end flex-grow-1"
                (inputChange)="applyFilters()"
                (cancel)="applyFilters()"
                #tableSearch
            ></nui-search>
        </div>
        <table
            nui-table
            [dataSource]="tableData"
            id="nui-data-filter-isolated-table"
        >
            <ng-container nuiColumnDef="position">
                <th nui-header-cell *nuiHeaderCellDef i18n>No.</th>
                <td nui-cell *nuiCellDef="let element">
                    {{ element.position }}
                </td>
            </ng-container>

            <ng-container nuiColumnDef="issue">
                <th nui-header-cell *nuiHeaderCellDef i18n>Issue</th>
                <td nui-cell *nuiCellDef="let element">{{ element.issue }}</td>
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
                density="compact"
            ></tr>
        </table>
    `,
    providers: [DataFilterService, TableDatasource],
})
export class NuiDataFilterIsolatedTableComponent
    implements AfterViewInit, OnDestroy
{
    public tableData?: any[] = [];
    public displayedColumns = ["position", "issue", "date"];
    @ViewChild("tableSearch") search: SearchComponent;

    private outputsSubscription: Subscription;

    constructor(
        private dataFilter: DataFilterService,
        private dataSourceService: TableDatasource
    ) {}

    public ngAfterViewInit(): void {
        this.dataFilter.registerFilter({
            search: {
                componentInstance: this.search,
            },
        });
        this.applyFilters();
        this.outputsSubscription =
            this.dataSourceService.outputsSubject.subscribe(
                (data: INovaFilteringOutputs) => {
                    this.tableData = data.repeat?.itemsSource;
                }
            );
    }

    public applyFilters(): void {
        this.dataFilter.applyFilters();
    }

    public ngOnDestroy(): void {
        this.outputsSubscription.unsubscribe();
    }
}

@Component({
    selector: "nui-data-filter-isolated-list-example",
    template: `
        <div class="mb-2">
            <nui-search
                id="nui-data-filter-isolated-list-search"
                class="d-flex justify-content-end flex-grow-1"
                (inputChange)="applyFilters()"
                (cancel)="applyFilters()"
                #listSearch
            >
            </nui-search>
        </div>

        <nui-repeat
            id="nui-data-filter-list-isolated-repeat"
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
    `,
    providers: [DataFilterService, ListDatasource],
})
export class NuiDataFilterIsolatedListComponent
    implements AfterViewInit, OnDestroy
{
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

@Component({
    selector: "nui-filtering-isolated-time-frame-picker",
    template: `
        <nui-popover
            trigger="click"
            id="nui-data-filter-isolated-time-frame-picker-popover"
            [template]="popoverTimeFramePicker"
            [hasPadding]="false"
            [closePopover]="closePopoverSubject"
            [modal]="true"
        >
            <button nui-button type="button" displayStyle="action">
                {{ tf | timeFrame }}
            </button>
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
                    id="nui-data-filter-isolated-time-frame-picker-cancel-btn"
                    type="button"
                    displayStyle="action"
                    (click)="cancelPopover()"
                    i18n
                >
                    Cancel
                </button>
                <button
                    nui-button
                    id="nui-data-filter-isolated-time-frame-picker-apply-btn"
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
export class FilteringIsolatedTimeFramePickerComponent
    implements IFilterPub, OnInit
{
    @Output() timeFrameChanged: EventEmitter<any> = new EventEmitter();
    public acceptedTimeframe: ITimeframe;
    public tf: ITimeframe = {
        startDatetime: moment("01/01/2019", "L"),
        endDatetime: moment("02/12/2019", "L"),
    };

    public minDate = moment("12/01/2018", "L"); // "L" is "MM/DD/YYY" in moment.js
    public maxDate = moment();

    public showFooter: boolean = false;
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
