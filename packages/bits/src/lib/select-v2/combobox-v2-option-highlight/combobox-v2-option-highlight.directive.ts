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
    ElementRef,
    Inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import escape from "lodash/escape";
import isUndefined from "lodash/isUndefined";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { HighlightPipe } from "../../../pipes/highlight.pipe";
import { ComboboxV2Component } from "../combobox-v2/combobox-v2.component";
import { NUI_SELECT_V2_OPTION_PARENT_COMPONENT } from "../constants";
import { InputValueTypes } from "../types";

/**
 * @ignore
 *  Will be renamed in scope of the NUI-5797
 */
@Directive({
    selector: "[nuiComboboxV2OptionHighlight]",
    providers: [HighlightPipe],
})
export class ComboboxV2OptionHighlightDirective
    implements OnChanges, OnInit, OnDestroy
{
    /** Part of the text to be highlighted */
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input("nuiComboboxV2OptionHighlight") public value: string;

    private destroy$ = new Subject();

    constructor(
        private el: ElementRef<HTMLElement>,
        @Inject(NUI_SELECT_V2_OPTION_PARENT_COMPONENT)
        private combobox: ComboboxV2Component,
        private highlightPipe: HighlightPipe
    ) {}

    public ngOnInit(): void {
        this.updateHTML(this.combobox.inputValue);

        this.combobox.valueChanged
            .pipe(takeUntil(this.destroy$))
            .subscribe(this.updateHTML.bind(this));

        this.combobox.valueSelected
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.updateHTML());
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.value) {
            this.updateHTML(this.combobox.inputValue);
        }
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private updateHTML(highlighted?: InputValueTypes): void {
        const isHighlightNecessary =
            highlighted &&
            this.combobox.getLastSelectedOption()?.viewValue !== highlighted;

        this.el.nativeElement.innerHTML = (
            isHighlightNecessary && !isUndefined(highlighted)
                ? this.highlightPipe.transform(
                      this.value,
                      highlighted.toString()
                  )
                : escape(this.value)
        ) as string;
    }
}
