import { Component } from "@angular/core";
import { CHART_MARKERS, CHART_PALETTE_CS1, SequentialChartMarkerProvider, SequentialColorProvider } from "@nova-ui/charts";

@Component({
    selector: "nui-legend-text-color-example",
    templateUrl: "./legend-text-color.example.component.html",
})
export class LegendTextColorExampleComponent {
    public firstSeriesId = "1";
    public secondSeriesId = "2";

    public colors = new SequentialColorProvider(CHART_PALETTE_CS1);
    public markers = new SequentialChartMarkerProvider(CHART_MARKERS);
}
