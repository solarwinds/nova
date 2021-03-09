import {
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output
} from "@angular/core";

/** @ignore */
@Directive({
    selector: "[nuiPopupToggle]",
})
export class PopupToggleDirective {
    /** sets disable state and which prevents emitting toggle* */
    @Input() isDisabled: boolean;
    /** sets disable state and which prevents emitting toggle (for using it on textbox component)* */
    @Input() disabled: boolean;

    @Output() toggle = new EventEmitter();

    constructor(public host: ElementRef) {
    }

    @HostListener("click", ["$event"])
    public handleElementFocus(event: Event): void {
        if (!this.isDisabled && !this.disabled) {
            this.toggle.emit(event);
        }
    }
}
