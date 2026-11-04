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

import { Overlay } from "@angular/cdk/overlay";
import { CdkHeaderCell } from "@angular/cdk/table";
import {
    afterNextRender,
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    Injector,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Renderer2,
    SimpleChanges,
    ViewChild,
} from "@angular/core";
import _isNil from "lodash/isNil";
import _isUndefined from "lodash/isUndefined";
import { fromEvent, Subscription } from "rxjs";
import { filter, pluck } from "rxjs/operators";

import { TableColumnDefDirective } from "./table-column-def.directive";
import { IDragEvent } from "../../../common/directives/public-api";
import { UtilService } from "../../../services/util.service";
import { OVERLAY_WITH_POPUP_STYLES_CLASS } from "../../overlay/constants";
import { OverlayComponent } from "../../overlay/overlay-component/overlay.component";
import { SorterDirection } from "../../sorter/public-api";
import { FIXED_WIDTH_CLASS } from "../constants";
import { TableResizePhase } from "../table-resizer/table-resizer.directive";
import {
    ColumnType,
    ITableSortingState,
    MIN_COLUMN_WIDTH_PX,
    TableStateHandlerService,
} from "../table-state-handler.service";
import { NonResizableColumnTypes, TableAlignmentOptions } from "../types";

/**
 * @ignore
 */

