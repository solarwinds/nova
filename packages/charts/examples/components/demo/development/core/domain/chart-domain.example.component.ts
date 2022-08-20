import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
    QueryList,
    ViewChildren,
} from "@angular/core";
import {
    Chart,
    ChartAssist,
    ChartComponent,
    getAutomaticDomainWithIncludedInterval,
    IAccessors,
    IChart,
    IChartAssistSeries,
    IDataSeries,
    IScale,
    LineAccessors,
    LinearScale,
    LineRenderer,
    Scales,
    TimeScale,
    XYGrid,
} from "@nova-ui/charts";

import { DataGenerator } from "../../../../../data-generator";

/**
 * This is here just to test a prototype of angular component, that will use new chart core
 *
 * @ignore
 */
@Component({
    selector: "nui-chart-domain-example",
    templateUrl: "./chart-domain.example.component.html",
})
export class ChartDomainExampleComponent implements OnInit, AfterViewInit {
    @ViewChildren(ChartComponent) chartComponents: QueryList<ChartComponent>;

    public dataRenderer: LineRenderer;
    public xScale: IScale<Date> = new TimeScale();
    public scales: Scales[] = [];

    public charts: IChart[] = [];

    public chartAssists: ChartAssist[] = [];

    constructor(private changeDetector: ChangeDetectorRef) {}

    ngOnInit() {
        const numCharts = 3;
        for (let i = 0; i < numCharts; ++i) {
            this.scales.push({
                x: this.xScale,
                y: new LinearScale(),
            });
            this.charts.push(new Chart(new XYGrid()));
        }

        // this.scales[0].y.domainCalculation = getAutomaticDomain; // Default
        this.scales[1].y.domainCalculator =
            getAutomaticDomainWithIncludedInterval([-40, 160]);
        this.scales[2].y.domainCalculator =
            getAutomaticDomainWithIncludedInterval([0, 0]);

        this.dataRenderer = new LineRenderer();
    }

    ngAfterViewInit() {
        const timeLineSeriesSet: any[] =
            DataGenerator.generateMockTimeLineSeriesSet(2, 40);

        this.chartComponents.forEach((chart: ChartComponent, index: number) => {
            this.chartAssists.push(new ChartAssist(this.charts[index]));
            this.chartAssists[index].update(
                this.generateChartAssistSeriesSet(timeLineSeriesSet, index)
            );
        });
        this.changeDetector.detectChanges();
    }

    private generateChartAssistSeriesSet(
        dataSeriesSet: IDataSeries<IAccessors>[],
        chartIndex: number
    ): IChartAssistSeries<IAccessors>[] {
        const accessors = new LineAccessors();
        return dataSeriesSet.map((dataSeries) => ({
            ...dataSeries,
            scales: this.scales[chartIndex],
            renderer: this.dataRenderer,
            accessors,
            showInLegend: true,
        }));
    }

    public fixDomain() {
        const startDatetime = new Date("2017-02-15T16:00:00Z");
        const endDatetime = new Date("2017-02-15T16:14:29.909Z");

        this.xScale.fixDomain([startDatetime, endDatetime]);
        this.chartAssists.forEach((chartAssist) => {
            chartAssist.update(chartAssist.inputSeriesSet);
        });
    }

    public resetDomain() {
        this.xScale.isDomainFixed = false;
        this.chartAssists.forEach((chartAssist) => {
            chartAssist.update(chartAssist.inputSeriesSet);
        });
    }

    public refresh() {
        const seriesSet: any[] = DataGenerator.generateMockTimeLineSeriesSet(
            Math.floor(Math.random() * 6),
            40
        );
        this.chartAssists.forEach(
            (chartAssist: ChartAssist, chartIndex: number) => {
                chartAssist.update(
                    this.generateChartAssistSeriesSet(seriesSet, chartIndex)
                );
            }
        );
    }
}
