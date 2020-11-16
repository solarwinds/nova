import { Component, OnInit } from "@angular/core";
import {
    Chart, CHART_PALETTE_CS2, IChartSeries, ILineAccessors, LineAccessors, LinearScale, LineRenderer, SequentialColorProvider, XYGrid
} from "@solarwinds/nova-charts";

@Component({
    selector: "nui-colors-custom-provider-example",
    templateUrl: "./colors-custom-provider.example.component.html",
})
export class RendererColorsCustomProviderExampleComponent implements OnInit {
    public chart = new Chart(new XYGrid());

    public ngOnInit() {
        const scales = {
            x: new LinearScale(),
            y: new LinearScale(),
        };
        const renderer = new LineRenderer();
        // Defining custom color palette
        const customColors = [CHART_PALETTE_CS2[2], CHART_PALETTE_CS2[4], CHART_PALETTE_CS2[0]];
        // Setting color accessor to use new SequentialColorProvider with custom colors
        const accessors = new LineAccessors(new SequentialColorProvider(customColors));

        const seriesSet: IChartSeries<ILineAccessors>[] = getData().map(d => ({
            ...d,
            scales,
            renderer,
            accessors,
        }));

        this.chart.update(seriesSet);
    }
}

/* Chart data */
function getData() {
    return [
        {
            id: "series-1",
            name: "Series 1",
            data: [
                { x: 1, y: 30 },
                { x: 2, y: 50 },
                { x: 3, y: 25 },
                { x: 4, y: 40 },
                { x: 5, y: 35 },
            ],
        },
        {
            id: "series-2",
            name: "Series 2",
            data: [
                { x: 1, y: 20 },
                { x: 2, y: 40 },
                { x: 3, y: 15 },
                { x: 4, y: 30 },
                { x: 5, y: 25 },
            ],
        },
        {
            id: "series-3",
            name: "Series 3",
            data: [
                { x: 1, y: 10 },
                { x: 2, y: 30 },
                { x: 3, y: 5 },
                { x: 4, y: 20 },
                { x: 5, y: 15 },
            ],
        },
    ];
}
