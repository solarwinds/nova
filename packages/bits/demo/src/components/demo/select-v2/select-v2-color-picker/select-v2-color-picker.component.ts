import { OverlayConfig } from "@angular/cdk/overlay";
import { Component } from "@angular/core";

const CHART_PALETTE_CS1: string[] = [
    "var(--nui-color-bg-secondary)",
    "var(--nui-color-chart-one)",
    "var(--nui-color-chart-two)",
    "var(--nui-color-chart-three)",
    "var(--nui-color-chart-four)",
    "var(--nui-color-chart-five)",
    "var(--nui-color-chart-six)",
    "var(--nui-color-chart-seven)",
    "var(--nui-color-chart-eight)",
    "var(--nui-color-chart-nine)",
    "var(--nui-color-chart-ten)",
];

// Left and right paddings of .color-picker-container element
const CONTAINER_SIDE_PADDINGS_PX: number = 20;
// Width of the .box element
const BOX_WIDTH_PX: number = 30;

@Component({
    selector: "nui-select-v2-color-picker",
    templateUrl: "./select-v2-color-picker.component.html",
    styleUrls: ["./select-v2-color-picker.component.less"],
})
export class SelectV2ColorPickerComponent {
    // With this param one is able to configure how many columns wide should the color picker be
    public cols: number = 6;

    public overlayConfig: OverlayConfig = {
        // To automatically calculate the max-width use the approach below if you want to optionally change the amount of color boxes per row,
        // but for most cases just hardcoding the necessary value will be enough
        maxWidth: this.cols
            ? (this.cols * BOX_WIDTH_PX) + CONTAINER_SIDE_PADDINGS_PX + "px"
            : "150px", // defaults to 4 columns picker
    };
    public backgroundColors: string[] = CHART_PALETTE_CS1;
    public defaultColor = "var(--nui-color-bg-secondary)";
}
