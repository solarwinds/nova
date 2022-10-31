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
    Component,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    Output,
} from "@angular/core";

import { FileDropState } from "./public-api";

/**
 * <example-url>./../examples/index.html#/file-upload</example-url>
 */

/** @ignore */
@Component({
    selector: "nui-file-drop-example",
    templateUrl: "./file-drop.component.html",
    styleUrls: ["./file-drop.component.less"],
    host: {
        class: "d-inline-flex align-items-center justify-content-center",
    },
})
export class FileDropExampleComponent {
    // TODO: consider renaming this class to DropAreaComponent since it is not file-specific at all

    private counterToHackDragLeave = 0;

    @Input() public state: FileDropState = FileDropState.default;

    @Output() public enter = new EventEmitter<DragEvent>();
    @Output() public leave = new EventEmitter<DragEvent>();
    // Drop is handled as regular JS event in parent component.
    // enter and leave can't be since dragenter and dragleave for parent component are different

    @HostBinding("class.nui-file-drop--active") get hasActiveClass() {
        return this.state === FileDropState.active;
    }
    @HostBinding("class.nui-file-drop--error") get hasErrorClass() {
        return this.state === FileDropState.error;
    }

    // this solves problem with opening the file since browser fires dragover by default
    @HostListener("window:dragover", ["$event"])
    dragOverHandler(ev: DragEvent) {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }

    @HostListener("drop", ["$event"])
    dropHandler(ev: DragEvent) {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        this.counterToHackDragLeave = 0; // important not to break mouseleave hack
    }

    @HostListener("dragenter", ["$event"])
    dragEnterHandler(ev: DragEvent) {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        this.counterToHackDragLeave++;
        if ((ev.currentTarget as Node).contains(ev.currentTarget as Node)) {
            this.enter.emit(ev);
        }
    }

    @HostListener("dragleave", ["$event"])
    dragLeaveHandler(ev: DragEvent) {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();

        this.counterToHackDragLeave--;
        if (this.counterToHackDragLeave === 0) {
            this.leave.emit(ev);
        }
    }
}
