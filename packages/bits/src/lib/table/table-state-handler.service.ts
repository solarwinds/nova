import { forwardRef, Inject, Injectable, NgZone, TrackByFunction } from "@angular/core";
import _includes from "lodash/includes";
import _isNil from "lodash/isNil";
import _isNumber from "lodash/isNumber";
import { Subject } from "rxjs";

import { ISelection, ISelectorState } from "../../services/public-api";
import { SelectionType } from "../selector/public-api";
import { SelectorService } from "../selector/selector.service";
import { ISortedItem, SorterDirection } from "../sorter/public-api";

import { TableResizePhase } from "./table-resizer/table-resizer.directive";

/**@ignore*/
export const enum AlignmentClasses {
    RIGHT = "align-right",
    LEFT = "align-left",
    CENTER = "align-center",
}

/**@ignore*/
export const enum DropAlignment {
    left = "left",
    right = "right",
}

/**@ignore*/
export interface ITableState {
    columnAlignments: { [key: string]: string };
    columnsWidths: { [key: string]: { width: number, autoCalculated?: boolean } };
    columns: string[];
    sortedColumn?: ISortedItem;
    widthCalculationPerformed: boolean;
    columnsTypes: string[];
}

/**@ignore*/
export interface DraggedOverCell {
    cellIndex: number;
    dropAlignment: DropAlignment;
}

/**@ignore*/
export interface TableCellEdgeHighlight {
    columnIndex: number;
    side: DropAlignment;
    eventPhase: TableResizePhase;
}

/**@ignore*/
export interface ColumnType {
    columnName: string;
    columnType: string;
}

/**@ignore*/
export interface ITableSortingState {
    sortingIcon?: string;
    isColumnSorted: boolean;
}

/**@ignore*/
const MIN_COLUMN_WIDTH_PX = 46;
/**@ignore*/
const ICON_CELL_WIDTH_PX = 40;

const SELECTABLE_CELL_WIDTH_PX = 75;

/**@ignore*/
const DEFAULT_TRACK_BY: TrackByFunction<any> = ((i, d) => d);

/**
 * @ignore
 */
@Injectable()
export class TableStateHandlerService {
    public tableParentWidth: number;
    public columnsState = new Subject<string[]>();
    public sortingState = new Subject<ISortedItem>();
    public draggedOverCell = new Subject<DraggedOverCell>();
    public shouldHighlightEdge = new Subject<TableCellEdgeHighlight>();
    public dataSourceChanged = new Subject<Array<any>>();
    public selectionChanged = new Subject<ISelection>();
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

    private state: ITableState = {
        columnAlignments: {},
        columns: [],
        columnsWidths: {},
        widthCalculationPerformed: false,
        columnsTypes: [],
    };

    private sortIcons: { [key: string]: string } = {
        "asc": "triangle-up",
        "desc": "triangle-down",
    };

    constructor(private zone: NgZone, @Inject(forwardRef(() => SelectorService)) private selectorService: SelectorService) {
    }

    // Used to sync directives and components in table to apply additional styles and logic
    set sortable(isSortable: boolean) {
        this._sortable = isSortable;
    }

    get sortable() {
        return this._sortable;
    }

    set dragCellIndex(cellIndex: number) {
        this._dragCellIndex = cellIndex;
    }

    get dragCellIndex() {
        return this._dragCellIndex;
    }

    set draggedOverCellIndex(cellIndex: number) {
        this._draggedOverCellIndex = cellIndex;
    }

    get draggedOverCellIndex() {
        return this._draggedOverCellIndex;
    }

    set newCellIndex(cellIndex: number) {
        this._newCellIndex = cellIndex;
    }

    get newCellIndex() {
        return this._newCellIndex;
    }

    set dropCellOffsetX(cellIndex: number) {
        this._dropCellOffsetX = cellIndex;
    }

    get dropCellOffsetX() {
        return this._dropCellOffsetX;
    }

    set dropCellWidth(cellIndex: number) {
        this._dropCellWidth = cellIndex;
    }

    get dropCellWidth() {
        return this._dropCellWidth;
    }

    set dragOverDirection(cellIndex: string) {
        this._dragOverDirection = cellIndex;
    }

    get dragOverDirection() {
        return this._dragOverDirection;
    }

    set reorderable(isDraggable: boolean) {
        this._reorderable = isDraggable;
    }

