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

import { Component } from "@angular/core";

@Component({
    selector: "nui-dd-cdk-example",
    templateUrl: "./dragdrop.example.component.html",
    styleUrls: ["./dragdrop.example.component.less"],
})
export class DragdropExampleComponent {
    public draggableObj = {
        imma: "little",
        teapot: "short and stout",
    };
    public draggableObjHandle = {
        "here is my handle": "here is my spout",
    };
    public draggableObjPreview = {
        when: "I get all steamed up",
        hear: "me shout",
    };
    public draggableList = ["item 1", "item2", "item3"];
    public destObject: {};

    public onDrop(payload: any) {
        this.destObject = payload;
    }

    public onDragStart(event: DragEvent) {}

    public onDragEnd(event: DragEvent) {}

    public onDragOver(event: DragEvent) {}

    public onDragEnter(event: DragEvent) {}

    public onDragLeave(event: DragEvent) {}
}
