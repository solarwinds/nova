import { Directive, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import escape from "lodash/escape";
import isNil from "lodash/isNil";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { HighlightPipe } from "../../../pipes/highlight.pipe";
import { ComboboxV2Component } from "../combobox-v2/combobox-v2.component";
import { NUI_SELECT_V2_OPTION_PARENT_COMPONENT } from "../constants";
import { InputValueTypes } from "../types";

/**
 * @ignore
 */
@Directive({
    selector: "[nuiComboboxV2OptionHighlight]",
    providers: [HighlightPipe],
})
export class ComboboxV2OptionHighlightDirective implements OnChanges, OnInit, OnDestroy {

    /** Part of the text to be highlighted */
    // tslint:disable-next-line:no-input-rename
    @Input("nuiComboboxV2OptionHighlight") public value: string;

    private destroy$ = new Subject();

    constructor(private el: ElementRef<HTMLElement>,
                @Inject(NUI_SELECT_V2_OPTION_PARENT_COMPONENT) private combobox: ComboboxV2Component,
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
        const isHighlightNecessary = highlighted && this.combobox.getLastSelectedOption()?.viewValue !== highlighted;

        this.el.nativeElement.innerHTML = (isHighlightNecessary && !isNil(highlighted)
            ? this.highlightPipe.transform(this.value, highlighted.toString())
            : escape(this.value)) as string;
    }
}
