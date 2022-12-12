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

import { Directionality } from "@angular/cdk/bidi";
import {
    _DisposeViewRepeaterStrategy,
    _VIEW_REPEATER_STRATEGY,
    _ViewRepeater,
} from "@angular/cdk/collections";
import { Platform } from "@angular/cdk/platform";
import { CdkVirtualForOf, ViewportRuler } from "@angular/cdk/scrolling";
import {
    _COALESCED_STYLE_SCHEDULER,
    _CoalescedStyleScheduler,
    CDK_TABLE_TEMPLATE,
    CdkTable,
    RenderRow,
    RowContext,
    STICKY_POSITIONING_LISTENER,
    StickyPositioningListener,
} from "@angular/cdk/table";
import { DOCUMENT } from "@angular/common";
import {
    AfterContentInit,
    AfterViewInit,
    Attribute,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    HostBinding,
    Inject,
    Input,
    IterableDiffers,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    SkipSelf,
    ViewEncapsulation,
} from "@angular/core";
import _isEqual from "lodash/isEqual";
import _keys from "lodash/keys";
import { Subscription } from "rxjs";

import { IFilteringParticipants, ISelection } from "../../services/public-api";
import { ComponentChanges } from "../../types";
import { ISortedItem, SorterDirection } from "../sorter/public-api";
import { TableStateHandlerService } from "./table-state-handler.service";

// <example-url>./../examples/index.html#/table</example-url>

