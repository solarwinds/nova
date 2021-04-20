import { Component, Input, OnInit } from "@angular/core";
import {
    barAccessors,
    barGrid,
    BarHighlightStrategy,
    BarRenderer,
    Chart,
    IAccessors,
    IChartSeries,
    IDataSeries,
    InteractionLabelPlugin,
    LinearScale,
    Scales,
    TimeIntervalScale,
} from "@nova-ui/charts";
import moment from "moment/moment";

@Component({
    selector: "bar-chart-time-interval-dst-test",
    templateUrl: "./bar-chart-time-interval-dst-test.component.html",
})
export class BarChartTimeIntervalDstTestComponent implements OnInit {
    @Input() data: Partial<IDataSeries<IAccessors>>[];
    @Input() interval: moment.Duration;

    public chart = new Chart(barGrid());

    ngOnInit() {
        const accessors = barAccessors();
        accessors.data.category = (d) => d.x;
        accessors.data.value = (d) => d.y;

        const renderer = new BarRenderer({ highlightStrategy: new BarHighlightStrategy("x"), pointerEvents: false });

        const scales: Scales = {
            x: new TimeIntervalScale(this.interval),
            y: new LinearScale(),
        };

        this.chart.addPlugin(new InteractionLabelPlugin());
        this.chart.update(this.data.map((s: Partial<IDataSeries<IAccessors>>) => ({
            ...s,
            accessors,
            renderer,
            scales,
        })) as IChartSeries<IAccessors>[]);
    }
}
