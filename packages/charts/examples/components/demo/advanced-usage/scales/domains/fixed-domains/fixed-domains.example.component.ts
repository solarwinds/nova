import { Component, OnInit } from "@angular/core";
import {
    Chart, IChartSeries, ILineAccessors, IScale, LineAccessors, LinearScale, LineRenderer, Scales, TimeScale, XYGrid, XYGridConfig,
} from "@nova-ui/charts";
import moment from "moment/moment";

@Component({
    selector: "nui-chart-fixed-domains-example",
    templateUrl: "./fixed-domains.example.component.html",
})
export class FixedDomainsExampleComponent implements OnInit {
    public xScale: IScale<Date> = new TimeScale();
    public yScale: IScale<number> = new LinearScale();

    public chart: Chart;
    private seriesSet: IChartSeries<ILineAccessors>[];
    private format = "YYYY-MM-DDTHH:mm:ssZ";

    ngOnInit() {
        const scales: Scales = {
            x: this.xScale,
            y: this.yScale,
        };

        // Default domain calculator
        // scales.y.domainCalculator = getAutomaticDomain;

        const gridConfig = new XYGridConfig();
        gridConfig.axis.bottom.fit = true;
        this.chart = new Chart(new XYGrid(gridConfig));

        this.seriesSet = getData(this.format).map(d => ({
            ...d,
            scales,
            accessors: new LineAccessors(),
            renderer: new LineRenderer(),
        }));

        this.chart.update(this.seriesSet);
        this.chart.updateDimensions();
    }

    public fixXDomain() {
        const startDatetime = moment("2016-12-29T06:00:00.000Z", this.format).toDate();
        const endDatetime = moment("2017-01-04T06:00:00.000Z", this.format).toDate();

        this.xScale.fixDomain([startDatetime, endDatetime]);
        this.chart.update(this.seriesSet);
    }

    public fixYDomain() {
        this.yScale.fixDomain([0, 100]);
        this.chart.update(this.seriesSet);
    }

    public resetDomains() {
        this.xScale.isDomainFixed = false;
        this.yScale.isDomainFixed = false;
        this.chart.update(this.seriesSet);
    }
}

/* Chart data */
function getData(format: string) {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: moment("2016-12-25T15:14:29.909Z", format), y: 30 },
                { x: moment("2016-12-27T15:14:29.909Z", format), y: 95 },
                { x: moment("2016-12-29T15:14:29.909Z", format), y: 45 },
                { x: moment("2016-12-31T15:14:29.909Z", format), y: 60 },
                { x: moment("2017-01-03T15:14:29.909Z", format), y: 35 },
            ],
        },
    ];
}
