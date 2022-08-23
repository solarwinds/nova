import { Component } from "@angular/core";

import {
    Chart,
    ChartAssist,
    ChartPalette,
    CHART_MARKERS,
    CHART_PALETTE_CS1,
    IChartMarker,
    IChartPalette,
    IValueProvider,
    LineAccessors,
    LineRenderer,
    SequentialChartMarkerProvider,
    XYGrid,
} from "@nova-ui/charts";

@Component({
    selector: "nui-legend-test",
    templateUrl: "./legend-test.component.html",
})
export class LegendTestExampleComponent {
    public palette: IChartPalette = new ChartPalette(CHART_PALETTE_CS1);
    public markers: IValueProvider<IChartMarker> =
        new SequentialChartMarkerProvider(CHART_MARKERS);
    public chart = new Chart(new XYGrid());
    public chartAssist: ChartAssist = new ChartAssist(this.chart);

    public seriesData = [
        {
            seriesId: "1",
            value: 15.5,
            unitLabel: "Kbps",
            descriptionPrimary: "Primary Description 1",
            descriptionSecondary: "Secondary Description 1",
            status: "critical",
        },
        {
            seriesId: "2",
            value: 20.8,
            unitLabel: "%",
            descriptionPrimary: "Primary Description 2",
            descriptionSecondary: "Secondary Description 2",
            status: "warning",
        },
    ];

    constructor() {
        const accessors = new LineAccessors();
        const renderer = new LineRenderer();
        this.chartAssist.update(
            this.seriesData.map((series) => ({
                id: series.seriesId,
                data: [series.value],
                accessors,
                renderer,
                scales: {},
            }))
        );
    }
}
