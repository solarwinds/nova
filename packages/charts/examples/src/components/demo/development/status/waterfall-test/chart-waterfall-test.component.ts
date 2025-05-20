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
    PositionStrategy,
    ScrollStrategyOptions,
} from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";

import {
    BandScale,
    BarRenderer,
    BarStatusGridConfig,
    Chart,
    ChartPalette,
    CHART_PALETTE_CS1,
    HIGHLIGHT_DATA_POINT_EVENT,
    HorizontalBarAccessors,
    ISetDomainEventPayload,
    LinearScale,
    MappedValueProvider,
    NoopAccessors,
    NoopRenderer,
    SELECT_DATA_POINT_EVENT,
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
    selector: "nui-chart-waterfall-test",
    templateUrl: "./chart-waterfall-test.component.html",
    styleUrls: ["./chart-waterfall-test.component.less"],
})
export class ChartWaterfallTestComponent implements AfterViewInit, OnInit {
    // TODO: 1. overlay for grid. 2. top axis 3. popup on hover example
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

    public positionStrategy: PositionStrategy;
    public templatePortal: TemplatePortal;

    public listItems = [
        {
            url: "http://www.google.com",
            size: 924, // in Bytes
            icon: "xml-file",
            chart: new Chart(
                new XYGrid(new BarStatusGridConfig({ showBottomAxis: false }))
            ),
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
            chart: new Chart(
                new XYGrid(new BarStatusGridConfig({ showBottomAxis: false }))
            ),
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
            chart: new Chart(
                new XYGrid(new BarStatusGridConfig({ showBottomAxis: false }))
            ),
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
            chart: new Chart(
                new XYGrid(new BarStatusGridConfig({ showBottomAxis: false }))
            ),
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
    private scales: { x: LinearScale; y: BandScale };

    @ViewChild("templatePortalGrid")
    public templatePortalGrid: TemplateRef<any>;
    @ViewChild("gridChartPlaceholder") public gridChartPlaceholder: ElementRef;

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
        this.templatePortal = new TemplatePortal(
            this.templatePortalGrid,
            this._viewContainerRef
        );
        const positions: ConnectionPositionPair[] = [
            {
                overlayX: "start",
                overlayY: "top",
                originX: "start",
                originY: "top",
            },
        ];
        this.positionStrategy = this.overlayPositionBuilder
            .flexibleConnectedTo(this.gridChartPlaceholder)
            .withPositions(positions)
            .withFlexibleDimensions(true)
            .withPush(true);
        const overlayRef = this.overlay.create({
            positionStrategy: this.positionStrategy,
            scrollStrategy: this.scrollStrategyOptions.close(),
        });

        const bandScale = new BandScale();
        const linearScale = new LinearScale();
        linearScale.fixDomain([0, 1000]);
        bandScale.fixDomain(["cat1"]);

        this.scales = {
            y: bandScale,
            x: linearScale,
        };
        this.scales.x.formatters.tick = (value: number) =>
            `${Number(value / 1000).toFixed(1)}s`;
        const renderer = new BarRenderer();
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
                        category: "cat1",
                        type: d.type,
                        ["__bar"]: {
                            start: d.start,
                            end: d.end,
                        },
                    })),
                    accessors,
                    scales: this.scales,
                    renderer,
                },
            ];

            item.chart.update(seriesSet);

            item.chart
                .getEventBus()
                .getStream(HIGHLIGHT_DATA_POINT_EVENT)
                .subscribe(console.log);
            item.chart
                .getEventBus()
                .getStream(SELECT_DATA_POINT_EVENT)
                .subscribe(console.log);

            commonWidth = item.chart.getGrid().config().dimension.width(); // TODO: executed n times
        });

        // Handle grid

        const config = this.gridChart.getGrid().config() as XYGridConfig;
        config.dimension.height(this.listItems.length * 32);
        config.dimension.width(commonWidth);
        config.dimension.autoHeight = false;
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

        // this.templatePortalGrid.elementRef.nativeElement.offsetHeight = config.dimension.height;
        overlayRef.attach(this.templatePortal);
    }

    drop(event: CdkDragDrop<string[]>): void {
        moveItemInArray(
            this.listItems,
            event.previousIndex,
            event.currentIndex
        );
    }
}
