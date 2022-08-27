import {
    Directive,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    Output,
} from "@angular/core";

import { TableStateHandlerService } from "../table-state-handler.service";
/** @ignore */
export enum TableResizePhase {
    start = "start",
    end = "end",
}
/** @ignore */
@Directive({
    selector: "[nuiTableResizer]",
})
export class TableResizerDirective {
    @HostBinding("class") hostClasses = "nui-table__resizer";

    @Input() columnIndex: number;

    @Output() resizerMovement = new EventEmitter<any>();

    constructor(private tableStateHandlerService: TableStateHandlerService) {}

    private mouseMoveHandler = (event: MouseEvent) => {
        this.resizerMovement.emit(event.movementX);
    };

    private removeResizeListeners = () => {
        document.removeEventListener("mousemove", this.mouseMoveHandler);
        document.removeEventListener("mouseup", this.removeResizeListeners);
        this.resizerMovement.emit(null);
        // This needs to be after the sort click handler which is why it needs a setTimeout
        setTimeout(() => {
            this.tableStateHandlerService.emitResizeEvent(
                this.columnIndex,
                TableResizePhase.end
            );
        });
    };

    @HostListener("mousedown", ["$event"])
    onMouseDown(ev: MouseEvent) {
        // Event should be emitted to highlight all cells
        this.tableStateHandlerService.emitResizeEvent(
            this.columnIndex,
            TableResizePhase.start
        );
        ev.preventDefault();
        document.addEventListener("mouseup", this.removeResizeListeners);
        document.addEventListener("mousemove", this.mouseMoveHandler);
    }
}
