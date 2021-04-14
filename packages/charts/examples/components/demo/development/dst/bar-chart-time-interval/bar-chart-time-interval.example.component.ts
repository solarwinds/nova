import { Component, Input, OnInit } from "@angular/core";
import {
    barAccessors,
    barGrid,
    BarRenderer,
    Chart,
    IAccessors,
    IChartSeries,
    IDataSeries,
    LinearScale,
    Scales,
    TimeIntervalScale,
} from "@nova-ui/charts";
import { duration } from "moment/moment";

@Component({
    selector: "nui-bar-chart-time-interval-example",
    templateUrl: "./bar-chart-time-interval.example.component.html",
})
export class BarChartTimeIntervalExampleComponent implements OnInit {
    @Input() data: Partial<IDataSeries<IAccessors>>[];

    public chart = new Chart(barGrid());

    ngOnInit() {
        const accessors = barAccessors();
        accessors.data.category = (d) => d.x;
        accessors.data.value = (d) => d.y;

        const renderer = new BarRenderer();

        const scales: Scales = {
            x: new TimeIntervalScale(duration(1, "days")),
            y: new LinearScale(),
        };

        this.chart.update(this.data.map((s: Partial<IDataSeries<IAccessors>>) => ({
            ...s,
            accessors,
            renderer,
            scales,
        })) as IChartSeries<IAccessors>[]);
    }
}
