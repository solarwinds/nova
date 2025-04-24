import {
    Directive,
    EventEmitter,
    HostListener,
    Input,
    Output,
} from "@angular/core";

import { IEventFilter, isTargetNotAnAnchor, makePredicate } from "./public-api";

@Directive({
    selector: "[nuiClickFilter]",
    standalone: false,
})
export class ClickFilterDirective {
    private _cancelBubble: IEventFilter = makePredicate(true);
    private _preventDefault: IEventFilter = isTargetNotAnAnchor;

    @Input() public set cancelBubble(value: IEventFilter | boolean | null) {
        this._cancelBubble = makePredicate(value ?? true);
    }

    @Input() public set preventDefault(value: IEventFilter | boolean | null) {
        this._preventDefault = makePredicate(value ?? isTargetNotAnAnchor);
    }

    @Output() public passed$ = new EventEmitter<Event>();
    @Output() public canceled$ = new EventEmitter<Event>();
    @Output() public prevented$ = new EventEmitter<Event>();

    @HostListener("click", ["$event"])
    public handleEvent(event: Event): void {
        let passed = true;
        if (this._cancelBubble(event)) {
            event.stopPropagation();
            event.stopImmediatePropagation();
            this.canceled$.emit(event);
            passed = false;
        }
        if (this._preventDefault(event)) {
            event.preventDefault();
            this.prevented$.emit(event);
            passed = false;
        }
        if (passed) {
            this.passed$.emit(event);
        }
    }
}
