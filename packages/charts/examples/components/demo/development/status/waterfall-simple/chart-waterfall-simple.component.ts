import { AfterViewInit, Component } from "@angular/core";
import {
    BandScale, BarHighlightStrategy, BarHorizontalGridConfig, BarRenderer, Chart, ChartPalette, CHART_PALETTE_CS1, HorizontalBarAccessors, LinearScale,
    MappedValueProvider, XYGrid,
} from "@nova-ui/charts";

/**
 * This is here just to test a prototype of angular component, that will use new chart core
 *
 * @ignore
 */
@Component({
    selector: "nui-chart-waterfall-simple",
    templateUrl: "./chart-waterfall-simple.component.html",
})
export class ChartWaterfallSimpleComponent implements AfterViewInit {

    public palette = new ChartPalette(new MappedValueProvider<string>({
        "connect": CHART_PALETTE_CS1[0],
        "dns": CHART_PALETTE_CS1[1],
        "send": CHART_PALETTE_CS1[2],
        "ttfb": CHART_PALETTE_CS1[3],
        "cdownload": CHART_PALETTE_CS1[4],
    }));

    public gridChart = new Chart(new XYGrid(new BarHorizontalGridConfig()));

    public listItems = [
        {
            category: "Category 1",
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
        }, {
            category: "Category 2",
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
            category: "Category 3",
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
            category: "Category 4",
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
    private scales: { x: LinearScale, y: BandScale };

    public ngAfterViewInit() {
        const bandScale = new BandScale();
        bandScale.padding(0.5);
        const linearScale = new LinearScale();

        this.scales = {
            y: bandScale,
            x: linearScale,
        };
        this.scales.x.formatters.tick = (value: number) => `${Number(value / 1000).toFixed(1)}s`;
        const renderer = new BarRenderer({ highlightStrategy: new BarHighlightStrategy("x") });
        const accessors = new HorizontalBarAccessors();
        accessors.data.color = (d: any) => this.palette.standardColors.get(d.type);

        const categories: any[] = [];
        const seriesSet: any[] = [];

        this.listItems.forEach((item: any, i: number) => {
            categories.push(item.category);
            seriesSet.push(
                {
                    id: `series-${i}`,
                    name: `Series ${i}`,
                    data: item.data.map((d: any) =>
                        ({
                            value: d.end - d.start,
                            category: item.category,
                            type: d.type,
                            ["__bar"]: {
                                start: d.start,
                                end: d.end,
                            },
                        })),
                    accessors,
                    scales: this.scales,
                    renderer,
                });
        });
        bandScale.fixDomain(categories.reverse());
        this.gridChart.update(seriesSet);
    }
}
