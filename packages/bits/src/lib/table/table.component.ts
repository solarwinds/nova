import { Directionality } from "@angular/cdk/bidi";
import { Platform } from "@angular/cdk/platform";
import { CdkVirtualForOf } from "@angular/cdk/scrolling";
import { CdkTable } from "@angular/cdk/table";
import { DOCUMENT } from "@angular/common";
import {
    AfterContentInit,
    AfterViewInit,
    Attribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ContentChild,
    ElementRef,
    EventEmitter,
    HostBinding,
    Inject,
    Input,
    IterableDiffers,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation
} from "@angular/core";
import _isEqual from "lodash/isEqual";
import _keys from "lodash/keys";
import _some from "lodash/some";
import { Subscription } from "rxjs";

import { IFilteringParticipants, ISelection } from "../../services/public-api";
import { ComponentChanges } from "../../types";
import { ISortedItem, SorterDirection } from "../sorter/public-api";

import { TableStateHandlerService } from "./table-state-handler.service";

// <example-url>./../examples/index.html#/table</example-url>

interface TableRowData {
    [key: string]: any;
}

/** @dynamic */
@Component({
    selector: "nui-table, table[nui-table]",
    templateUrl: "./table.component.html",
    exportAs: "nuiTable",
    host: {
        "class": "nui-table__table",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TableStateHandlerService],
    styleUrls: ["./table.component.less"],
    encapsulation: ViewEncapsulation.None,
})

export class TableComponent<T> extends CdkTable<T> implements OnInit, AfterViewInit, AfterContentInit, OnDestroy, OnChanges {
    @Input() reorderable = false;
    @Input() sortable = false;
    @Input() resizable = false;
    @Input() selectable = false;
    @Input() totalItems: number;
    @Input() dataSource: T[];
    @Input() selection: ISelection;
    @Input() sortedColumn: ISortedItem;

    @Output() columnsOrderChange: EventEmitter<Array<any>> = new EventEmitter();
    @Output() sortOrderChanged: EventEmitter<ISortedItem> = new EventEmitter();

    /** @deprecated Use selectionChanged instead of rowsSelected */
    @Output() rowsSelected: EventEmitter<ISelection> = new EventEmitter();
    /** Use selectionChanged instead of rowsSelected */
    @Output() selectionChange: EventEmitter<ISelection> = new EventEmitter();

    public sortDirection: SorterDirection;
    public sortBy: string;
    private tableColumnsSubscription: Subscription;
    private tableSortingSubscription: Subscription;
    private selectionChangedSubscription: Subscription;
    private stickyChangedSubscription: Subscription;
    @HostBinding("class.nui-table__table-fixed") layoutFixed = false;
    @ContentChild(CdkVirtualForOf) public virtualFor?: CdkVirtualForOf<unknown>;

    constructor(protected _differs: IterableDiffers,
                protected _changeDetectorRef: ChangeDetectorRef,
                protected _elementRef: ElementRef<any>,
                @Attribute("role") role: string,
                protected _dir: Directionality,
                private tableStateHandlerService: TableStateHandlerService,
                @Inject(DOCUMENT) private document: Document,
                private platform: Platform) {
        super(_differs, _changeDetectorRef, _elementRef, role, _dir, document, platform);
    }

    public getFilterComponents(): IFilteringParticipants {
        return !this.sortable ? {} : {
            sorter: {
                componentInstance: {
                    // mark this filter to be monitored by our datasource for any changes in order reset other filters(eg: pagination)
                    // before any new search is performed
                    detectFilterChanges: true,
                    getFilters: () =>
                        ({
                            type: "sorter",
                            value: {
                                sortBy: this.sortBy,
                                direction: this.sortDirection,
                            },
                        }),
                },
            },
        };
    }

    public getPreselectedItems(items: any[]) {
        return this.dataSource.filter((item) => _some(items, item));
    }

    // using on changes hook for datasource because if we use pagination,
    // datasource changes when we change page and rows should know about this
    ngOnChanges(changes: ComponentChanges<TableComponent<T>>) {
        if (changes.resizable) {
            this.tableStateHandlerService.resizable = changes.resizable.currentValue;
            this.layoutFixed = changes.resizable.currentValue;
        }
        if (changes.reorderable) {
            this.tableStateHandlerService.reorderable = changes.reorderable.currentValue;
        }
        if (changes.sortable) {
            this.tableStateHandlerService.sortable = changes.sortable.currentValue;
        }
        if (changes.dataSource) {
            this.onDatasourceChange(changes.dataSource.currentValue);
        }
        if (changes.selectable) {
            this.tableStateHandlerService.selectable = changes.selectable.currentValue;
        }
        if (changes.selection && !changes.selection.isFirstChange()) {
            this.changeSelection(changes.selection.currentValue);
        }
        if (changes.sortedColumn && !changes.sortedColumn.isFirstChange()) {
            this.handleSortedColumn(changes.sortedColumn.currentValue);
        }
        if (changes.trackBy) {
            this.tableStateHandlerService.trackBy = changes.trackBy.currentValue;
        }
    }

