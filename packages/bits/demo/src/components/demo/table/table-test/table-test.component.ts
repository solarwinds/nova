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
    ApplicationRef,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";
import { NonNullableFormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

import {
    ClientSideDataSource,
    DialogService,
    INovaFilteringOutputs,
    IToastService,
    PaginatorComponent,
    RowHeightOptions,
    SearchComponent,
    TableAlignmentOptions,
    TableComponent,
    ToastService,
} from "@nova-ui/bits";

import { TableStateHandlerService } from "../../../../../../src/lib/table/table-state-handler.service";
import { ELEMENT_DATA, ITestTableModel } from "./table-test-data-source";

@Component({
    selector: "nui-table-test",
    providers: [ClientSideDataSource, TableStateHandlerService],
    templateUrl: "./table-test.component.html",
})
export class TableTestComponent implements AfterViewInit, OnDestroy, OnInit {
    public dataSource?: ITestTableModel[] = ELEMENT_DATA;
    public newColumn: string;
    public availableColumns = [
        "position",
        "name",
        "features",
        "asset",
        "location",
        "status",
        "outages",
        "checks",
    ];
    public displayedColumns = this.availableColumns.slice();
    // full copy of displayed columns added to update columns only when updateTable() is called
    public displayedColumnsCopy = this.displayedColumns.slice();
    public myForm;
    public alignmentsArray: TableAlignmentOptions[] = [
        "right",
        "left",
        "center",
    ];
    public densitiesArray: RowHeightOptions[] = ["default", "tiny", "compact"];
    public alignment: string | undefined = "center";
    public density: string | undefined = "default";
    public paginationTotal?: number;
    public positionWidth: number | undefined = 50;
    public reorderable: boolean | undefined = true;
    public resizable: boolean | undefined = true;
    public searchTerm: string;
    public sortable: boolean | undefined = true;
    public optionsForm;
    public sortDirection: string = "asc";
    public sortedColumn: string = "position";
    public isFeatureColumnDisabled: boolean = true;
    public searchProperties: string[] = [];

    @ViewChild("filteringPaginator") filteringPaginator: PaginatorComponent;
    @ViewChild("filteringSearch") filteringSearch: SearchComponent;
    @ViewChild("filteringTable")
    filteringTable: TableComponent<ITestTableModel>;
    @ViewChild("sortableTable") sortableTable: TableComponent<ITestTableModel>;
    @ViewChild(TableComponent) testTable: TableComponent<ITestTableModel>;

    private outputsSubscription: Subscription;
    private searchSubscription: Subscription;

    constructor(
        @Inject(ToastService) private toastService: IToastService,
        @Inject(DialogService) private dialogService: DialogService,
        @Inject(TableStateHandlerService)
        private tableStateHandlerService: TableStateHandlerService,
        private formBuilder: NonNullableFormBuilder,
        public changeDetection: ChangeDetectorRef,
        public viewContainerRef: ViewContainerRef,
        public applicationRef: ApplicationRef,
        public dataSourceService: ClientSideDataSource<ITestTableModel>
    ) {
        dataSourceService.setData(ELEMENT_DATA);
        this.myForm = this.formBuilder.group({
            checkboxGroup: this.formBuilder.control(this.displayedColumnsCopy, [
                Validators.required,
                Validators.minLength(3),
            ]),
        });
        this.optionsForm = this.formBuilder.group({
            alignment: this.formBuilder.control(this.alignment),
            density: this.formBuilder.control(this.density),
            positionWidth: this.formBuilder.control(this.positionWidth),
            reorderable: this.formBuilder.control(this.reorderable),
            resizable: this.formBuilder.control(this.resizable),
            sortable: this.formBuilder.control(this.sortable),
        });
    }

    public ngOnInit(): void {
        this.optionsForm.valueChanges
            .pipe(debounceTime(500))
            .subscribe((value) => {
                this.alignment = value.alignment;
                this.positionWidth = value.positionWidth;
                this.density = value.density;
                this.sortable = value.sortable;
                this.resizable = value.resizable;
                this.reorderable = value.reorderable;
            });
    }

    async ngAfterViewInit(): Promise<void> {
        this.dataSourceService.componentTree = {
            paginator: {
                componentInstance: this.filteringPaginator,
            },
            search: {
                componentInstance: this.filteringSearch,
            },
        };

        this.dataSourceService.registerComponent(
            this.testTable.getFilterComponents()
        );
        this.outputsSubscription =
            this.dataSourceService.outputsSubject.subscribe(
                (data: INovaFilteringOutputs) => {
                    this.dataSource = data.repeat?.itemsSource;
                    this.paginationTotal = data.paginator?.total;
                }
            );

        this.searchSubscription = this.filteringSearch.inputChange
            .pipe(debounceTime(500))
            .subscribe(() => {
                this.dataSourceService.applyFilters();
            });

        await this.dataSourceService.applyFilters();
    }

    public sortData(): void {
        this.dataSourceService.applyFilters();
    }

    public async onSearch(value: string): Promise<void> {
        await this.dataSourceService.applyFilters();
    }

    public async onSearchCancel(): Promise<void> {
        await this.dataSourceService.applyFilters();
    }

    public toastColumns(event: Array<string>): void {
        this.toastService.info({
            message:
                "Current order of columns is: " +
                event.toString().replace(/,/g, ", "),
        });
    }

    public async changePagination(): Promise<void> {
        await this.dataSourceService.applyFilters();
    }

    public columnsChanged(columns: any): void {
        this.displayedColumnsCopy = columns;
    }

    public isChecked(vegetable: string): boolean {
        return this.displayedColumnsCopy.indexOf(vegetable) > -1;
    }

    public open(content: TemplateRef<string>): void {
        this.dialogService.open(content, { size: "sm" });
    }

    public updateNewColumnValue(event: any): void {
        this.newColumn = event;
    }

    public addNewColumn(): void {
        if (this.newColumn) {
            this.availableColumns.push(this.newColumn);
            this.displayedColumnsCopy.push(this.newColumn);
            this.newColumn = "";
        }
    }

    public updateColumns(): void {
        this.displayedColumns = this.displayedColumnsCopy.slice();
    }

    public disableSorting(): void {
        this.isFeatureColumnDisabled = !this.isFeatureColumnDisabled;
    }

    public limitSearch(): void {
        if (this.searchProperties.length) {
            this.searchProperties = [];
        } else {
            this.searchProperties = ["outages"];
        }
        this.dataSourceService.setSearchProperties(this.searchProperties);
    }

    // TODO: temporary solution for changing table state dynamically, remove this after NUI-1999

    public ngOnDestroy(): void {
        this.outputsSubscription.unsubscribe();
        this.searchSubscription.unsubscribe();
    }
}