/** @dynamic */
@Component({
    selector: "nui-table, table[nui-table]",
    // We used to have our own template for the table but it broke with Angular release 10 so we are now using this even though it is intended to be private
    // so we can be up to date with the CDK table template.
    template: CDK_TABLE_TEMPLATE,
    exportAs: "nuiTable",
    host: {
        class: "nui-table__table",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        TableStateHandlerService,
        {
            provide: _VIEW_REPEATER_STRATEGY,
            useClass: _DisposeViewRepeaterStrategy,
        },
        {
            provide: _COALESCED_STYLE_SCHEDULER,
            useClass: _CoalescedStyleScheduler,
        },
    ],
    styleUrls: ["./table.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class TableComponent<T>
    extends CdkTable<T>
    implements OnInit, AfterViewInit, AfterContentInit, OnDestroy, OnChanges
{
    @Input() reorderable = false;
    @Input() sortable = false;
    @Input() resizable = false;
    @Input() selectable = false;
    @Input() totalItems: number;

    @Input()
    get dataSource(): T[] {
        return super.dataSource as any;
    }

    set dataSource(value: T[]) {
        super.dataSource = value as any;
    }

    @Input() selection: ISelection;
    @Input() sortedColumn: ISortedItem;

    @Output() columnsOrderChange: EventEmitter<Array<any>> = new EventEmitter();
    @Output() sortOrderChanged: EventEmitter<ISortedItem> = new EventEmitter();
    @Output() selectionChange: EventEmitter<ISelection> = new EventEmitter();

    public sortDirection: SorterDirection;
    public sortBy: string;
    private tableColumnsSubscription: Subscription;
    private tableSortingSubscription: Subscription;
    private selectionChangedSubscription: Subscription;
    private stickyChangedSubscription: Subscription;
    @HostBinding("class.nui-table__table-fixed") layoutFixed = false;
    @ContentChild(CdkVirtualForOf) public virtualFor?: CdkVirtualForOf<unknown>;

    constructor(
        protected _differs: IterableDiffers,
        protected _changeDetectorRef: ChangeDetectorRef,
        protected _elementRef: ElementRef<any>,
        @Attribute("role") role: string,
        protected _dir: Directionality,
        private tableStateHandlerService: TableStateHandlerService,
        @Inject(DOCUMENT) private document: Document,
        private platform: Platform,
        @Inject(_VIEW_REPEATER_STRATEGY)
        viewRepeater: _ViewRepeater<T, RenderRow<T>, RowContext<T>>,
        @Inject(_COALESCED_STYLE_SCHEDULER)
        coalescedStyleScheduler: _CoalescedStyleScheduler,
        viewportRuler: ViewportRuler,
        @Optional()
        @SkipSelf()
        @Inject(STICKY_POSITIONING_LISTENER)
        stickyPositioningListener: StickyPositioningListener
    ) {
        // The _ViewRepeater and _CoalescedStyleScheduler parameters were optional before Angular v12.
        // They're included here for compatibility with Angular v12 and later.
        super(
            _differs,
            _changeDetectorRef,
            _elementRef,
            role,
            _dir,
            document,
            platform,
            viewRepeater,
            coalescedStyleScheduler,
            viewportRuler,
            stickyPositioningListener
        );
    }

    public getFilterComponents(): IFilteringParticipants {
        return !this.sortable
            ? {}
            : {
                  sorter: {
                      componentInstance: {
                          // mark this filter to be monitored by our datasource for any changes in order reset other filters(eg: pagination)
                          // before any new search is performed
                          detectFilterChanges: true,
                          getFilters: () => ({
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

    // using on changes hook for datasource because if we use pagination,
    // datasource changes when we change page and rows should know about this
    public ngOnChanges(changes: ComponentChanges<TableComponent<T>>): void {
        if (changes.resizable) {
            this.tableStateHandlerService.resizable =
                changes.resizable.currentValue;
            this.layoutFixed = changes.resizable.currentValue;
        }
        if (changes.reorderable) {
            this.tableStateHandlerService.reorderable =
                changes.reorderable.currentValue;
        }
        if (changes.sortable) {
            this.tableStateHandlerService.sortable =
                changes.sortable.currentValue;
        }
        if (changes.dataSource) {
            this.onDataSourceChange(changes.dataSource.currentValue);
        }
        if (changes.selectable) {
            this.tableStateHandlerService.selectable =
                changes.selectable.currentValue;
        }
        if (changes.selection && !changes.selection.isFirstChange()) {
            this.changeSelection(changes.selection.currentValue);
        }
        if (changes.sortedColumn && !changes.sortedColumn.isFirstChange()) {
            this.handleSortedColumn(changes.sortedColumn.currentValue);
        }
        if (changes.trackBy) {
            this.tableStateHandlerService.trackBy =
                changes.trackBy.currentValue;
        }
    }

    public ngOnInit(): void {
        super.ngOnInit();
        const dataSet = this.dataSource as Array<T>;
        const firstRow: T = dataSet && dataSet[0];
        const columns: string[] = _keys(firstRow);
        this.tableStateHandlerService.tableColumns = columns;

        columns.forEach((column) => {
            const alignment = this.tableStateHandlerService.defineAlignment(
                firstRow[column as keyof T]
            );
            this.tableStateHandlerService.setAlignment(column, alignment);
        });

        if (this.resizable) {
            const parentWidth =
                this._elementRef.nativeElement.parentElement.getBoundingClientRect()
                    .width;
            this.layoutFixed = true;
            this.tableStateHandlerService.tableParentWidth = parentWidth;
        }

        if (this.sortable) {
            this.tableSortingSubscription =
                this.tableStateHandlerService.sortingState.subscribe(
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
            this.tableColumnsSubscription =
                this.tableStateHandlerService.columnsState.subscribe(
                    (tableColumns: string[]) => {
                        this.columnsOrderChange.emit(tableColumns);
                    }
                );
        }

        if (this.selectable) {
            this.stickyChangedSubscription =
                this.tableStateHandlerService.stickyHeaderChangedSubject.subscribe(
                    () => {
                        // calling cdk method to update sticky styles
                        this.updateStickyHeaderRowStyles();
                    }
                );
        }
    }

    public ngAfterViewInit(): void {
        // moved this from ngOnInit since we might emit the selectionChange event
        // before our component is actually ready and it might cause problems
        // if we try to manually trigger change detection in a parent component
        if (this.selectable) {
            this.selectionChangedSubscription =
                this.tableStateHandlerService.selectionChanged.subscribe(
                    (selection: ISelection) => {
                        this.selectionChange.emit(selection);
                    }
                );

            if (this.selection) {
                this.changeSelection(this.selection);
            }
        }
    }

    private changeSelection(selectedItems: ISelection) {
        this.tableStateHandlerService.selection = selectedItems;
        this.tableStateHandlerService.selectionChanged.next(
            this.tableStateHandlerService.selection
        );
    }

    private handleSortedColumn(sortedColumn: ISortedItem) {
        this.tableStateHandlerService.sortedColumn = sortedColumn;
        this.tableStateHandlerService.sortingState.next(sortedColumn);
    }

    private onDataSourceChange(ds: T[]) {
        if (!ds) {
            this.dataSource = [];
        }
        const changedDataSource = ds ? ds : [];
        // if no totalItems specified, we assume that there is only one page
        this.tableStateHandlerService.totalItems =
            this.totalItems || changedDataSource.length;
        this.tableStateHandlerService.changeDataSource(changedDataSource);
    }

    public ngOnDestroy(): void {
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

    public ngAfterContentInit(): void {
        // @ts-ignore: Call parent method in case cdk adds it later
        super.ngAfterContentInit?.();
        // Note: Identifying if table is using virtual scroll.
        this.tableStateHandlerService.hasVirtualScroll = !!this.virtualFor;
    }
}
