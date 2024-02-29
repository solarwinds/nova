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
    forwardRef,
    Inject,
    Injectable,
    NgZone,
    TrackByFunction,
} from "@angular/core";
import _includes from "lodash/includes";
import _isNil from "lodash/isNil";
import _isNumber from "lodash/isNumber";
import { Subject } from "rxjs";

import { TableResizePhase } from "./table-resizer/table-resizer.directive";
import { ISelection, ISelectorState } from "../../services/public-api";
import { SelectionType } from "../selector/public-api";
import { SelectorService } from "../selector/selector.service";
import { ISortedItem, SorterDirection } from "../sorter/public-api";

export const enum AlignmentClasses {
    RIGHT = "align-right",
    LEFT = "align-left",
    CENTER = "align-center",
}

export const enum DropAlignment {
    left = "left",
    right = "right",
}

export interface ColumnWidthInfo {
    width: number;
    autoCalculated?: boolean;
}

export interface ITableState {
    columnAlignments: { [key: string]: string };
    columnsWidths: {
        [key: string]: ColumnWidthInfo;
    };
    columns: string[];
    sortedColumn?: ISortedItem;
    widthCalculationPerformed: boolean;
    columnsTypes: string[];
}

export interface DraggedOverCell {
    cellIndex: number;
    dropAlignment: DropAlignment;
}

export interface TableCellEdgeHighlight {
    columnIndex: number;
    side: DropAlignment;
    eventPhase: TableResizePhase;
}

export interface ColumnType {
    columnName: string;
    columnType: string;
}

export interface ITableSortingState {
    sortingIcon?: string;
    isColumnSorted: boolean;
}

/** @ignore */
const MIN_COLUMN_WIDTH_PX = 46;
/** @ignore */
const ICON_CELL_WIDTH_PX = 40;
/** @ignore */
const SELECTABLE_CELL_WIDTH_PX = 75;

/** @ignore */
const DEFAULT_TRACK_BY: TrackByFunction<any> = (i, d) => d;

@Injectable()
export class TableStateHandlerService {
    public tableParentWidth: number;
    public columnsState = new Subject<string[]>();
    public sortingState = new Subject<ISortedItem>();
    public draggedOverCell = new Subject<DraggedOverCell | undefined>();
    public shouldHighlightEdge = new Subject<TableCellEdgeHighlight>();
    public dataSourceChanged = new Subject<Array<any>>();
    public selectionChanged = new Subject<ISelection>();
    public selectableChanged = new Subject<boolean>();
    public columnWidthSubject = new Subject<void>();
    public stickyHeaderChangedSubject = new Subject<void>();

    private _reorderable: boolean;
    private _sortable: boolean;
    private _resizable: boolean;
    private _dragCellIndex: number;
    private _draggedOverCellIndex: number;
    private _newCellIndex: number;
    private _dropCellOffsetX: number;
    private _dropCellWidth: number;
    private _dragOverDirection: string;
    private _selectable: boolean;
    // Note: Used to tell to the SelectorService to skip pagination logic
    private _hasVirtualScroll: boolean;
    private _totalItems: number;
    private _dataSource: any[];
    private _selection: ISelection = {
        isAllPages: false,
        include: [],
        exclude: [],
    };
    public _trackBy: TrackByFunction<any>;

    protected state: ITableState = {
        columnAlignments: {},
        columns: [],
        columnsWidths: {},
        widthCalculationPerformed: false,
        columnsTypes: [],
    };

    protected sortIcons: { [key: string]: string } = {
        asc: "triangle-up",
        desc: "triangle-down",
    };

    constructor(
        protected zone: NgZone,
        @Inject(forwardRef(() => SelectorService))
        protected selectorService: SelectorService
    ) {}

    /**
     * Used to sync directives and components in table to apply additional styles and logic
     */
    set sortable(isSortable: boolean) {
        this._sortable = isSortable;
    }

    get sortable(): boolean {
        return this._sortable;
    }

