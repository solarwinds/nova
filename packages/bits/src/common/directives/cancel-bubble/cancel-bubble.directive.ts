import {
    Directive,
    EventEmitter,
    HostListener,
    Input,
    Output,
    Predicate,
} from "@angular/core";

export const isTargetAnAnchor = (event: Event): boolean =>
    event.target instanceof HTMLAnchorElement;

export type IEventFilter = Predicate<Event>;

export const makePredicate = (value: IEventFilter | boolean): IEventFilter =>
    typeof value === "boolean" ? () => value : value;

@Directive({
    selector: "[nuiCancelBubble]",
})
export class CancelBubbleDirective {
    private _eventFilter: IEventFilter = isTargetAnAnchor;

    @Input() public set eventFilter(value: IEventFilter | boolean | null) {
        this._eventFilter =
            value === null ? isTargetAnAnchor : makePredicate(value);
    }

    @Output() public passed$ = new EventEmitter<Event>();
    @Output() public canceled$ = new EventEmitter<Event>();

    @HostListener("click", ["$event"])
    public handleEvent(event: Event): void {
        if (this._eventFilter(event)) {
            event.stopPropagation();
            this.canceled$.emit(event);
            return;
        }
        this.passed$.emit(event);
    }
}
