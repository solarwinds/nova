import { Component } from "@angular/core";
import { CHART_MARKERS, CHART_PALETTE_CS1, SequentialChartMarkerProvider, SequentialColorProvider } from "@solarwinds/nova-charts";

@Component({
    selector: "nui-legend-rich-tile-content-projection-example",
    templateUrl: "legend-rich-tile-content-projection.example.component.html",
    styleUrls: ["legend-rich-tile-content-projection.example.component.less"],
})

export class LegendRichTileContentProjectionExampleComponent {
    public firstSeriesId = "1";
    public secondSeriesId = "2";

    public colors = new SequentialColorProvider(CHART_PALETTE_CS1);
    public markers = new SequentialChartMarkerProvider(CHART_MARKERS);
}