    set dragCellIndex(cellIndex: number) {
        this._dragCellIndex = cellIndex;
    }

    get dragCellIndex(): number {
        return this._dragCellIndex;
    }

    set draggedOverCellIndex(cellIndex: number) {
        this._draggedOverCellIndex = cellIndex;
    }

    get draggedOverCellIndex(): number {
        return this._draggedOverCellIndex;
    }

    set newCellIndex(cellIndex: number) {
        this._newCellIndex = cellIndex;
    }

    get newCellIndex(): number {
        return this._newCellIndex;
    }

    set dropCellOffsetX(cellIndex: number) {
        this._dropCellOffsetX = cellIndex;
    }

    get dropCellOffsetX(): number {
        return this._dropCellOffsetX;
    }

    set dropCellWidth(cellIndex: number) {
        this._dropCellWidth = cellIndex;
    }

    get dropCellWidth(): number {
        return this._dropCellWidth;
    }

    set dragOverDirection(cellIndex: string) {
        this._dragOverDirection = cellIndex;
    }

    get dragOverDirection(): string {
        return this._dragOverDirection;
    }

    set reorderable(isDraggable: boolean) {
        this._reorderable = isDraggable;
    }

    get reorderable(): boolean {
        return this._reorderable;
    }

    set resizable(isResizable: boolean) {
        this._resizable = isResizable;
    }

    get resizable(): boolean {
        return this._resizable;
    }

    set tableColumns(columns: string[]) {
        this.state.columns = columns;
    }

    get tableColumns(): string[] {
        return this.state.columns;
    }

    set columnType(column: ColumnType) {
        const columnIndex = this.state.columns.indexOf(column.columnName);
        this.state.columnsTypes[columnIndex] = column.columnType;
    }

    get columnsTypes(): string[] {
        return this.state.columnsTypes;
    }

    set sortedColumn(columnToSort: ISortedItem) {
        this.state.sortedColumn = columnToSort;
    }

    set selectable(isSelectable: boolean) {
        if (isSelectable !== this._selectable) {
            this.selectableChanged.next(isSelectable);
        }
        this._selectable = isSelectable;
    }

    get selectable(): boolean {
        return this._selectable;
    }

    get hasVirtualScroll(): boolean {
        return this._hasVirtualScroll;
    }

    set hasVirtualScroll(value: boolean) {
        this._hasVirtualScroll = value;
    }

    set totalItems(paginationTotal: number) {
        this._totalItems = paginationTotal;
    }

    get totalItems(): number {
        return this._totalItems;
    }

    set dataSource(dataSource: any[]) {
        this._dataSource = dataSource;
    }

    get dataSource(): any[] {
        return this._dataSource;
    }

    set selection(selection: ISelection) {
        this._selection = selection;
    }

    get selection(): ISelection {
        return this._selection;
    }

    get trackBy(): TrackByFunction<any> {
        return this._trackBy || DEFAULT_TRACK_BY;
    }

    set trackBy(value: TrackByFunction<any>) {
        this._trackBy = value;
    }

    /**
     * Gets the width of the specified column
     *
     * @param column The id for the column being queried
     *
     * @returns The state's column width
     */
    public getColumnWidth(column: string): number {
        if (!this.state.widthCalculationPerformed) {
            this.calculateWidthsOfColumns();
        }
        return this.state.columnsWidths[column].width;
    }

    /**
     * Updates the width of the specified column,
     * then broadcasts that a width change has occurred to all listeners of columnWidthSubject
     *
     * @param column The id for the column
     * @param width The new width of the column
     *
     */
    public setColumnWidth(column: string, width: number): void {
        this.state.columnsWidths[column] = { width };
        this.columnWidthSubject.next();
    }

    /**
     * Returns the current alignment direction for the queried column
     *
     * @param column The id of the column
     *
     * @returns The current alignment direction
     */
    public getAlignment(column: string): string {
        return this.state.columnAlignments[column];
    }

