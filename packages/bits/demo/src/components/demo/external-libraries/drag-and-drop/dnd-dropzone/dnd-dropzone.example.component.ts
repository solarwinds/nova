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
    CdkDragDrop,
    CdkDropList,
    copyArrayItem,
} from "@angular/cdk/drag-drop";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "dnd-dropzone",
    templateUrl: "./dnd-dropzone.example.component.html",
    styleUrls: ["./dnd-dropzone.example.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class DndDropzoneExampleComponent {
    public sourceItems: string[] = ["Adobe", "IBM"];
    public destinationItems: string[] = ["Dell"];

    // prevent user from putting back already displaced items
    public sourceAcceptsItem(item: string, dropList?: CdkDropList): boolean {
        return false;
    }

    public destinationAcceptsItem(
        item: string,
        dropList?: CdkDropList
    ): boolean {
        return item === "Adobe" || item === "Dell";
    }

    public onItemDropped(event: CdkDragDrop<string[]>): void {
        if (!this.destinationAcceptsItem(event.item.data)) {
            return;
        }

        copyArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
        );
    }
}
