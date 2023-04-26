import { ChangeDetectorRef, Component, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { HelpEntry, ToastService, Tokenizer } from "@nova-ui/bits";

import { ExampleHelp } from "./example-help";
import { ExampleTokenizer } from "./example-tokenizer";
import { ExampleAppToken, ExampleAppTokenType } from "./models";
import { ExampleAppRenderer } from "./renderer";

@Component({
    selector: "nui-freetype-query-builder-basic-example",
    templateUrl: "freetype-query-builder-basic.example.component.html",
})
export class FreetypeQueryBuilderBasicExampleComponent {
    readonly: boolean = false;
    readonly SEPARATOR = " ";
    placeholder: string = "Click to start building query";
    value: string = "";
    valueChange = new EventEmitter<string>();
    tokens: ExampleAppToken[] = [];
    cursorSetter$$ = new BehaviorSubject<number>(-1);
    currentCursorPos = this.cursorSetter$$.value;

    renderer = new ExampleAppRenderer();
    currentHelp: HelpEntry[] = [];
    tokenizer: Tokenizer<ExampleAppToken> = new ExampleTokenizer();
    helpUpdater: ExampleHelp = new ExampleHelp();

    constructor(
        private cd: ChangeDetectorRef,
        private toastService: ToastService
    ) {}

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

    onSubmit(): void {
        this.toastService.success({
            message: "Query was successfully submitted.",
        });
    }

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
        if (idx === -1) {
            this.value = this.value + $event.value + this.SEPARATOR;
            this.cursorSetter$$.next(this.value.length);
        } else {
            const nextCurPos = this.tokens[idx].start + $event.value.length;
            this.value =
                this.value.substring(0, this.tokens[idx].start) +
                $event.value +
                this.value.substring(this.tokens[idx].end + 1);
            this.cursorSetter$$.next(nextCurPos);
        }
        this.onCursorPosChange(this.value.length + 1);

        this.checkValidity();
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
                this.tokens[i].end >= this.currentCursorPos
            ) {
                return i;
            }
        }
        return -1;
    }

    checkValidity(): void {
        const tokenTypes = this.tokens.map((token) => token.type);

        switch (tokenTypes.toString()) {
            case [ExampleAppTokenType.SELECT_KEYWORD].toString():
                {
                    const idx = this.tokens.findIndex(
                        (token: ExampleAppToken) =>
                            token.type === ExampleAppTokenType.SELECT_KEYWORD
                    );
                    this.tokens[idx].issue = "error";
                    this.tokens[idx].issueMessage =
                        "You need to specify fields to select";
                }
                break;
            case [
                ExampleAppTokenType.SELECT_KEYWORD,
                ExampleAppTokenType.STRING,
                ExampleAppTokenType.FROM_KEYWORD,
            ].toString():
                {
                    const idx = this.tokens.findIndex(
                        (token: ExampleAppToken) =>
                            token.type === ExampleAppTokenType.FROM_KEYWORD
                    );
                    this.tokens[idx].issue = "error";
                    this.tokens[idx].issueMessage =
                        "You need to specify table to select from";
                }
                break;
        }
    }
}
