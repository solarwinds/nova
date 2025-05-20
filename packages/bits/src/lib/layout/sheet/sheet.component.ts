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
    ElementRef,
    HostBinding,
    Input,
    OnInit,
} from "@angular/core";

import { ResizeDirection } from "../../../common/directives/resizer/public-api";
import { ILayoutElementDirection } from "../public-api";

// <example-url>./../examples/index.html#/layout</example-url>
@Component({
    selector: "nui-sheet",
    templateUrl: "./sheet.component.html",
    host: { class: "nui-sheet" },
    styleUrls: ["./sheet.component.less"],
})
export class SheetComponent implements OnInit {
    @HostBinding("class.sheet-fit-content")
    @Input()
    fitContent: boolean;
    @Input() direction: ILayoutElementDirection = "row";
    @Input() initialSizeValue: string;
    @HostBinding("class.sheet-direction-column") directionColumn = false;
    @HostBinding("class.sheet-direction-row") directionRow = true;

    public resizeDirection: ResizeDirection;

    constructor(public elRef: ElementRef) {}

    public ngOnInit(): void {
        this.directionColumn =
            (this.directionColumn && !this.directionRow) ||
            this.direction === "column";
        this.directionRow =
            (!this.directionColumn && this.directionRow) ||
            this.direction === "row";
        this.resizeDirection =
            this.direction === "row"
                ? ResizeDirection.right
                : ResizeDirection.bottom;
    }
}
