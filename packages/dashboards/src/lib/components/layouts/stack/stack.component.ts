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
    ChangeDetectorRef,
    Component,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
} from "@angular/core";

import { LoggerService } from "@nova-ui/bits";

import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { BaseLayout } from "../base-layout";

@Component({
    selector: "nui-stack",
    templateUrl: "./stack.component.html",
})
export class StackComponent extends BaseLayout implements OnInit, OnDestroy {
    public static lateLoadKey = "StackComponent";

    @Input() nodes: string[] = [];
    @Input() direction = "column";
    @Input() elementClass = "";

    @HostBinding("class") public classNames: string;
    public readonly defaultClassNames = "h-100 w-100 d-flex";

    constructor(
        changeDetector: ChangeDetectorRef,
        pizzagnaService: PizzagnaService,
        logger: LoggerService
    ) {
        super(changeDetector, pizzagnaService, logger);
    }

    public ngOnInit(): void {
        this.classNames = `${this.defaultClassNames} flex-${this.direction} ${this.elementClass}`;
    }

    public ngOnDestroy() {
        // Ensures that any base class observables are unsubscribed.
        super.ngOnDestroy();
    }

    public getNodes(): string[] {
        return this.nodes;
    }
}
