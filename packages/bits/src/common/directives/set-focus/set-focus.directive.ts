import { DOCUMENT } from "@angular/common";
import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";

/**
 * <example-url>./../examples/index.html#/common/set-focus</example-url>
 *
 * Allows focus to be databound. Note: a "tabindex" property may be required.
 *
 * Under the hood directive calls element.focus() and element.blur() on data bound changes.
 * If host element is not a focusable HTML element (neither \<input\> nor \<textarea\>, e.g. \<nui-textbox\>),
 * directive tries to find an appropriate focusable one among children.
 *
 * @dynamic
 * @ignore
 */
@Directive({ selector: "[nuiSetFocus]" })
export class SetFocusDirective implements AfterViewInit, OnChanges {
    private static readonly focusablesToCapture: string[] = [
        "input",
        "textarea",
    ];
    /**
     * This property controls whether element is focused (true) or not (false).
     */
    @Input() public nuiSetFocus: boolean;

    @Input() public preventScroll: boolean = false;
    /**
     * Event fired on extarnal focus changes (initiated from UI by user).
     * Passed value indicates whether element gets focus (true) of lose it (false).
     * Use it when you need to synchronize inner state of directive's 'nuiSetFocus' property and bound input property.
     */
    @Output() public focusChange = new EventEmitter<boolean>();

    private focusableElement: HTMLElement;

    constructor(
        private el: ElementRef,
        @Inject(DOCUMENT) private document: Document
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (!this.focusableElement || !changes["nuiSetFocus"]) {
            return;
        }
        if (changes["nuiSetFocus"].currentValue) {
            this.focusableElement.focus({ preventScroll: this.preventScroll });
        } else {
            this.focusableElement.blur();
        }
    }

    public ngAfterViewInit() {
        this.focusableElement = this.getFirstFocusable(this.el.nativeElement);
        this.focusableElement.addEventListener("focus", this.onFocus);
        this.focusableElement.addEventListener("blur", this.onBlur);
        if (this.nuiSetFocus) {
            this.focusableElement.focus({ preventScroll: this.preventScroll });
        }
    }

    private onBlur = () => {
        if (this.document.activeElement !== this.focusableElement) {
            if (this.nuiSetFocus) {
                this.nuiSetFocus = false;
                this.focusChange.emit(false);
            }
        }
    };

    private onFocus = () => {
        if (this.document.activeElement === this.focusableElement) {
            if (!this.nuiSetFocus) {
                this.nuiSetFocus = true;
                this.focusChange.emit(true);
            }
        }
    };

    private getFirstFocusable(element: HTMLElement): HTMLElement {
        const tagName = element["tagName"].toLowerCase();
        let result: HTMLElement;
        if (SetFocusDirective.focusablesToCapture.indexOf(tagName) !== -1) {
            result = element;
        } else {
            const children = element.querySelectorAll(
                SetFocusDirective.focusablesToCapture.join()
            );
            result = children.length ? <HTMLElement>children[0] : element;
        }
        return result;
    }
}
