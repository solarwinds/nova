import { OverlayConfig } from "@angular/cdk/overlay";
import { Component, ViewEncapsulation } from "@angular/core";
import { OVERLAY_WITH_POPUP_STYLES_CLASS } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-select-v2-styling-example",
    templateUrl: "./select-v2-styling.example.component.html",
    styleUrls: ["./select-v2-styling.example.component.less"],
    host: { class: "select-container" },
    // This is done to make class from the less file global.
    // Make sure the class from the less file is added to your global style sheet.
    encapsulation: ViewEncapsulation.None,
})
export class SelectV2StylingExampleComponent {
    public items = Array.from({ length: 100 }).map((_, i) => ($localize`Item ${i}`));

    public config: OverlayConfig = {
        panelClass: [OVERLAY_WITH_POPUP_STYLES_CLASS, "nui-overlay-styling-demo-custom-class"],
    };
}
