import { Component } from "@angular/core";
import { Subject } from "rxjs";

@Component({
    selector: "nui-popover-visual-test",
    templateUrl: "./popover-visual-test.component.html",
    styleUrls: ["./popover-visual-test.component.less"],
})
export class PopoverVisualTestComponent {
    public dataset = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
    };
    public closePopoverSubject = new Subject();

    closePopover() {
        this.closePopoverSubject.next();
    }
}
