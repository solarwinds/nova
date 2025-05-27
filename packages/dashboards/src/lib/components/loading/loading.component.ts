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
    animate,
    state,
    style,
    transition,
    trigger,
} from "@angular/animations";
import { ChangeDetectorRef, Component, Input } from "@angular/core";

import { IHasChangeDetector } from "../../types";

@Component({
    selector: "nui-loading",
    templateUrl: "./loading.component.html",
    styleUrls: ["./loading.component.less"],
    animations: [
        trigger("animate", [
            state("true", style({ opacity: 1 })),
            state("false", style({ opacity: 0 })),
            transition("false <=> true", animate(500)),
        ]),
    ],
})
export class LoadingComponent implements IHasChangeDetector {
    static lateLoadKey = "LoadingComponent";

    @Input() public active = false;

    constructor(public changeDetector: ChangeDetectorRef) {}
}
