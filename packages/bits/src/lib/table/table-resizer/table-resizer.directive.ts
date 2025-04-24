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
    standalone: false,
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
    onMouseDown(ev: MouseEvent): void {
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
