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
import ResizeObserver from "resize-observer-polyfill";

import { CHART_COMPONENT, CHART_VIEW_STATUS_EVENT, REFRESH_EVENT } from "../constants";
import { IChart, IChartComponent, IChartViewStatusEventPayload } from "../core/common/types";

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
export class ChartComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy, IChartComponent, OnChanges {

    @Input() public chart: IChart;

    public resizeObserver?: ResizeObserver;
    private resizeHandler: Function;
    private intersectionObserver: IntersectionObserver;

    constructor(private elRef: ElementRef, private ngZone: NgZone, private cd: ChangeDetectorRef) {
    }

    public ngOnInit() {
        this.intersectionObserver = new IntersectionObserver(this.intersectionObserverCallback);
        this.intersectionObserver.observe(this.elRef.nativeElement);
    }

    public ngOnChanges(changes: SimpleChanges) {
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

    public ngAfterContentInit() {
        this.chart.getEventBus().getStream(REFRESH_EVENT).subscribe(() => {
            this.chart.updateDimensions();
        });
    }

    public ngAfterViewInit() {
        this.resizeHandler = debounce(() => this.redraw(), 10);
        this.resizeObserver = new ResizeObserver(() => {
            // This was suggested here https://github.com/angular/zone.js/issues/1011
            this.ngZone.run(() => this.resizeHandler());
        });
        this.ngZone.runOutsideAngular(() => this.resizeObserver?.observe(<Element>(this.elRef.nativeElement)));
    }

    public ngOnDestroy() {
        this.intersectionObserver?.unobserve(<Element>this.elRef.nativeElement);
        this.resizeObserver?.unobserve(<Element>this.elRef.nativeElement);
        this.chart?.destroy();
    }

    public redraw = () => {
        this.chart.updateDimensions();
        this.cd.detectChanges();
    }

    private intersectionObserverCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
        // Since we're only listening for intersection changes for one target (the chart itself), the 'entries' argument always has just one element.
        const data: IChartViewStatusEventPayload = { isChartInView: entries[0].isIntersecting };
        this.chart.getEventBus().getStream(CHART_VIEW_STATUS_EVENT).next({ data });
    }
}
