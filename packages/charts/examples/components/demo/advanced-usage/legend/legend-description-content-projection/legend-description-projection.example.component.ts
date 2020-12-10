import { Component } from "@angular/core";
import { CHART_MARKERS, CHART_PALETTE_CS1, SequentialChartMarkerProvider, SequentialColorProvider } from "@nova-ui/charts";

@Component({
    selector: "nui-legend-description-projection-example",
    templateUrl: "legend-description-projection.example.component.html",
})

export class LegendDescriptionProjectionExampleComponent {
    public firstSeriesId = "1";
    public secondSeriesId = "2";

    public colors = new SequentialColorProvider(CHART_PALETTE_CS1);
    public markers = new SequentialChartMarkerProvider(CHART_MARKERS);

    public active: boolean = false;

    public toggleActive() {
        this.active = !this.active;
    }
}
