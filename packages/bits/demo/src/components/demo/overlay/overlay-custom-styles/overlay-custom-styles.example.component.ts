import { OverlayConfig } from "@angular/cdk/overlay";
import { Component, ViewEncapsulation } from "@angular/core";
import { OVERLAY_WITH_POPUP_STYLES_CLASS } from "@nova-ui/bits";


@Component({
    selector: "nui-overlay-custom-styles-example",
    templateUrl: "./overlay-custom-styles.example.component.html",
    styleUrls: ["./overlay-custom-styles.example.component.less"],
    // This is done to make class from the less file global.
    // Make sure the class from the less file is added to your global style sheet.
    encapsulation: ViewEncapsulation.None,
})
export class OverlayCustomStylesExampleComponent {

    public itemsSource: string[] = [
        $localize `Item 1`,
        $localize `Item 2`,
        $localize `Item 3`,
        $localize `Item 4`,
    ];

    public config: OverlayConfig = {
        panelClass: [OVERLAY_WITH_POPUP_STYLES_CLASS, "nui-overlay-styling-demo-custom-class"],
    };
}
