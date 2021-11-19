import { Component } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    selector: "nui-popover-modal-example",
    templateUrl: "./popover-modal.example.component.html",
})
export class PopoverModalExampleComponent {
    public closePopoverSubject: Subject<void> = new Subject<void>();

    public closePopover(): void {
        this.closePopoverSubject.next();
    }
}
