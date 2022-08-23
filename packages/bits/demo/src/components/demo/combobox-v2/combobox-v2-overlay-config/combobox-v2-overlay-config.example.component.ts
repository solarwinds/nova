import { OverlayConfig } from "@angular/cdk/overlay";
import { Component } from "@angular/core";
import { FormControl } from "@angular/forms";

import { OVERLAY_WITH_POPUP_STYLES_CLASS } from "@nova-ui/bits";

@Component({
    selector: "nui-combobox-v2-overlay-config-example",
    templateUrl: "./combobox-v2-overlay-config.example.component.html",
    host: { class: "combobox-container" },
})
export class ComboboxV2OverlayConfigExampleComponent {
    public items = Array.from({ length: 100 }).map(
        (_, i) => $localize`Item ${i}`
    );

    public overlayConfig: OverlayConfig = {
        width: 300,
        height: 200,
        panelClass: [
            OVERLAY_WITH_POPUP_STYLES_CLASS,
            "overlay-config-demo-custom-class",
        ],
    };

    public comboboxControl = new FormControl();
}
