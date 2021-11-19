import { OverlayConfig } from "@angular/cdk/overlay";
import { Component } from "@angular/core";
import { OVERLAY_WITH_POPUP_STYLES_CLASS } from "@nova-ui/bits";
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
    // Testing only
    public overlayConfig: OverlayConfig = {
        panelClass: [OVERLAY_WITH_POPUP_STYLES_CLASS, "combobox-v2-test-pane"],
    };
    closePopover(): void {
        this.closePopoverSubject.next();
    }
}
