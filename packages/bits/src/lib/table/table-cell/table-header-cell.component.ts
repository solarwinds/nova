import { CdkHeaderCell } from "@angular/cdk/table";
import { AfterViewInit, Component, ElementRef, HostBinding, HostListener, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import _get from "lodash/get";
import _isNil from "lodash/isNil";
import _isUndefined from "lodash/isUndefined";
import { fromEvent, Subscription } from "rxjs";
import { filter, pluck } from "rxjs/operators";

import { IDragEvent } from "../../../common/directives/public-api";
import { UtilService } from "../../../services/util.service";
import { FIXED_WIDTH_CLASS } from "../constants";
import { NonResizableColumnTypes, TableAlignmentOptions } from "../types";
import { TableResizePhase } from "../table-resizer/table-resizer.directive";
import { ColumnType, DraggedOverCell, ITableSortingState, TableStateHandlerService } from "../table-state-handler.service";

import { TableColumnDefDirective } from "./table-column-def.directive";

/**
 * @ignore
 */

@Component({
    // eslint-disable-next-line
    selector: "nui-header-cell, th[nui-header-cell]",
    host: {
        "role": "columnheader",
        "class": "nui-table__table-header-cell",
    },
    template: `
        <ng-content></ng-content>
        <nui-icon *ngIf="sortingState.isColumnSorted"
                  class="nui-table__sorting-icon"
                  [icon]="sortingState.sortingIcon"
                  iconColor="gray"></nui-icon>
        <span *ngIf="isColumnResizable()"
              (click)="$event.stopPropagation()"
              nuiTableResizer
              [columnIndex]="currentCellIndex"
              (resizerMovement)="onColumnWidthChange($event)"></span>`,
})
export class TableHeaderCellComponent extends CdkHeaderCell implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @Input() alignment: TableAlignmentOptions;
    @Input() tooltipText: string;
    @Input() isColumnSortingDisabled: boolean = false;
    public currentCellIndex: number;
    private resizeInProgress: boolean;
    // Helps to show/hide edge highlight when cursor is outside of the resizable header cell
    private isCursorInCell: boolean;
    private resizeEventPhase: TableResizePhase;
    private subscriptions: Subscription[] = [];
    public resizable = false;
    public sortingState: ITableSortingState;

    // binding classes
    @HostBinding("class.nui-table__icon-cell")
    get isIconCell(): boolean {
        return this.columnDef.type === "icon";
    }

    /**
     * Conditionally applies a fixed-width marker class for letting external entities
     * know whether manual updates to the cell's width are allowed.
     */
    @HostBinding(`class.${FIXED_WIDTH_CLASS}`)
    get fixedWidth(): boolean {
        return this.isIconCell;
    }

    @HostBinding("class.nui-table__table-header-cell--sortable--dark")
    get shouldBeDarkOnSorting(): boolean {
        return this.sortingState.isColumnSorted;
    }

    @HostBinding("class.nui-table__table-header-cell--reorderable--dark")
    get shouldBeDarkOnReorder(): boolean {
        return this.leftEdgeActive || this.rightEdgeActive;
    }

    @HostBinding("class.nui-table__table-header-cell--sortable")
    get isSortable(): boolean {
        return this.tableStateHandlerService.sortable && !this.isColumnSortingDisabled;
    }

    @HostBinding("class.nui-table__table-header-cell--sortable--text-black")
    get isColumnSorted(): boolean {
        return this.sortingState.isColumnSorted;
    }

    @HostBinding("attr.draggable")
    @HostBinding("class.nui-table__table-header-cell--reorderable")
    get isReorderable(): boolean {
        return this.tableStateHandlerService.reorderable;
    }

    @HostBinding("attr.title")
    get tooltip(): string {
        return this.tooltipText;
    }

    @HostBinding("class.nui-table__table-cell--left-edge-action") leftEdgeActive: boolean;
    @HostBinding("class.nui-table__table-cell--right-edge-action") rightEdgeActive: boolean;

    @HostListener("mouseover")
    mouseMovedOver(): void {
        if (this.isColumnResizable() && !this.resizeInProgress) {
            this.rightEdgeActive = this.isCursorInCell = true;
        }
    }

    @HostListener("mouseleave")
    mouseMovedOut(): void {
        // There are some of edge cases of incorrect highlighting that is covered with these booleans
        this.isCursorInCell = false;
        if (this.isColumnResizable() && this.resizeEventPhase !== "start") {
            this.rightEdgeActive = false;
        }
    }

    @HostListener("click")
    clicked(): void {
        if (this.tableStateHandlerService.sortable && !this.isColumnSortingDisabled && this.resizeEventPhase !== TableResizePhase.start) {
            const cellIndex = this.tableStateHandlerService.tableColumns.indexOf(this.columnDef.name);
            this.tableStateHandlerService.sortColumn(cellIndex);
        }
    }

    // listening for drag n drop events
    @HostListener("dragstart", ["$event"])
    dragStarted(event: IDragEvent): void {
        if (this.isReorderable) {
            const dragTarget = <Element>event.target;
            const dragCellIndex = this.tableStateHandlerService.getTargetElementCellIndex(event);

            this.tableStateHandlerService.dragCellIndex = dragCellIndex;
            event.stopPropagation();

            if (!event.dataTransfer) {
                throw new Error("dataTransfer is null");
            }

            event.dataTransfer.effectAllowed = "move";

            // Prevents dropping foreign elements into table header row
            // Also drag n drop doesn't work in Firefox if no data is attached to event.dataTransfer
            event.dataTransfer.setData("text", dragCellIndex.toString());

            const windowSelection: Selection | null = window.getSelection();
            // Prevents dragging a halo of multiple elements, if being selected on screen
            if (!_isNil(windowSelection?.type) && windowSelection?.type === "Range") {
                windowSelection.removeAllRanges();
                event.dataTransfer.setDragImage(dragTarget, dragTarget.clientWidth / 2, dragTarget.clientHeight / 2);
            }
        }
    }

    @HostListener("drop", ["$event"])
    dropped(event: IDragEvent): void {
        const dragCellIndex = this.tableStateHandlerService.dragCellIndex;
        const dataTransferData = event.dataTransfer?.getData("text");

        event.stopPropagation();
        event.preventDefault();
        this.tableStateHandlerService.draggedOverCell.next(undefined);

        if (!_isNil(dragCellIndex) && !_isNil(dataTransferData) && (dragCellIndex.toString() === dataTransferData)) {
            this.tableStateHandlerService.reorderColumnsOnDrop();
        }
    }

    @HostListener("dragend", ["$event"])
    dragEnd(event: IDragEvent): void {
        event.stopPropagation();
        this.tableStateHandlerService.draggedOverCell.next(undefined);
    }

    constructor(private columnDef: TableColumnDefDirective,
                private elementRef: ElementRef,
                private tableStateHandlerService: TableStateHandlerService,
                private utilService: UtilService,
                private zone: NgZone) {
        super(columnDef, elementRef);

        this.tableStateHandlerService.columnType = <ColumnType>{
            columnName: this.columnDef.name,
            columnType: this.columnDef.type || "default",
        };
    }

    ngOnInit(): void {
        const alignment = this.alignment ? `align-${ this.alignment }` : this.tableStateHandlerService.getAlignment(this.columnDef.name);

        this.resizable = this.tableStateHandlerService.resizable;
        this.elementRef.nativeElement.classList.add(alignment);
        this.currentCellIndex = this.tableStateHandlerService.tableColumns.indexOf(this.columnDef.name);
        this.sortingState = this.tableStateHandlerService.getSortingState(this.currentCellIndex);

        if (this.resizable) {
            // Get initial width
            const columnWidth = this.tableStateHandlerService.getColumnWidth(this.columnDef.name);

            this.elementRef.nativeElement.style.width = columnWidth + "px";
            this.subscriptions.push(this.tableStateHandlerService.shouldHighlightEdge
                .pipe(
                    filter(value => {
                        // When resize is in progress on other columns this one shouldn't be highlighted
                        this.resizeInProgress = value.columnIndex !== this.currentCellIndex &&
                            value.eventPhase === "start";
                        return value.columnIndex === this.currentCellIndex;
                    }),
                    pluck("eventPhase")
                )
                .subscribe((eventPhase: TableResizePhase) => {
                    this.resizeEventPhase = eventPhase;
                    this.rightEdgeActive = this.isCursorInCell;
                }));
        }
        this.subscriptions.push(this.tableStateHandlerService.columnWidthSubject.subscribe(() => {
            const columnWidth = this.tableStateHandlerService.getColumnWidth(this.columnDef.name);
            if (columnWidth > 45) {
                this.elementRef.nativeElement.style.width = columnWidth + "px";
            }
        }));

        if (this.isSortable) {
            this.subscriptions.push(this.tableStateHandlerService.sortingState.subscribe(() => {
                this.sortingState = this.tableStateHandlerService.getSortingState(this.currentCellIndex);
            }));
        }

        if (this.isReorderable) {
            this.subscriptions.push(this.tableStateHandlerService.draggedOverCell.subscribe((draggedOverCell: DraggedOverCell) => {
                this.rightEdgeActive = this.leftEdgeActive = false;
                if (_get(draggedOverCell, "cellIndex") === this.currentCellIndex) {
                    this.rightEdgeActive = draggedOverCell.dropAlignment === "right";
                    this.leftEdgeActive = draggedOverCell.dropAlignment === "left";
                }
            }));
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.alignment && !changes.alignment.firstChange) {
            const newAlignment = `align-${ changes.alignment.currentValue }`;
            const oldAlignment = `align-${ changes.alignment.previousValue }`;
            this.elementRef.nativeElement.classList.remove(oldAlignment);
            this.elementRef.nativeElement.classList.add(newAlignment);
        }
    }

    ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => {
            this.subscriptions.push(fromEvent<DragEvent>(this.elementRef.nativeElement, "dragover").subscribe((event: DragEvent) => {
                event.stopPropagation();
                event.preventDefault();
                this.tableStateHandlerService.setDraggedOverCell(event);
            }));
        });
    }

    public isColumnResizable(): boolean {
        const isColumnTypeResizable = _isUndefined(<NonResizableColumnTypes>(this.columnDef.type));
        return this.tableStateHandlerService.resizable && isColumnTypeResizable;
    }

    public onColumnWidthChange(offset: number): void {
        const calculatedWidth = this.elementRef.nativeElement.getBoundingClientRect().width;
        const resultWidth = calculatedWidth + offset;
        // resultWidth must be more than 45 because minimum width of the column is 46px
        if (resultWidth > 45 || offset > 0) {
            this.elementRef.nativeElement.style.width = resultWidth + "px";
            this.tableStateHandlerService.setColumnWidth(this.columnDef.name, resultWidth);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }
}
