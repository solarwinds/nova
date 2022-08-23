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
