// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import {
    ConnectionPositionPair,
    Overlay,
    OverlayPositionBuilder,
    OverlayRef,
    PositionStrategy,
    ScrollStrategyOptions,
} from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";

import {
    BandScale,
    BarHighlightStrategy,
    BarRenderer,
    BarStatusGridConfig,
    Chart,
    ChartPalette,
    CHART_PALETTE_CS1,
    HorizontalBarAccessors,
    ISetDomainEventPayload,
    LinearScale,
    MappedValueProvider,
    NoopAccessors,
    NoopRenderer,
    SET_DOMAIN_EVENT,
    XYGrid,
    XYGridConfig,
    ZoomPlugin,
} from "@nova-ui/charts";

/**
 * This is here just to test a prototype of angular component, that will use new chart core
 *
 * @ignore
 */
@Component({
    selector: "nui-waterfall-chart-advanced-example",
    templateUrl: "./waterfall-chart-advanced.example.component.html",
    styleUrls: ["./waterfall-chart-advanced.example.component.less"],
})
export class WaterfallChartAdvancedComponent implements AfterViewInit, OnInit {
    // Declaring chart config for charts in series
    private seriesChartConfig = new BarStatusGridConfig({
        showBottomAxis: false,
    });

    // Icon and row sizes are used to properly place cdk overlay with grid over the chart
    public iconSize: number = 20;
    public rowSize: number = 200;

    public palette = new ChartPalette(
        new MappedValueProvider<string>({
            connect: CHART_PALETTE_CS1[0],
            dns: CHART_PALETTE_CS1[1],
            send: CHART_PALETTE_CS1[2],
            ttfb: CHART_PALETTE_CS1[3],
            cdownload: CHART_PALETTE_CS1[4],
        })
    );

    public gridChart = new Chart(new XYGrid());

    // We need both to properly handle portal and positioning for the cdk overlay
    public positionStrategy: PositionStrategy;
    public templatePortal: TemplatePortal<any>;
    public listItems = getData(this.seriesChartConfig);

    private scales: { x: LinearScale; y: BandScale };
    private overlayRef: OverlayRef;

    @ViewChild("templatePortalGrid") templatePortalGrid: TemplateRef<any>;
    @ViewChild("gridChartPlaceholder") gridChartPlaceholder: ElementRef;

    // This listener updates the grid position to follow the chart if client size changes on user interaction with the page.
    // In case client size changes dynamically another solution is needed.
    @HostListener("document:click")
    public updateGridPosition(): void {
        this.overlayRef.updatePosition();
    }

    constructor(
        private overlay: Overlay,
        private overlayPositionBuilder: OverlayPositionBuilder,
        private _viewContainerRef: ViewContainerRef,
        private scrollStrategyOptions: ScrollStrategyOptions
    ) {}

    public ngOnInit(): void {
        this.gridChart.addPlugin(new ZoomPlugin());

        this.gridChart
            .getEventBus()
            .getStream(SET_DOMAIN_EVENT)
            .subscribe((event) => {
                const payload = <ISetDomainEventPayload>event.data;
                this.listItems.forEach((item) => {
                    this.scales.x.fixDomain(payload[this.scales.x.id]);
                    item.chart.updateDimensions();
                });
            });
    }

    public ngAfterViewInit(): void {
        // Here you configure the template portal and overlay

        this.templatePortal = new TemplatePortal(
            this.templatePortalGrid,
            this._viewContainerRef
        );
        const positions: ConnectionPositionPair[] = [
            {
                originX: "start",
                originY: "top",
                overlayX: "start",
                overlayY: "top",
            },
            {
                originX: "start",
                originY: "top",
                overlayX: "start",
                overlayY: "top",
            },
        ];

        this.positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.gridChartPlaceholder)
            .withPositions(positions)
            .withPush(false);

        this.overlayRef = this.overlay.create({
            positionStrategy: this.positionStrategy,
            scrollStrategy: this.scrollStrategyOptions.reposition(),
        });

        const bandScale = new BandScale();
        const linearScale = new LinearScale();
        linearScale.fixDomain([0, 1000]);
        bandScale.fixDomain(["cat1"]);

        // Here you handle scales, assign colors via data accessors, and format series

        this.scales = {
            x: linearScale,
            y: bandScale,
        };
        this.scales.x.formatters.tick = (value: number) =>
            `${Number(value / 1000).toFixed(1)}s`;
        const renderer = new BarRenderer({
            highlightStrategy: new BarHighlightStrategy("x"),
        });
        const accessors = new HorizontalBarAccessors();
        accessors.data.color = (d: any) =>
            this.palette.standardColors.get(d.type);

        let commonWidth = 0;

        this.listItems.forEach((item) => {
            const seriesSet = [
                {
                    id: "series-1",
                    name: "Series 1",
                    data: item.data.map((d) => ({
                        value: d.end - d.start,
                        start: d.start,
                        end: d.end,
                        category: "cat1",
                        type: d.type,
                    })),
                    accessors,
                    scales: this.scales,
                    renderer,
                },
            ];

            item.chart.update(seriesSet);

            commonWidth = item.chart.getGrid().config().dimension.width(); // TODO: executed n times
        });

        // Here you configure grid

        const config = this.gridChart.getGrid().config() as XYGridConfig;
        // This handles the automatic resize of the grid depending on the number of series
        // We also use the height defined by BarStatusGridConfig() at the very top for each chart in series.
        config.dimension.height(
            this.listItems.length * this.seriesChartConfig.dimension.height()
        );
        config.dimension.width(commonWidth);
        config.dimension.autoHeight = false; // We must disable this option to let the grid to properly adjust
        config.axis.left.visible = false;
        config.axis.left.gridTicks = false;
        config.axis.bottom.gridTicks = true;

        this.gridChart.update([
            {
                id: "i am grid",
                name: "i am grid",
                data: [],
                accessors: new NoopAccessors(),
                scales: this.scales,
                renderer: new NoopRenderer(),
            },
        ]);

        this.gridChart.updateDimensions();

        this.overlayRef.attach(this.templatePortal);
    }

    drop(event: CdkDragDrop<string[]>): void {
        moveItemInArray(
            this.listItems,
            event.previousIndex,
            event.currentIndex
        );
    }
}

function getData(config: XYGridConfig) {
    return [
        {
            url: "http://www.google.com",
            size: 924, // in Bytes
            icon: "xml-file",
            chart: new Chart(new XYGrid(config)),
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
            url: "http://www2.google.com",
            size: 924, // in Bytes
            icon: "xml-file",
            chart: new Chart(new XYGrid(config)),
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
            url: "http://www.google.com/cat.png",
            size: 3333, // in Bytes
            icon: "image",
            chart: new Chart(new XYGrid(config)),
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
            url: "http://www.google.com/revenge.png",
            size: 3333, // in Bytes
            icon: "image",
            chart: new Chart(new XYGrid(config)),
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
