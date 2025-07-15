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

import { CdkDropList } from "@angular/cdk/drag-drop";
import { Component, EventEmitter, Output, viewChild } from "@angular/core";

// import {DraggableComponent} from "./draggable.component";

/**
 * @ignore
 */
@Component({
    selector: "nui-droppable",
    templateUrl: "./droppable.component.html",
    styleUrls: ["./droppable.component.less"],
    standalone: false,
})
export class DroppableComponent {
    // @Input() dragSource: DraggableComponent;

    @Output() dragOver = new EventEmitter<DragEvent>();
    @Output() dragEnter = new EventEmitter<DragEvent>();
    @Output() dragLeave = new EventEmitter<DragEvent>();
    @Output() dropSuccess = new EventEmitter<any>();

    readonly dropList = viewChild(CdkDropList);

    public onDrop(event: any): void {
        if (event.container !== event.previousContainer) {
            this.dropSuccess.emit(event.item.data);
        }
    }
}