    ngOnInit() {
        super.ngOnInit();
        const dataSet = (this.dataSource as Array<T>);
        const firstRow: TableRowData = dataSet && dataSet[0];
        const columns = _keys(firstRow);
        this.tableStateHandlerService.tableColumns = columns;

        columns.forEach(column => {
            const alignment = this.tableStateHandlerService.defineAlignment(firstRow[column]);
            this.tableStateHandlerService.setAlignment(column, alignment);
        });

        if (this.resizable) {
            const parentWidth = this._elementRef.nativeElement.parentElement.getBoundingClientRect().width;
            this.layoutFixed = true;
            this.tableStateHandlerService.tableParentWidth = parentWidth;
        }

        if (this.sortable) {
            this.tableSortingSubscription = this.tableStateHandlerService.sortingState.subscribe(
                (sortedColumn: ISortedItem) => {
                    this.sortDirection = sortedColumn.direction;
                    this.sortBy = sortedColumn.sortBy;

                    // emit only if the data is really changed
                    if (!_isEqual(sortedColumn, this.sortedColumn)) {
                        this.sortOrderChanged.emit(sortedColumn);
                    }
                }
            );

            if (this.sortedColumn) {
                this.handleSortedColumn(this.sortedColumn);
            }
        }

        if (this.reorderable) {
            this.tableColumnsSubscription = this.tableStateHandlerService.columnsState.subscribe((tableColumns: string[]) => {
                this.columnsOrderChange.emit(tableColumns);
            });
        }

        if (this.selectable) {
            this.stickyChangedSubscription = this.tableStateHandlerService.stickyHeaderChangedSubject.subscribe(() => {
                // calling cdk method to update sticky styles
                this.updateStickyHeaderRowStyles();
            });
        }
    }

    public ngAfterViewInit() {
        // moved this from ngOnInit since we might emit the selectionChange event
        // before our component is actually ready and it might cause problems
        // if we try to manually trigger change detection in a parent component
        if (this.selectable) {
            this.selectionChangedSubscription = this.tableStateHandlerService.selectionChanged.subscribe((selection: ISelection) => {
                this.rowsSelected.emit(selection); // tslint:disable-line:deprecation
                this.selectionChange.emit(selection);
            });

            if (this.selection) {
                this.changeSelection(this.selection);
            }
        }
    }

    private changeSelection(selectedItems: ISelection) {
        this.tableStateHandlerService.selection = selectedItems;
        this.tableStateHandlerService.selectionChanged.next(this.tableStateHandlerService.selection);
    }

    private handleSortedColumn(sortedColumn: ISortedItem) {
        this.tableStateHandlerService.sortedColumn = sortedColumn;
        this.tableStateHandlerService.sortingState.next(sortedColumn);
    }

    private onDatasourceChange(ds: T[]) {
        if (!ds) {
            this.dataSource = [];
        }
        const changedDatasource = ds ? ds : [];
        // if no totalItems specified, we assume that there is only one page
        this.tableStateHandlerService.changeDataSource(changedDatasource);
        this.tableStateHandlerService.totalItems = this.totalItems || changedDatasource.length;
    }

    ngOnDestroy() {
        if (this.tableSortingSubscription) {
            this.tableSortingSubscription.unsubscribe();
        }

        if (this.tableColumnsSubscription) {
            this.tableColumnsSubscription.unsubscribe();
        }

        if (this.selectionChangedSubscription) {
            this.selectionChangedSubscription.unsubscribe();
        }

        if (this.stickyChangedSubscription) {
            this.stickyChangedSubscription.unsubscribe();
        }
        super.ngOnDestroy();
    }

    ngAfterContentInit(): void {
        // @ts-ignore: Call parent method in case cdk adds it later
        super.ngAfterContentInit?.();
        // Note: Identifying if table is using virtual scroll.
        this.tableStateHandlerService.hasVirtualScroll = !!this.virtualFor;
    }
}
