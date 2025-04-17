// © 2023 SolarWinds Worldwide, LLC. All rights reserved.
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
//  THE SOFTWARE.s

import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
import { Subject } from "rxjs";

import { HelpEntry, Tokenizer } from "@nova-ui/bits";

import { ExampleHelp } from "../freetype-query-builder-test/example-help";
import { ExampleTokenizer } from "../freetype-query-builder-test/example-tokenizer";
import { ExampleAppToken } from "../freetype-query-builder-test/models";
import { ExampleAppRenderer } from "../freetype-query-builder-test/renderer";

@Component({
    selector: "example-freetype-query-builder",
    templateUrl: "./example-freetype-query-builder.component.html",
    standalone: false
})
export class ExampleFreetypeQueryBuilderComponent {
    @Input() exampleId: string;
    /**
     * Inputs and outputs here are example of how the api for such a component can look. But This is going to be very specific based on required use-cases.
     */
    @Input()
    readonly: boolean = false;
    @Input()
    placeholder: string = "default placeholder";
    @Input()
    value: string = "";
    @Input()
    draggingInProgress = false;
    @Output()
    focusedTokenChange = new EventEmitter();
    @Output()
    tokensChange = new EventEmitter();
    @Output()
    cursorPosChange = new EventEmitter();
    @Output() valueChange = new EventEmitter<string>();
    @Output() submitQuery = new EventEmitter();

    tokens: ExampleAppToken[] = [];
    cursorSetter$$ = new Subject();
    currentCursorPos = -1;

    renderer = new ExampleAppRenderer();
    currentHelp: HelpEntry[] = [];
    tokenizer: Tokenizer<ExampleAppToken> = new ExampleTokenizer();
    helpUpdater: ExampleHelp = new ExampleHelp();

    constructor(private cd: ChangeDetectorRef) {}

    onValueChange($event: { value: string; tokens: ExampleAppToken[] }): void {
        this.tokens = $event.tokens;
        if (this.value !== $event.value) {
            this.value = $event.value;
        }
        this.updateHelp();
    }

    onCursorPosChange($event: number): void {
        if (this.currentCursorPos !== $event) {
            this.currentCursorPos = $event;
            this.updateHelp();
            this.cd.detectChanges();
        }
    }

    onSubmit(): void {}

    /**
     * This is example of how can be handled selection value in help. This is NOT required approach.
     *
     * FreeTypeQueryBuilder does not enforce replacing any value
     * in the input. It offers full flexibility on consumer side to decide what action is going to happen when option is chosen.
     *
     * This specific example will replace value of current token with value from option selected.
     * @param $event
     */
    updateTextAfterHelpSelection($event: { value: string }): void {
        const idx = this.getFocusedTokenIndex();
        const nextCurPos = this.tokens[idx].start + $event.value.length;
        this.value =
            this.value.substring(0, this.tokens[idx].start) +
            $event.value +
            this.value.substring(this.tokens[idx].end + 1);
        this.cursorSetter$$.next(nextCurPos);
    }

    /**
     * This is example of how can be help updated based on selected token. This is NOT required approach.
     *
     * FreeTypeQueryBuilder does not enforce specific approach.
     *
     * This specific example is updating help based on focused token type.
     */
    updateHelp(): void {
        const idx = this.getFocusedTokenIndex();
        this.currentHelp = this.helpUpdater.getCurrentHelp(idx, this.tokens);
    }

    getFocusedTokenIndex(): number {
        for (let i = 0; i < this.tokens.length; i++) {
            if (
                this.tokens[i].start <= this.currentCursorPos &&
                this.tokens[i].end + 1 >= this.currentCursorPos
            ) {
                return i;
            }
        }

        return -1;
    }
}
