import { Component } from "@angular/core";

@Component({
    selector: "nui-preview-overlay",
    template: `<div class="nui-text-label content" i18n>
        This is a non-interactive widget preview
    </div>`,
    styleUrls: ["./preview-overlay.component.less"],
})
export class PreviewOverlayComponent {
    static lateLoadKey = "PreviewOverlayComponent";
}
