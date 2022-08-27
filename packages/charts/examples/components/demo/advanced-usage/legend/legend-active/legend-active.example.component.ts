import { Component } from "@angular/core";

import {
    CHART_MARKERS,
    CHART_PALETTE_CS1,
    SequentialChartMarkerProvider,
    SequentialColorProvider,
} from "@nova-ui/charts";

@Component({
    selector: "nui-legend-active-example",
    templateUrl: "./legend-active.example.component.html",
})
export class LegendActiveExampleComponent {
    public firstSeriesId = "1";
    public secondSeriesId = "2";

    public colors = new SequentialColorProvider(CHART_PALETTE_CS1);
    public markers = new SequentialChartMarkerProvider(CHART_MARKERS);
}
