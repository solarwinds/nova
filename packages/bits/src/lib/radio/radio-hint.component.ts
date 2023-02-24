import { Component, HostListener } from "@angular/core";

@Component({
    selector: "nui-radio-hint",
    template: `<ng-content></ng-content>`,
})
export class RadioHintComponent {
    constructor() {}

    @HostListener("click", ["$event"])
    public onContainerClick(event: MouseEvent): void {
        if (event.target instanceof HTMLAnchorElement) {
            event.stopPropagation();
        }
    }
}
