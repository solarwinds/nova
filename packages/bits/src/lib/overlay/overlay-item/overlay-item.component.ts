import { Highlightable } from "@angular/cdk/a11y";
import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, HostBinding, Input } from "@angular/core";

import { OVERLAY_ITEM } from "../constants";
import { IOption } from "../types";

/**
 * @ignore
 */
@Component({
    selector: "nui-overlay-item",
    template: `<ng-content></ng-content>`,
    styleUrls: ["./overlay-item.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: OVERLAY_ITEM, useExisting: forwardRef(() => OverlayItemComponent) },
    ],
})
export class OverlayItemComponent implements Highlightable, IOption {

    /** Whether the Item is active */
    @HostBinding("class.active")
    public active: boolean = false;

    /** Whether the Item is disabled */
    @Input()
    @HostBinding("class.disabled")
    public isDisabled: boolean = false;

    constructor(public element: ElementRef<HTMLElement>) {}

    /** Applies active class */
    public setActiveStyles(): void {
        this.active = true;
    }

    /** Removes active class */
    public setInactiveStyles(): void {
        this.active = false;
    }

    /** Scrolls to the Item inside scrollable container  */
    public scrollIntoView(options?: ScrollIntoViewOptions) {
        this.element.nativeElement.scrollIntoView(options || true);
    }
}
