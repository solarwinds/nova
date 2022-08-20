import { Component, OnInit } from "@angular/core";
import {
    BandScale,
    barAccessors,
    barGrid,
    BarHighlightStrategy,
    BarRenderer,
    barScales,
    Chart,
    CHART_PALETTE_CS1,
    IBarChartConfig,
    InteractionLinePlugin,
    MappedValueProvider,
} from "@nova-ui/charts";
import zipObject from "lodash/zipObject";

@Component({
    selector: "nui-waterfall-chart-simple-example",
    templateUrl: "./waterfall-chart-simple.example.component.html",
})
export class WaterfallChartSimpleComponent implements OnInit {
    // Step 1 - Create a new horizontal bar chart
    private chartConfig: IBarChartConfig = { horizontal: true };
    public chart = new Chart(barGrid(this.chartConfig));

    public ngOnInit(): void {
        const accessors = barAccessors(this.chartConfig);
        const scales = barScales(this.chartConfig);

        // Step 1 - Optionally, add interaction highlighting behavior.
        // If highlighting behavior is not desired, the renderer can be instantiated without a 'highlightStrategy' configuration
        // and the InteractionLinePlugin registration can be skipped.
        const renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("x"),
        });
        this.chart.addPlugin(new InteractionLinePlugin());

        // Step 2 - Create a color provider that maps the statuses (or types) of categories to their corresponding colors
        const colorProvider = new MappedValueProvider(
            zipObject(
                ["connect", "dns", "send", "ttfb", "cdownload"],
                CHART_PALETTE_CS1
            )
        );

        // Step 3 - Adjust the color accessor, to retrieve the color or the bar by the corresponding data type.
        accessors.data.color = (d) => colorProvider.get(d.type);

        // Step 4 - Configure the format of the bottom label by setting custom scales.x.formatter function.
        scales.x.formatters.tick = (value: number) =>
            `${parseFloat(Number(value / 1000).toFixed(1)).toLocaleString()}s`;

        // Step 5 - Configure the thickness of the bar using the BandScale.padding method on your scales.y.
        (<BandScale>scales.y).padding(0.5);

        this.chart.update(
            getData().map((s) => ({
                ...s,
                accessors,
                scales,
                renderer,
            }))
        );
    }
}

/** Chart Data */
function getData() {
    return [
        {
            id: "1",
            name: "Category 1",
            data: [
                {
                    type: "connect",
                    start: 0, // in ms
                    end: 22,
                },
                {
                    type: "dns",
                    start: 22,
                    end: 39,
                },
                {
                    type: "send",
                    start: 39,
                    end: 59,
                },
                {
                    type: "ttfb",
                    start: 59,
                    end: 109,
                },
                {
                    type: "cdownload",
                    start: 109,
                    end: 178,
                },
            ],
        },
        {
            id: "2",
            name: "Category 2",
            data: [
                {
                    type: "connect",
                    start: 0, // in ms
                    end: 22,
                },
                {
                    type: "dns",
                    start: 22,
                    end: 39,
                },
                {
                    type: "send",
                    start: 39,
                    end: 59,
                },
                {
                    type: "ttfb",
                    start: 59,
                    end: 109,
                },
                {
                    type: "cdownload",
                    start: 109,
                    end: 788,
                },
            ],
        },
        {
            id: "3",
            name: "Category 3",
            data: [
                {
                    type: "connect",
                    start: 178, // in ms
                    end: 222,
                },
                {
                    type: "dns",
                    start: 222,
                    end: 239,
                },
                {
                    type: "send",
                    start: 239,
                    end: 259,
                },
                {
                    type: "ttfb",
                    start: 259,
                    end: 309,
                },
                {
                    type: "cdownload",
                    start: 309,
                    end: 578,
                },
            ],
        },
        {
            id: "4",
            name: "Category 4",
            data: [
                {
                    type: "connect",
                    start: 578, // in ms
                    end: 590,
                },
                {
                    type: "dns",
                    start: 590,
                    end: 799,
                },
                {
                    type: "send",
                    start: 799,
                    end: 888,
                },
                {
                    type: "ttfb",
                    start: 888,
                    end: 900,
                },
                {
                    type: "cdownload",
                    start: 900,
                    end: 990,
                },
            ],
        },
    ];
}
