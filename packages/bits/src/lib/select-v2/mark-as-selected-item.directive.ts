import { Highlightable } from "@angular/cdk/a11y";
import { ChangeDetectorRef, Directive, ElementRef, HostBinding } from "@angular/core";


@Directive({
    selector: "[nuiMarkAsSelectedItem]",
})
export class MarkAsSelectedItemDirective implements Highlightable {

    @HostBinding("class.active") private isActive: boolean = false;

    constructor(
        public elRef: ElementRef,
        private cdRef: ChangeDetectorRef
    ) { }

    public setActiveStyles(): void {
        this.isActive = true;
        this.cdRef.markForCheck();
    }

    public setInactiveStyles(): void {
        this.isActive = false;
        this.cdRef.markForCheck();
    }
}
