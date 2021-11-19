import {
    AfterViewInit, ApplicationRef, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild,
    ViewContainerRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
    ClientSideDataSource,
    DialogService, INovaFilteringOutputs, IToastService, PaginatorComponent, RowHeightOptions,
    SearchComponent, TableAlignmentOptions, TableComponent, ToastService,
} from "@nova-ui/bits";
import { Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { TableStateHandlerService } from "../../../../../../src/lib/table/table-state-handler.service";

import { ELEMENT_DATA, ITestTableModel } from "./table-test-data-source";

@Component({
    selector: "nui-table-test",
    providers: [ClientSideDataSource, TableStateHandlerService],
    templateUrl: "./table-test.component.html",
})
export class TableTestComponent implements AfterViewInit, OnDestroy, OnInit {
    public dataSource?: ITestTableModel[] = ELEMENT_DATA;
    public myForm: FormGroup;
    public optionsForm: FormGroup;
    public newColumn: string;
    public availableColumns = ["position", "name", "features", "asset", "location", "status", "outages", "checks"];
    public displayedColumns = this.availableColumns.slice();
    // full copy of displayed columns added to update columns only when updateTable() is called
    public displayedColumnsCopy = this.displayedColumns.slice();

    public alignmentsArray: TableAlignmentOptions[] = ["right", "left", "center"];
    public densitiesArray: RowHeightOptions[] = ["default", "tiny", "compact"];

    public alignment: string = "center";
    public density: string = "default";
    public paginationTotal?: number;
    public positionWidth: number = 50;
    public reorderable: boolean = true;
    public resizable: boolean = true;
    public searchTerm: string;
    public sortable: boolean = true;
    public sortDirection: string = "asc";
    public sortedColumn: string = "position";
    public isFeatureColumnDisabled: boolean = true;
    public searchProperties: string[] = [];

    @ViewChild("filteringPaginator") filteringPaginator: PaginatorComponent;
    @ViewChild("filteringSearch") filteringSearch: SearchComponent;
    @ViewChild("filteringTable") filteringTable: TableComponent<ITestTableModel>;
    @ViewChild("sortableTable") sortableTable: TableComponent<ITestTableModel>;
    @ViewChild(TableComponent) testTable: TableComponent<ITestTableModel>;

    private outputsSubscription: Subscription;
    private searchSubscription: Subscription;

    constructor(@Inject(ToastService) private toastService: IToastService,
        @Inject(DialogService) private dialogService: DialogService,
        @Inject(TableStateHandlerService) private tableStateHandlerService: TableStateHandlerService,
        private formBuilder: FormBuilder,
        public changeDetection: ChangeDetectorRef,
        public viewContainerRef: ViewContainerRef,
        public applicationRef: ApplicationRef,
        public dataSourceService: ClientSideDataSource<ITestTableModel>
    ) {
        dataSourceService.setData(ELEMENT_DATA);
    }

    ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            checkboxGroup: this.formBuilder.control(this.displayedColumnsCopy, [
                Validators.required, Validators.minLength(3)]),
        });

        this.optionsForm = this.formBuilder.group({
            alignment: this.formBuilder.control(this.alignment),
            density: this.formBuilder.control(this.density),
            positionWidth: this.formBuilder.control(this.positionWidth),
            reorderable: this.formBuilder.control(this.reorderable),
            resizable: this.formBuilder.control(this.resizable),
            sortable: this.formBuilder.control(this.sortable),
        });

        this.optionsForm.valueChanges.pipe(debounceTime(500)).subscribe(value => {
            this.alignment = value.alignment;
            this.positionWidth = value.positionWidth;
            this.density = value.density;
            this.sortable = value.sortable;
            this.resizable = value.resizable;
            this.reorderable = value.reorderable;
        });
    }

    ngAfterViewInit(): void {
        this.dataSourceService.componentTree = {
            paginator: {
                componentInstance: this.filteringPaginator,
            },
            search: {
                componentInstance: this.filteringSearch,
            },
        };

        this.dataSourceService.registerComponent(this.testTable.getFilterComponents());
        this.outputsSubscription = this.dataSourceService.outputsSubject.subscribe((data: INovaFilteringOutputs) => {
            this.dataSource = data.repeat?.itemsSource;
            this.paginationTotal = data.paginator?.total;
        });

        this.searchSubscription = this.filteringSearch.inputChange.pipe(debounceTime(500)).subscribe(() => {
            this.dataSourceService.applyFilters();
        });

        this.dataSourceService.applyFilters();
    }

    public async sortData(): Promise<void> {
        await this.dataSourceService.applyFilters();
    }

    public async onSearch(value: string): Promise<void> {
        await this.dataSourceService.applyFilters();
    }

    public async onSearchCancel(): Promise<void> {
        await this.dataSourceService.applyFilters();
    }

    public toastColumns(event: Array<string>): void {
        this.toastService.info({ message: "Current order of columns is: " + event.toString().replace(/,/g, ", ") });
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

    ngOnDestroy(): void {
        this.outputsSubscription.unsubscribe();
        this.searchSubscription.unsubscribe();
    }
}
