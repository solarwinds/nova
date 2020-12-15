import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
    Chart, IChartEvent, IChartSeries, ILineAccessors, INTERACTION_VALUES_EVENT, IXYScales, LineAccessors, LinearScale, LineRenderer, TimeScale, XYGrid
} from "@nova-ui/charts";
import moment from "moment/moment";

@Component({
    selector: "nui-chart-events-basic",
    templateUrl: "./events-basic-example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsBasicExampleComponent implements OnInit {
    public chart = new Chart(new XYGrid());
    public payload: string;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    }

    public ngOnInit() {
        const accessors = new LineAccessors();
        const renderer = new LineRenderer();

        const scales: IXYScales = {
            x: new TimeScale(),
            y: new LinearScale(),
        };

        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(d => ({
            ...d,
            accessors,
            renderer,
            scales,
        }));

        // - subscribe to a chosen chart event
        // - unsubscribing is not necessary as the chart will be destroyed when the component used to place it on the page will be destroyed;
        //   the subscription will be unsubscribed automatically
        this.chart.getEventBus().getStream(INTERACTION_VALUES_EVENT).subscribe((event: IChartEvent) => {
            // process the event
            this.payload = JSON.stringify(event.data, null, 4);
            // in case of using a OnPush change detection strategy you need to detectChanges manually as the event is internal to this component and
            // wouldn't cause the UI to update
            this.changeDetectorRef.detectChanges();
        });

        this.chart.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    const format = "YYYY-MM-DDTHH:mm:ssZ";

    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 30 },
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 95 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 15 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 60 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 35 },
            ],
        },
        {
            id: "series-2",
            name: "Series 2",
            data: [
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 60 },
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 40 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 70 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 45 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 90 },
            ],
        },
    ];
}
