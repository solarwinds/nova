import { OverlayConfig } from "@angular/cdk/overlay";
import { Component, ViewEncapsulation } from "@angular/core";
import { OVERLAY_WITH_POPUP_STYLES_CLASS } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-v2-styling-example",
    templateUrl: "combobox-v2-styling.example.component.html",
    styleUrls: ["combobox-v2-styling.example.component.less"],
    // This is done to make class from the less file global.
    // Make sure the class from the less file is added to your global style sheet.
    encapsulation: ViewEncapsulation.None,
})
export class ComboboxV2StylingExampleComponent {
    public items = Array.from({ length: 100 }).map(
        (_, i) => $localize`Item ${i}`
    );

    public config: OverlayConfig = {
        panelClass: [
            OVERLAY_WITH_POPUP_STYLES_CLASS,
            "nui-overlay-styling-demo-custom-class",
        ],
    };
}
