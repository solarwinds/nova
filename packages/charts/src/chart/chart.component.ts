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

import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import debounce from "lodash/debounce";

import {
    CHART_COMPONENT,
    CHART_VIEW_STATUS_EVENT,
    REFRESH_EVENT,
} from "../constants";
import {
    IChart,
    IChartComponent,
    IChartViewStatusEventPayload,
} from "../core/common/types";

@Component({
    selector: "nui-chart",
    template: "",
    providers: [
        {
            provide: CHART_COMPONENT,
            useExisting: forwardRef(() => ChartComponent),
        },
    ],
})
export class ChartComponent
    implements
        OnInit,
        AfterContentInit,
        AfterViewInit,
        OnDestroy,
        IChartComponent,
        OnChanges
{
    @Input() public chart: IChart;

    public resizeObserver?: ResizeObserver;
    private resizeHandler: Function;
    private intersectionObserver: IntersectionObserver;

    constructor(
        private elRef: ElementRef,
        private ngZone: NgZone,
        private cd: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        this.intersectionObserver = new IntersectionObserver(
            this.intersectionObserverCallback
        );
        this.intersectionObserver.observe(this.elRef.nativeElement);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["chart"]) {
            const previousChart: IChart = changes["chart"].previousValue;
            if (previousChart) {
                previousChart.destroy();
            }

            if (this.chart) {
                this.chart.build(this.elRef.nativeElement);
                this.redraw();
            }
        }
    }

    public ngAfterContentInit(): void {
        this.chart
            .getEventBus()
            .getStream(REFRESH_EVENT)
            .subscribe(() => {
                this.chart.updateDimensions();
            });
    }

    public ngAfterViewInit(): void {
        this.resizeHandler = debounce(() => this.redraw(), 10);
        this.resizeObserver = new ResizeObserver(() => {
            // This was suggested here https://github.com/angular/zone.js/issues/1011
            this.ngZone.run(() => this.resizeHandler());
        });
        this.ngZone.runOutsideAngular(() =>
            this.resizeObserver?.observe(<Element>this.elRef.nativeElement)
        );
    }

    public ngOnDestroy(): void {
        this.intersectionObserver?.unobserve(<Element>this.elRef.nativeElement);
        this.resizeObserver?.unobserve(<Element>this.elRef.nativeElement);
        this.chart?.destroy();
    }

    public redraw = (): void => {
        this.chart.updateDimensions();
        this.cd.detectChanges();
    };

    private intersectionObserverCallback = (
        entries: IntersectionObserverEntry[]
    ): void => {
        // Since we're only listening for intersection changes for one target (the chart itself), the 'entries' argument always has just one element.
        const data: IChartViewStatusEventPayload = {
            isChartInView: entries[0].isIntersecting,
        };
        this.chart
            .getEventBus()
            .getStream(CHART_VIEW_STATUS_EVENT)
            .next({ data });
    };
}
