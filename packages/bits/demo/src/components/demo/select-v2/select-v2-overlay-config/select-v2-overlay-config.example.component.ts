import { OverlayConfig } from "@angular/cdk/overlay";
import { Component } from "@angular/core";
import { OVERLAY_WITH_POPUP_STYLES_CLASS } from "@nova-ui/bits";

@Component({
    selector: "nui-select-v2-overlay-config-example",
    templateUrl: "./select-v2-overlay-config.example.component.html",
    host: { class: "select-container" },
})
export class SelectV2OverlayConfigExampleComponent {
    public overlayConfig: OverlayConfig = {
        width: 300,
        height: 200,
        panelClass: [OVERLAY_WITH_POPUP_STYLES_CLASS, "overlay-config-demo-custom-class"],
    };

    public items = Array.from({ length: 100 }).map((_, i) => $localize `Item ${i}`);
}
