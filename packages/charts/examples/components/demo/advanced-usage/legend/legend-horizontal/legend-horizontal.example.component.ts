import { Component } from "@angular/core";
import { CHART_MARKERS, CHART_PALETTE_CS1, SequentialChartMarkerProvider, SequentialColorProvider } from "@solarwinds/nova-charts";

@Component({
    selector: "nui-legend-horizontal-example",
    templateUrl: "./legend-horizontal.example.component.html",
})
export class LegendHorizontalExampleComponent {
    public firstSeriesId = "1";
    public secondSeriesId = "2";

    public colors = new SequentialColorProvider(CHART_PALETTE_CS1);
    public markers = new SequentialChartMarkerProvider(CHART_MARKERS);
}
