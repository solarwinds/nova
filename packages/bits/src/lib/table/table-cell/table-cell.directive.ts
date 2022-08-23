import { CdkCell } from "@angular/cdk/table";
import {
    ChangeDetectorRef,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import _get from "lodash/get";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

import {
    DraggedOverCell,
    TableStateHandlerService,
} from "../table-state-handler.service";
import { TableAlignmentOptions } from "../types";
import { TableColumnDefDirective } from "./table-column-def.directive";

/**
 * @ignore
 */

@Directive({
    // eslint-disable-next-line
    selector: "nui-cell, td[nui-cell]",
    host: {
        role: "gridcell",
        class: "nui-table__table-cell",
    },
})
export class TableCellDirective
    extends CdkCell
    implements OnInit, OnDestroy, OnChanges
{
    @Input() tooltipText: string;
    @Input() alignment: TableAlignmentOptions;
    public currentCellIndex: number;
    private subscribeToDraggedOverCell: Subscription;
    private resizeSubscription: Subscription;

    @HostBinding("attr.title")
    get tooltip() {
        return this.tooltipText;
    }

    @HostBinding("class.nui-table__table-cell--left-edge-action")
    leftEdgeActive: boolean;
    @HostBinding("class.nui-table__table-cell--right-edge-action")
    rightEdgeActive: boolean;

    // Prevents dragging of table cells content
    @HostListener("mousedown")
    mouseDown() {
        const selection: Selection | null = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
        }
    }

    constructor(
        private columnDef: TableColumnDefDirective,
        private elementRef: ElementRef,
        private tableStateHandlerService: TableStateHandlerService,
        private cd: ChangeDetectorRef
    ) {
        super(columnDef, elementRef);
    }

    ngOnInit() {
        const alignment = this.alignment
            ? `align-${this.alignment}`
            : this.tableStateHandlerService.getAlignment(this.columnDef.name);

        this.elementRef.nativeElement.classList.add(alignment);
        this.currentCellIndex =
            this.tableStateHandlerService.tableColumns.indexOf(
                this.columnDef.name
            );

        if (this.tableStateHandlerService.reorderable) {
            this.subscribeToDraggedOverCell =
                this.tableStateHandlerService.draggedOverCell.subscribe(
                    (draggedOverCell: DraggedOverCell) => {
                        this.rightEdgeActive = this.leftEdgeActive = false;
                        if (
                            _get(draggedOverCell, "cellIndex") ===
                            this.currentCellIndex
                        ) {
                            this.rightEdgeActive =
                                draggedOverCell.dropAlignment === "right";
                            this.leftEdgeActive =
                                draggedOverCell.dropAlignment === "left";
                            this.cd.detectChanges();
                        }
                    }
                );
        }

        if (this.tableStateHandlerService.resizable) {
            this.resizeSubscription =
                this.tableStateHandlerService.shouldHighlightEdge
                    .pipe(
                        filter(
                            (value) =>
                                value.columnIndex === this.currentCellIndex
                        )
                    )
                    .subscribe(() => {
                        // Anytime the event for this column is emitted state will change.
                        this.rightEdgeActive = !this.rightEdgeActive;
                    });
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.alignment && !changes.alignment.firstChange) {
            const newAlignment = `align-${changes.alignment.currentValue}`;
            const oldAlignment = `align-${changes.alignment.previousValue}`;
            this.elementRef.nativeElement.classList.remove(oldAlignment);
            this.elementRef.nativeElement.classList.add(newAlignment);
        }
    }

    ngOnDestroy() {
        if (this.subscribeToDraggedOverCell) {
            this.subscribeToDraggedOverCell.unsubscribe();
        }

        if (this.resizeSubscription) {
            this.resizeSubscription.unsubscribe();
        }
    }
}