    /**
     * Updates the specified column's alignment with the given alignment direction
     *
     * @param column the id for the column that is being updated
     * @param alignment the new alignment direction
     *
     */
    public setAlignment(
        column: string,
        alignment: string = AlignmentClasses.LEFT
    ): void {
        this.state.columnAlignments[column] =
            alignment || this.state.columnAlignments[column];
    }

    /**
     * Determines the alignment for a column based on the type of the provided value.
     * Returns AlignmentClasses.RIGHT if the value given is a number; otherwise, returns 'undefined'.
     *
     * @param value The data for a given column
     *
     * @returns The alignment direction for that column
     */
    public defineAlignment(value: any): string | undefined {
        if (_isNumber(value)) {
            return AlignmentClasses.RIGHT;
        }
    }

    /**
     * Updates the state's columnWidths for each column and sets the state's widthCalculationPerformed property
     * to true once the calculation is complete
     */
    public calculateWidthsOfColumns(): void {
        // Apply width of 40px for non-resizable columns of type "icon"
        this.state.columns
            .filter((columnName) => {
                const columnIndex = this.state.columns.indexOf(columnName);
                return this.state.columnsTypes[columnIndex] === "icon";
            })
            .forEach((column) => {
                this.state.columnsWidths[column] = {
                    width: ICON_CELL_WIDTH_PX,
                };
            });

        // "selectable" adding one more column with 75px width which is not in the "this.state.columns", so we need take it to the consideration
        const accumulator =
            this.resizable && this.selectable ? SELECTABLE_CELL_WIDTH_PX : 0;
        const userColumnsWidths = this.state.columns
            .filter((columnName) => this.state.columnsWidths[columnName])
            .reduce(
                (total, curr) => total + this.state.columnsWidths[curr].width,
                accumulator
            );
        const widthConsideringUserInputs =
            userColumnsWidths > this.tableParentWidth
                ? 0
                : this.tableParentWidth - userColumnsWidths - 1;
        const columnsToCalculateWidth = this.state.columns.filter(
            (columnName) => !this.state.columnsWidths[columnName]
        ).length;
        const calculatedWidth = Math.floor(
            widthConsideringUserInputs / columnsToCalculateWidth
        );
        const widthOfColumn =
            calculatedWidth > MIN_COLUMN_WIDTH_PX
                ? calculatedWidth
                : MIN_COLUMN_WIDTH_PX;

        this.state.columns
            .filter((columnName) => !this.state.columnsWidths[columnName])
            .forEach((column) => {
                // There is a case when sum of columns can exceed width of parent
                // Then width of other columns should be set to min width
                this.state.columnsWidths[column] = { width: widthOfColumn };
            });

        this.state.widthCalculationPerformed = true;
    }

    /**
     * Updates the state's sortedColumn and sortedColumn.direction properties and then broadcasts the
     *  state object to all listeners of sortingState
     *
     * @param sortCellIndex the index of the column to sort by
     */
    public sortColumn(sortCellIndex: number): void {
        const newSortedColumn = this.state.columns[sortCellIndex];
        const prevSortedColumn =
            this.state.sortedColumn && this.state.sortedColumn.sortBy;
        const prevSortDirection =
            this.state.sortedColumn && this.state.sortedColumn.direction;

        let newSortDirection = SorterDirection.original;

        if (newSortedColumn === prevSortedColumn) {
            newSortDirection =
                prevSortDirection === SorterDirection.ascending
                    ? SorterDirection.descending
                    : SorterDirection.ascending;
        } else {
            newSortDirection = SorterDirection.ascending;
        }

        this.state.sortedColumn = {
            sortBy: newSortedColumn,
            direction: newSortDirection,
        };

        this.sortingState.next(this.state.sortedColumn);
    }