    get reorderable() {
        return this._reorderable;
    }

    set resizable(isResizable: boolean) {
        this._resizable = isResizable;
    }

    get resizable() {
        return this._resizable;
    }

    set tableColumns(columns: string[]) {
        this.state.columns = columns;
    }

    get tableColumns() {
        return this.state.columns;
    }

    set columnType(column: ColumnType) {
        const columnIndex = this.state.columns.indexOf(column.columnName);
        this.state.columnsTypes[columnIndex] = column.columnType;
    }

    get columnsTypes() {
        return this.state.columnsTypes;
    }

    set sortedColumn(columnToSort: ISortedItem) {
        this.state.sortedColumn = columnToSort;
    }

    set selectable(isSelectable: boolean) {
        this._selectable = isSelectable;
    }

    get selectable() {
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

    get totalItems() {
        return this._totalItems;
    }

    set dataSource(dataSource: any[]) {
        this._dataSource = dataSource;
    }

    get dataSource() {
        return this._dataSource;
    }

    set selection(selection: ISelection) {
        this._selection = selection;
    }

    get selection() {
        return this._selection;
    }

    get trackBy(): TrackByFunction<any> {
        return this._trackBy || DEFAULT_TRACK_BY;
    }

    set trackBy(value) {
        this._trackBy = value;
    }

    public getColumnWidth(column: string): number {
        if (!this.state.widthCalculationPerformed) {
            this.calculateWidthsOfColumns();
        }
        return this.state.columnsWidths[column].width;
    }

    public setColumnWidth(column: string, width: number): void {
        this.state.columnsWidths[column] = { width };
        this.columnWidthSubject.next();
    }

    public getAlignment(column: string): string {
        return this.state.columnAlignments[column];
    }

    public setAlignment(column: string, alignment: string = AlignmentClasses.LEFT): void {
        this.state.columnAlignments[column] = alignment || this.state.columnAlignments[column];
    }

    public defineAlignment(value: any): string | undefined {
        if (_isNumber(value)) {
            return AlignmentClasses.RIGHT;
        }
    }

    public calculateWidthsOfColumns() {
        // Apply width of 40px for non-resizable columns of type "icon"
        this.state.columns
            .filter(columnName => {
                const columnIndex = this.state.columns.indexOf(columnName);
                return this.state.columnsTypes[columnIndex] === "icon";
            })
            .forEach(column => {
                this.state.columnsWidths[column] = { width: ICON_CELL_WIDTH_PX };
            });

        // "selectable" adding one more column with 75px width which is not in the "this.state.columns", so we need take it to the consideration
        const accumulator = (this.resizable && this.selectable) ? SELECTABLE_CELL_WIDTH_PX : 0;
        const userColumnsWidths = this.state.columns
            .filter(columnName => this.state.columnsWidths[columnName])
            .reduce((total, curr) =>
                total + this.state.columnsWidths[curr].width, accumulator);
        const widthConsideringUserInputs = userColumnsWidths > this.tableParentWidth ? 0 : this.tableParentWidth - userColumnsWidths - 1;
        const columnsToCalculateWidth = this.state.columns
            .filter(columnName => !this.state.columnsWidths[columnName])
            .length;
        const calculatedWidth = Math.floor(widthConsideringUserInputs / columnsToCalculateWidth);
        const widthOfColumn = calculatedWidth > MIN_COLUMN_WIDTH_PX ? calculatedWidth : MIN_COLUMN_WIDTH_PX;

        this.state.columns
            .filter(columnName => !this.state.columnsWidths[columnName])
            .forEach(column => {
                // There is a case when sum of columns can exceed width of parent
                // Then width of other columns should be set to min width
                this.state.columnsWidths[column] = { width: widthOfColumn };
            });

        this.state.widthCalculationPerformed = true;
    }

    public sortColumn(sortCellIndex: number) {
        const newSortedColumn = this.state.columns[sortCellIndex];
        const prevSortedColumn = this.state.sortedColumn && this.state.sortedColumn.sortBy;
        const prevSortDirection = this.state.sortedColumn && this.state.sortedColumn.direction;

        let newSortDirection = SorterDirection.original;

        if (newSortedColumn === prevSortedColumn) {
            newSortDirection = (prevSortDirection === SorterDirection.ascending) ?
                SorterDirection.descending : SorterDirection.ascending;
        } else {
            newSortDirection = SorterDirection.ascending;
        }

        this.state.sortedColumn = {
            sortBy: newSortedColumn,
            direction: newSortDirection,
        };

        this.sortingState.next(this.state.sortedColumn);
    }

    public reorderColumns(dragCellIndex: number, newCellIndex: number): void {
        const dragCellValue = this.state.columns[dragCellIndex];
        this.state.columns.splice(dragCellIndex, 1);
        this.state.columns.splice(newCellIndex, 0, dragCellValue);
        this.columnsState.next(this.state.columns);
    }

    public reorderColumnsOnDrop(): void {
        this.getNewCellIndex();

        if (!_isNil(this.newCellIndex) && (this.newCellIndex !== this.dragCellIndex) && (this.dragCellIndex !== this.draggedOverCellIndex)) {
            this.reorderColumns(this.dragCellIndex, this.newCellIndex);
        }
    }

    public getNewCellIndex(): void {
        if (this.dragCellIndex !== this.draggedOverCellIndex) {
            this.newCellIndex = (this.dragCellIndex < this.draggedOverCellIndex)
                ? ((this.dropCellOffsetX < this.dropCellWidth / 2) ? (this.draggedOverCellIndex - 1) : this.draggedOverCellIndex)
                : ((this.dropCellOffsetX < this.dropCellWidth / 2) ? this.draggedOverCellIndex : (this.draggedOverCellIndex + 1));
        }
    }

    public getTargetElementCellIndex(event: DragEvent): number {
        // When we have selectable table we need to decrease index of event.target.id by one because we added new column to html but not adding column to
        // this.state.columns. Because of that cellIndex in event will be greater than index in this.state.columns by one.
        const cellIndex = parseInt((event.target as any).cellIndex, 10);
        return this.selectable ? cellIndex - 1 : cellIndex;
    }

    public getDropCellAlignment(): DropAlignment {
        return ((this.dragCellIndex < this.draggedOverCellIndex)
            ? ((this.newCellIndex < this.draggedOverCellIndex) ? DropAlignment.left : DropAlignment.right)
            : ((this.newCellIndex > this.draggedOverCellIndex) ? DropAlignment.right : DropAlignment.left));
    }

    public emitDraggedOverCell(): void {
        this.zone.run(() => {
            if ((this.dragCellIndex !== this.draggedOverCellIndex) && (this.dragCellIndex !== this.newCellIndex)) {
                this.draggedOverCell.next(<DraggedOverCell>{
                    cellIndex: this.draggedOverCellIndex,
                    dropAlignment: this.getDropCellAlignment(),
                });
            } else {
                this.draggedOverCell.next(undefined);
            }
        });
    }

    public emitResizeEvent(columnIndex: number, eventPhase: TableResizePhase): void {
        this.shouldHighlightEdge.next({ columnIndex, side: DropAlignment.right, eventPhase });
    }

    public setDraggedOverCell(event: DragEvent): void {
        const dropCellOffsetX: number = event.offsetX;
        const dropCellWidth: number = (event.target as HTMLElement).clientWidth;
        const dragOverDirection: string = (dropCellOffsetX < dropCellWidth / 2) ? "left-right" : "right-left";
        const draggedOverCellIndex: number = this.getTargetElementCellIndex(event);

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

    public changeDataSource(dataSource: any[]) {
        this.dataSource = dataSource;
        this.dataSourceChanged.next(dataSource);
    }

    public getSelectedItems() {
        const trackedItems = this.dataSource.map(d => this.trackBy(d?.id, d));
        return this.selectorService.getSelectedItems(this.selection, trackedItems);
    }

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

    public handleRowCheckbox(rowObject: Object) {
        const excludedRows = this.selection.exclude;
        const includedRows = this.selection.include;

        const rowObjectTrackBy = this.trackBy((<{id: number}>rowObject)?.id, rowObject);

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

    public getSortingState(cellIndex: number): ITableSortingState {
        if (this.state.sortedColumn) {
            return {
                sortingIcon: this.sortIcons[this.state.sortedColumn.direction],
                // comparing column index with index of sorted column
                isColumnSorted: cellIndex === this.state.columns.indexOf(this.state.sortedColumn.sortBy) && this.sortable,
            };
        }
        return {
            sortingIcon: undefined,
            isColumnSorted: false,
        };
    }

    public applyStickyStyles(): void {
        this.stickyHeaderChangedSubject.next();
    }
}
