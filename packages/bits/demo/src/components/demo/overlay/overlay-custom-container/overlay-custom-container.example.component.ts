import { OverlayConfig } from "@angular/cdk/overlay";
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { OVERLAY_WITH_POPUP_STYLES_CLASS } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-overlay-custom-container-example",
    templateUrl: "./overlay-custom-container.example.component.html",
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayCustomContainerExampleComponent {

    public itemsSource: string[] = [
        $localize `Item 1`,
        $localize `Item 2`,
        $localize `Item 3`,
        $localize `Item 4`,
    ];

    public overlayConfig: OverlayConfig = {
        panelClass: OVERLAY_WITH_POPUP_STYLES_CLASS,
    };
}