    /**
     * Updates the state's column order and broadcasts the state's columns to all listeners of columnsState
     *
     * @param dragCellIndex
     * @param newCellIndex
     */
    public reorderColumns(dragCellIndex: number, newCellIndex: number): void {
        const dragCellValue = this.state.columns[dragCellIndex];
        this.state.columns.splice(dragCellIndex, 1);
        this.state.columns.splice(newCellIndex, 0, dragCellValue);
        this.columnsState.next(this.state.columns);
    }

    /**
     * Checks to see if there has been any change in the column's order
     * If there was it calls reorderColumns to update the state's column order
     */
    public reorderColumnsOnDrop(): void {
        this.getNewCellIndex();

        if (
            !_isNil(this.newCellIndex) &&
            this.newCellIndex !== this.dragCellIndex &&
            this.dragCellIndex !== this.draggedOverCellIndex
        ) {
            this.reorderColumns(this.dragCellIndex, this.newCellIndex);
        }
    }

    /**
     * Updates the newCellIndex property if the current value is different from draggedOverCellIndex
     */
    public getNewCellIndex(): void {
        if (this.dragCellIndex !== this.draggedOverCellIndex) {
            this.newCellIndex =
                this.dragCellIndex < this.draggedOverCellIndex
                    ? this.dropCellOffsetX < this.dropCellWidth / 2
                        ? this.draggedOverCellIndex - 1
                        : this.draggedOverCellIndex
                    : this.dropCellOffsetX < this.dropCellWidth / 2
                    ? this.draggedOverCellIndex
                    : this.draggedOverCellIndex + 1;
        }
    }

    /**
     * Finds the index for the column that the event happened to
     *
     * @param event
     *
     * @returns The column index
     */
    public getTargetElementCellIndex(event: DragEvent): number {
        // When we have selectable table we need to decrease index of event.target.id by one because we added new column to html but not adding column to
        // this.state.columns. Because of that cellIndex in event will be greater than index in this.state.columns by one.
        const cellIndex = parseInt((event.target as any).cellIndex, 10);
        return this.selectable ? cellIndex - 1 : cellIndex;
    }

    /**
     * Returns the DropAlignment direction for the recently dragged column
     *
     * @returns The drop alignment direction
     */
    public getDropCellAlignment(): DropAlignment {
        return this.dragCellIndex < this.draggedOverCellIndex
            ? this.newCellIndex < this.draggedOverCellIndex
                ? DropAlignment.left
                : DropAlignment.right
            : this.newCellIndex > this.draggedOverCellIndex
            ? DropAlignment.right
            : DropAlignment.left;
    }

    /**
     * Checks to see if the recent drag event changed the order of the columns
     * then broadcasts the results to all listeners of draggedOverCell
     */
    public emitDraggedOverCell(): void {
        this.zone.run(() => {
            if (
                this.dragCellIndex !== this.draggedOverCellIndex &&
                this.dragCellIndex !== this.newCellIndex
            ) {
                this.draggedOverCell.next(<DraggedOverCell>{
                    cellIndex: this.draggedOverCellIndex,
                    dropAlignment: this.getDropCellAlignment(),
                });
            } else {
                this.draggedOverCell.next(undefined);
            }
        });
    }

    /**
     * Broadcasts the given resize information to all listeners of shouldHighlightEdge
     *
     * @param columnIndex
     * @param eventPhase
     */
    public emitResizeEvent(
        columnIndex: number,
        eventPhase: TableResizePhase
    ): void {
        this.shouldHighlightEdge.next({
            columnIndex,
            side: DropAlignment.right,
            eventPhase,
        });
    }