@Component({
    selector: "nui-header-cell, th[nui-header-cell]",
    host: {
        role: "columnheader",
        class: "nui-table__table-header-cell",
    },
    template: ` <ng-content></ng-content>
        <nui-icon
            *ngIf="sortingState.isColumnSorted"
            class="nui-table__sorting-icon"
            [icon]="sortingState.sortingIcon"
            iconColor="gray"
        ></nui-icon>
        <ng-container *ngIf="isColumnResizable()">
            <button
                #resizer
                type="button"
                nuiTableResizer
                [attr.aria-label]="resizeAriaLabel"
                aria-haspopup="dialog"
                [attr.aria-expanded]="columnWidthOverlay.showing"
                [columnIndex]="currentCellIndex"
                (resizerMovement)="onColumnWidthChange($event)"
                (resizeRequested)="openColumnWidth()"
            ></button>
            <nui-overlay
                #columnWidthOverlay
                [toggleReference]="resizer"
                roleAttr="dialog"
                [ariaLabel]="columnWidthDialogLabel"
                (clickOutside)="closeColumnWidth(false)"
            >
                <form
                    class="nui-table__column-width-editor p-3"
                    novalidate
                    [cdkTrapFocus]="columnWidthOverlay.showing"
                    [cdkTrapFocusAutoCapture]="columnWidthOverlay.showing"
                    (submit)="applyColumnWidth($event, columnWidthInput)"
                    (keydown.enter)="$event.stopPropagation()"
                    (keydown.escape)="$event.stopPropagation()"
                    (keyup.escape)="$event.stopPropagation(); closeColumnWidth()"
                >
                    <label [attr.for]="columnWidthInputId" i18n>Width (px)</label>
                    <input
                        #columnWidthInput
                        cdkFocusInitial
                        class="form-control input-control"
                        [id]="columnWidthInputId"
                        type="number"
                        step="any"
                        required
                        [min]="minimumColumnWidth"
                        [value]="columnWidth"
                        [attr.aria-invalid]="isColumnWidthInvalid"
                        [attr.aria-describedby]="
                            columnWidthInputId +
                            (isColumnWidthInvalid ? '-error' : '-hint')
                        "
                        (input)="isColumnWidthInvalid = false"
                    />
                    <p [id]="columnWidthInputId + '-hint'" class="mt-2" i18n>
                        Minimum width: {{ minimumColumnWidth }} px.
                    </p>
                    <p
                        *ngIf="isColumnWidthInvalid"
                        [id]="columnWidthInputId + '-error'"
                        class="text-danger"
                        role="alert"
                        i18n
                    >
                        Enter a width of at least {{ minimumColumnWidth }} pixels.
                    </p>
                    <div class="d-flex justify-content-end">
                        <button
                            nui-button
                            type="button"
                            displayStyle="action"
                            class="mr-3"
                            (click)="closeColumnWidth()"
                            i18n
                        >
                            Cancel
                        </button>
                        <button
                            nui-button
                            type="submit"
                            displayStyle="primary"
                            i18n
                        >
                            Apply
                        </button>
                    </div>
                </form>
            </nui-overlay>
            <span
                class="sr-only nui-table__column-width-announcement"
                role="status"
            >{{ columnWidthAnnouncement }}</span>
        </ng-container>`,
    standalone: false,
})
export class TableHeaderCellComponent
    extends CdkHeaderCell
    implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
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
    public readonly minimumColumnWidth = MIN_COLUMN_WIDTH_PX;
    public readonly columnWidthInputId: string;
    public columnWidth: number;
    public isColumnWidthInvalid = false;
    public columnWidthAnnouncement = "";

    @ViewChild("columnWidthOverlay")
    public columnWidthOverlay: OverlayComponent;
    @ViewChild("columnWidthInput")
    private columnWidthInput: ElementRef<HTMLInputElement>;

    public get columnLabel(): string {
        const header = this.elementRef.nativeElement;
        const controls: Array<Node | null> = [
            header.querySelector(".nui-table__resizer"),
            header.querySelector(".nui-table__sorting-icon"),
            header.querySelector("nui-overlay"),
            header.querySelector(".nui-table__column-width-announcement"),
        ];
        return (
            Array.from(header.childNodes)
                .filter(
                    node =>
                        (node.nodeType === 1 || node.nodeType === 3) &&
                        !controls.includes(node)
                )
                .map(node => node.textContent)
                .join("")
                .trim() || this.columnDef.name
        );
    }

    public get resizeAriaLabel(): string {
        return $localize`Resize column ${this.columnLabel}`;
    }

    public get columnWidthDialogLabel(): string {
        return $localize`Column width: ${this.columnLabel}`;
    }

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
        return (
            this.tableStateHandlerService.sortable &&
            !this.isColumnSortingDisabled
        );
    }

    @HostBinding("class.nui-table__table-header-cell--sortable--text-black")
    get isColumnSorted(): boolean {
        return this.sortingState.isColumnSorted;
    }

    /**
     * Exposes the current sort direction of a sortable column to assistive
     * technologies (WCAG 4.1.2). Returns null for non-sortable columns.
     */
    @HostBinding("attr.aria-sort")
    get ariaSort(): string | null {
        if (!this.isSortable) {
            return null;
        }
        if (!this.sortingState.isColumnSorted) {
            return "none";
        }
        return this.sortingState.sortDirection === SorterDirection.descending
            ? "descending"
            : "ascending";
    }

    /**
     * Makes sortable column headers reachable by keyboard (WCAG 2.1.1).
     */
    @HostBinding("attr.tabindex")
    get sortTabindex(): number | null {
        return this.isSortable ? 0 : null;
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

    @HostBinding("class.nui-table__table-cell--left-edge-action")
    leftEdgeActive: boolean;
    @HostBinding("class.nui-table__table-cell--right-edge-action")
    rightEdgeActive: boolean;

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
        this.triggerSort();
    }

    @HostListener("keydown.enter")
    onEnterKey(): void {
        this.triggerSort();
    }

    // Space activates the sort and must suppress the page scroll. Angular types
    // the key-filtered ($event) as a generic Event under strict templates.
    @HostListener("keydown.space", ["$event"])
    onSpaceKey(event: Event): void {
        event.preventDefault();
        this.triggerSort();
    }

    private triggerSort(): void {
        if (
            this.tableStateHandlerService.sortable &&
            !this.isColumnSortingDisabled &&
            this.resizeEventPhase !== TableResizePhase.start
        ) {
            const cellIndex =
                this.tableStateHandlerService.tableColumns.indexOf(
                    this.columnDef.name
                );
            this.tableStateHandlerService.sortColumn(cellIndex);
        }
    }

    // listening for drag n drop events
    @HostListener("dragstart", ["$event"])
    dragStarted(event: IDragEvent): void {
        if (this.isReorderable) {
            const dragTarget = <Element>event.target;
            const dragCellIndex =
                this.tableStateHandlerService.getTargetElementCellIndex(event);

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
            if (
                !_isNil(windowSelection?.type) &&
                windowSelection?.type === "Range"
            ) {
                windowSelection.removeAllRanges();
                event.dataTransfer.setDragImage(
                    dragTarget,
                    dragTarget.clientWidth / 2,
                    dragTarget.clientHeight / 2
                );
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

        if (
            !_isNil(dragCellIndex) &&
            !_isNil(dataTransferData) &&
            dragCellIndex.toString() === dataTransferData
        ) {
            this.tableStateHandlerService.reorderColumnsOnDrop();
        }
    }

    @HostListener("dragend", ["$event"])
    dragEnd(event: IDragEvent): void {
        event.stopPropagation();
        this.tableStateHandlerService.draggedOverCell.next(undefined);
    }

    constructor(
        private columnDef: TableColumnDefDirective,
        private elementRef: ElementRef<HTMLElement>,
        private tableStateHandlerService: TableStateHandlerService,
        private utilService: UtilService,
        private zone: NgZone,
        private renderer: Renderer2,
        private overlay: Overlay,
        private injector: Injector
    ) {
        super(columnDef, elementRef);
        this.columnWidthInputId =
            "nui-table-column-width-" + this.utilService.nextUid();

        this.tableStateHandlerService.columnType = <ColumnType>{
            columnName: this.columnDef.name,
            columnType: this.columnDef.type || "default",
        };
    }

    public ngOnInit(): void {
        const alignment = this.alignment
            ? `align-${this.alignment}`
            : this.tableStateHandlerService.getAlignment(this.columnDef.name);

        this.resizable = this.tableStateHandlerService.resizable;
        this.elementRef.nativeElement.classList.add(alignment);
        this.currentCellIndex =
            this.tableStateHandlerService.tableColumns.indexOf(
                this.columnDef.name
            );
        this.sortingState = this.tableStateHandlerService.getSortingState(
            this.currentCellIndex
        );

        if (this.resizable) {
            // Get initial width
            const columnWidth = this.tableStateHandlerService.getColumnWidth(
                this.columnDef.name
            );

            this.elementRef.nativeElement.style.width = columnWidth + "px";
            this.subscriptions.push(
                this.tableStateHandlerService.shouldHighlightEdge
                    .pipe(
                        filter(value => {
                            // When resize is in progress on other columns this one shouldn't be highlighted
                            this.resizeInProgress =
                                value.columnIndex !== this.currentCellIndex &&
                                value.eventPhase === "start";
                            return value.columnIndex === this.currentCellIndex;
                        }),
                        pluck("eventPhase")
                    )
                    .subscribe((eventPhase: TableResizePhase) => {
                        this.resizeEventPhase = eventPhase;
                        this.rightEdgeActive = this.isCursorInCell;
                    })
            );
        }
        this.subscriptions.push(
            this.tableStateHandlerService.columnWidthSubject.subscribe(() => {
                const columnWidth =
                    this.tableStateHandlerService.getColumnWidth(
                        this.columnDef.name
                    );
                if (columnWidth > 45) {
                    this.renderer.setStyle(
                        this.elementRef.nativeElement,
                        "width",
                        columnWidth + "px"
                    );
                }
            })
        );

        if (this.isSortable) {
            this.subscriptions.push(
                this.tableStateHandlerService.sortingState.subscribe(() => {
                    this.sortingState =
                        this.tableStateHandlerService.getSortingState(
                            this.currentCellIndex
                        );
                })
            );
        }

        if (this.isReorderable) {
            this.subscriptions.push(
                this.tableStateHandlerService.draggedOverCell.subscribe(
                    draggedOverCell => {
                        this.rightEdgeActive = this.leftEdgeActive = false;
                        if (
                            draggedOverCell?.cellIndex === this.currentCellIndex
                        ) {
                            this.rightEdgeActive =
                                draggedOverCell?.dropAlignment === "right";
                            this.leftEdgeActive =
                                draggedOverCell?.dropAlignment === "left";
                        }
                    }
                )
            );
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.alignment && !changes.alignment.firstChange) {
            const newAlignment = `align-${changes.alignment.currentValue}`;
            const oldAlignment = `align-${changes.alignment.previousValue}`;
            this.elementRef.nativeElement.classList.remove(oldAlignment);
            this.elementRef.nativeElement.classList.add(newAlignment);
        }
    }

    public ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => {
            this.subscriptions.push(
                fromEvent<DragEvent>(
                    this.elementRef.nativeElement,
                    "dragover"
                ).subscribe((event: DragEvent) => {
                    event.stopPropagation();
                    event.preventDefault();
                    this.tableStateHandlerService.setDraggedOverCell(event);
                })
            );
        });
    }

    public isColumnResizable(): boolean {
        const isColumnTypeResizable = _isUndefined(
            <NonResizableColumnTypes>this.columnDef.type
        );
        return this.tableStateHandlerService.resizable && isColumnTypeResizable;
    }

    public onColumnWidthChange(offset: number): void {
        const currentWidth = this.tableStateHandlerService.getColumnWidth(
            this.columnDef.name
        );
        const resultWidth = currentWidth + offset;

        // resultWidth must be more than 45 because minimum width of the column is 46px
        if (resultWidth > 45 || offset > 0) {
            this.tableStateHandlerService.setColumnWidth(
                this.columnDef.name,
                resultWidth
            );
        }
    }

    public openColumnWidth(): void {
        const popup = this.columnWidthOverlay;
        if (popup.showing) {
            return;
        }
        this.columnWidth = this.tableStateHandlerService.getColumnWidth(
            this.columnDef.name
        );
        this.isColumnWidthInvalid = false;
        popup.toggleReference.focus();
        popup.overlayConfig = {
            width: 280,
            maxWidth: "calc(100vw - 16px)",
            panelClass: [OVERLAY_WITH_POPUP_STYLES_CLASS],
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo(popup.toggleReference)
                .withFlexibleDimensions(false)
                .withPush(true)
                .withViewportMargin(8)
                .withPositions([
                    {
                        originX: "end",
                        originY: "bottom",
                        overlayX: "end",
                        overlayY: "top",
                    },
                    {
                        originX: "end",
                        originY: "top",
                        overlayX: "end",
                        overlayY: "bottom",
                    },
                ]),
        };
        popup.show();
        afterNextRender(
            () => {
                if (popup.showing) {
                    this.columnWidthInput.nativeElement.value = String(
                        this.columnWidth
                    );
                    this.columnWidthInput.nativeElement.focus();
                    this.columnWidthInput.nativeElement.select();
                }
            },
            { injector: this.injector }
        );
    }

    public applyColumnWidth(event: Event, input: HTMLInputElement): void {
        event.preventDefault();
        event.stopPropagation();
        const width = input.valueAsNumber;
        if (!Number.isFinite(width) || width < this.minimumColumnWidth) {
            this.isColumnWidthInvalid = true;
            input.focus();
            return;
        }
        this.tableStateHandlerService.setColumnWidth(
            this.columnDef.name,
            width
        );
        this.columnWidthAnnouncement = $localize`${this.columnLabel} column width: ${width} pixels`;
        this.closeColumnWidth();
    }

    public closeColumnWidth(restoreFocus = true): void {
        const popup = this.columnWidthOverlay;
        if (!popup?.showing) {
            return;
        }
        popup.hide();
        if (restoreFocus && popup.toggleReference.isConnected) {
            popup.toggleReference.focus();
        }
    }

    public ngOnDestroy(): void {
        this.closeColumnWidth(false);
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
