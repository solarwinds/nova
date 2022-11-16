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
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    forwardRef,
    HostBinding,
    Inject,
    OnDestroy,
    Optional,
    QueryList,
} from "@angular/core";
import every from "lodash/every";
import { merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { NUI_SELECT_V2_OPTION_PARENT_COMPONENT } from "../constants";
import { SelectV2OptionComponent } from "../option/select-v2-option.component";
import { IOptionedComponent } from "../types";

/**
 * @ignore
 * Will be renamed in scope of the NUI-5797
 */
@Component({
    selector: "nui-select-v2-option-group",
    template: "<ng-content></ng-content>",
    styleUrls: ["./select-v2-option-group.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { role: "group" },
})
export class SelectV2OptionGroupComponent
    implements AfterContentInit, OnDestroy
{
    /** Whether the Option Group outfiltered */
    @HostBinding("class.hidden")
    public outfiltered: boolean = false;

    @ContentChildren(forwardRef(() => SelectV2OptionComponent))
    private options: QueryList<SelectV2OptionComponent>;
    private select: IOptionedComponent;
    private onDestroy$ = new Subject<void>();

    constructor(
        @Optional()
        @Inject(NUI_SELECT_V2_OPTION_PARENT_COMPONENT)
        parent: IOptionedComponent
    ) {
        this.select = parent;
    }

    public ngAfterContentInit(): void {
        if (this.select.isTypeaheadEnabled) {
            merge([this.select.valueChanged, this.select.valueSelected])
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(() => {
                    this.outfiltered = every(
                        this.options.toArray(),
                        (option: SelectV2OptionComponent) => option.outfiltered
                    );
                });
        }
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