    /**
     * Updates the draggedOverCellIndex
     *
     * @param event
     */
    public setDraggedOverCell(event: DragEvent): void {
        const dropCellOffsetX: number = event.offsetX;
        const dropCellWidth: number = (event.target as HTMLElement).clientWidth;
        const dragOverDirection: string =
            dropCellOffsetX < dropCellWidth / 2 ? "left-right" : "right-left";
        const draggedOverCellIndex: number =
            this.getTargetElementCellIndex(event);

        const draggedOverCellChanged: boolean =
            _isNil(this.dragOverDirection) ||
            _isNil(this.draggedOverCellIndex) ||
            draggedOverCellIndex !== this.draggedOverCellIndex ||
            dragOverDirection !== this.dragOverDirection;

        if (draggedOverCellChanged) {
            this.dropCellOffsetX = dropCellOffsetX;
            this.dropCellWidth = dropCellWidth;
            this.dragOverDirection = dragOverDirection;
            this.draggedOverCellIndex = draggedOverCellIndex;
            this.getNewCellIndex();
            this.emitDraggedOverCell();
        }
    }

    /**
     * Updates the dataSource property and broadcasts the change to all listeners of dataSourceChanged
     *
     * @param dataSource
     */
    public changeDataSource(dataSource: any[]): void {
        this.dataSource = dataSource;
        this.dataSourceChanged.next(dataSource);
    }

    /**
     * Returns an array of the selected items
     *
     * @returns An array of all currently selected items
     */
    public getSelectedItems(): any[] {
        const trackedItems = this.dataSource.map((d) => this.trackBy(d?.id, d));
        return this.selectorService.getSelectedItems(
            this.selection,
            trackedItems
        );
    }

    /**
     * Returns the current state of the selector
     *
     * @returns
     */
    public getSelectorState(): ISelectorState {
        return this.selectorService.getSelectorState(
            this.selection,
            this.dataSource.length,
            this.getSelectedItems().length,
            this.totalItems,
            this.selection.include.length,
            this.hasVirtualScroll
        );
    }

    /**
     * Updates the selection type and returns a new selection object based on that new selection type
     *
     * @param selectorValue
     *
     * @returns The newly applied selection
     */
    public applySelector(selectorValue: SelectionType): ISelection {
        return this.selectorService.applySelector(
            this.selection,
            this.dataSource,
            selectorValue,
            this.totalItems,
            this.trackBy,
            this.hasVirtualScroll
        );
    }

    /**
     * Updates the selection object to either include or exclude the row based on the current selection
     *  type and the row's current selection state
     * Then the selection object is broadcasted to all listeners of selectionChanged
     *
     * @param rowObject
     */
    public handleRowCheckbox(rowObject: Object): void {
        const excludedRows = this.selection.exclude;
        const includedRows = this.selection.include;

        const rowObjectTrackBy = this.trackBy(
            (<{ id: number }>rowObject)?.id,
            rowObject
        );

        if (this.selection.isAllPages) {
            if (!_includes(excludedRows, rowObjectTrackBy)) {
                excludedRows.push(rowObjectTrackBy);
            } else {
                excludedRows.splice(excludedRows.indexOf(rowObjectTrackBy), 1);
            }
        } else {
            if (!_includes(includedRows, rowObjectTrackBy)) {
                includedRows.push(rowObjectTrackBy);
            } else {
                includedRows.splice(includedRows.indexOf(rowObjectTrackBy), 1);
            }
        }

        this.selectionChanged.next(this.selection);
    }

    /**
     * Returns the current sorting state of the specified cell index
     *
     * @param cellIndex
     *
     * @returns The current sorting state
     */
    public getSortingState(cellIndex: number): ITableSortingState {
        if (this.state.sortedColumn) {
            return {
                sortingIcon: this.sortIcons[this.state.sortedColumn.direction],
                // comparing column index with index of sorted column
                isColumnSorted:
                    cellIndex ===
                        this.state.columns.indexOf(
                            this.state.sortedColumn.sortBy
                        ) && this.sortable,
            };
        }
        return {
            sortingIcon: undefined,
            isColumnSorted: false,
        };
    }

    /**
     * Broadcasts to all listeners of stickyHeaderChangedSubject that a change has occurred
     */
    public applyStickyStyles(): void {
        this.stickyHeaderChangedSubject.next();
    }
}
