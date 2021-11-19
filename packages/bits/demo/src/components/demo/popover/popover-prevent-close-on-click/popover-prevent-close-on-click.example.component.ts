import { Component } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    selector: "nui-popover-prevent-close-on-click-example",
    templateUrl: "./popover-prevent-close-on-click.example.component.html",
})
export class PopoverPreventCloseOnClickExampleComponent {
    public dataset = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
    };
    public closePopoverSubject = new Subject();

    public closePopover(): void {
        this.closePopoverSubject.next();
    }
}
