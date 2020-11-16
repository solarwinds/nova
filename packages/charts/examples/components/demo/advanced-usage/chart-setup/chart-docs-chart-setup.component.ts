import { Component } from "@angular/core";

@Component({
    selector: "nui-chart-docs-chart-setup",
    templateUrl: "./chart-docs-chart-setup.component.html",
})
export class ChartDocsChartSetupComponent {
    public basicChartTemplate = `<nui-chart [chart]="chart"></nui-chart>`;
    public basicSeries = `const chartSeries: IChartSeries = {
    id: "series-1",
    name: "Series 1",
    data: [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
    ],
    scales: {
        x: new LinearScale(),
        y: new LinearScale(),
    },
    renderer: new LineRenderer(),
};
...`;
    public basicData = `const chartSeries: IChartSeries = {
    id: "series-1",
    name: "Series 1",
    data: [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
    ],
    ...
};`;
    public basicScales = `const chartSeries: IChartSeries = {
    ...
    scales: {
        x: new LinearScale(),
        y: new LinearScale(),
    },
    ...
};`;
    public renderer = `const chartSeries: IChartSeries = {
    ...
    renderer: new LineRenderer(),
    ...
};`;
    public chartSetup = `const chart = new Chart(new XYGrid());
...`;
    public chartUpdate = `const seriesSet: IChartSeries[] = [...];
chart.update(seriesSet);
...`;
}
