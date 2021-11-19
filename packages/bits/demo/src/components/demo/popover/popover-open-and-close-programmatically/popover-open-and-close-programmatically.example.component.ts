import { Component } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    selector: "nui-popover-open-and-close-programmatically-example",
    templateUrl: "./popover-open-and-close-programmatically.example.component.html",
})
export class PopoverOpenAndCloseProgrammaticallyExampleComponent {
    public closePopoverSubject = new Subject();
    public openPopoverSubject = new Subject();

    public closePopover(): void {
        this.closePopoverSubject.next();
    }

    public openPopover(): void {
        this.openPopoverSubject.next();
    }
}
