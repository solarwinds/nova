import { Component, OnInit } from "@angular/core";
import { Chart, ChartAssist, LineAccessors, LineRenderer, XYGrid } from "@solarwinds/nova-charts";

@Component({
    selector: "nui-legend-interactive-example",
    templateUrl: "./legend-interactive.example.component.html",
})
export class LegendInteractiveExampleComponent implements OnInit {

    // Set up the chart assist to keep track of the series selection and emphasis states
    public chartAssist: ChartAssist = new ChartAssist(new Chart(new XYGrid()));

    public firstSeriesId = "1";
    public secondSeriesId = "2";

    public ngOnInit() {
        const accessors = new LineAccessors();
        const renderer = new LineRenderer();
        this.chartAssist.update([
            {
                id: this.firstSeriesId,
                data: [],
                accessors,
                renderer,
                scales: {},
            },
            {
                id: this.secondSeriesId,
                data: [],
                accessors,
                renderer,
                scales: {},
            },
        ]);
    }
}
