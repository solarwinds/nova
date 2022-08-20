import { Component, ViewEncapsulation } from "@angular/core";

/**
 * Internal component that wraps the overlay's content to render an arrow
 */

/** @ignore */
@Component({
    selector: "nui-overlay-arrow",
    template: `<div class="nui-overlay-arrow"></div>`,
    styleUrls: ["./overlay-arrow.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class OverlayArrowComponent {}
