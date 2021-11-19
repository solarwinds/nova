import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, HostBinding, Input, NgZone, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import isFinite from "lodash/isFinite";
import ResizeObserver from "resize-observer-polyfill";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { uuid } from "../../../functions/uuid";

export interface IBrokerValue {
    id: string;
    targetID: string;
    targetValue: number;
}

/**
 * @ignore
 * PROTOTYPE for DONUT ZOOMING
 *
 * This directive allows to zoom it's element to fit the dimensions of parent element
 */
@Directive({
    selector: "[nuiZoomContent]",
})
export class ZoomContentDirective implements OnDestroy, AfterViewInit, OnChanges {
    private destroy$ = new Subject();

    @HostBinding("style.zoom")
    public zoom = 1;

    @HostBinding("style.padding")
    public scalePadding: string = "0";

    // Zoom inputs
    @Input() public zoomRatio = 0.9;
    @Input() public minZoomDifference = 0.1;
    @Input() public maxZoom: number;
    @Input() public minZoom: number;
    @Input() public useZoom: boolean = true;

    // Scale inputs
    @Input() public margin: number = 10;
    @Input() public minScale: number = 0.1;
    @Input() public maxScale: number;
    @Input() public scaleIN$: BehaviorSubject<IBrokerValue>;
    @Input() public scaleOUT$: BehaviorSubject<IBrokerValue>;

    private readonly uuid = uuid();
    private element: HTMLElement;
    private parentElement: HTMLElement;
    private elementRect: DOMRect;
    private parentRect: DOMRect;
    private latestDataFromBroker: IBrokerValue;

    private resizeObserver: ResizeObserver;

    constructor(
        element: ElementRef,
        private ngZone: NgZone,
        private cdRef: ChangeDetectorRef
    ) {
        this.element = element.nativeElement;

        if (!this.element.parentElement) {
            // Note: is parentElement will be null resizeObserver will crash
            throw new Error("Parent element is undefined");
        }

        this.parentElement = this.element.parentElement;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.scaleOUT$ && this.scaleOUT$) {

            this.scaleIN$
                .pipe(takeUntil(this.destroy$))
                .subscribe(data => {
                    this.latestDataFromBroker = {...data};
                    this.element.style.transform = `scale(${data.targetValue})`;
                    this.checkScaleBoundaries(data.targetValue);
                });
        }
    }

    public ngAfterViewInit(): void {
        const resizeObserver = new ResizeObserver(() => this.onResize());
        this.ngZone.runOutsideAngular(() => {
            resizeObserver.observe(this.element);
            resizeObserver.observe(this.parentElement);
        });

        this.resizeObserver = resizeObserver;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();

        if (this.resizeObserver) {
            this.resizeObserver.unobserve(this.element);
            this.resizeObserver.unobserve(this.parentElement);
        }
    }

    public onResize(): void {
        this.elementRect = this.element?.getBoundingClientRect();
        this.parentRect = this.parentElement?.getBoundingClientRect();

        if (!this.elementRect || !this.parentRect) {
            return;
        }

        this.useZoom ? this.applyZoom() : this.applyScale();
    }

    private applyZoom() {
        const widthZoom = this.parentRect.width / this.elementRect.width;
        const heightZoom = this.parentRect.height / this.elementRect.height;

        let zoom = Math.min(widthZoom, heightZoom) * this.zoomRatio;
        if (this.minZoom) { zoom = Math.max(zoom, this.minZoom); }
        if (this.maxZoom) { zoom = Math.min(zoom, this.maxZoom); }

        if (Math.abs(zoom - this.zoom) > this.minZoomDifference) {
            this.zoom = zoom;
            this.cdRef.detectChanges(); // running inside an angular zone doesn't always work
        }
    }

    private applyScale() {
        const parentSize = {
            width: this.parentElement.offsetWidth - (2 * this.margin),
            height: this.parentElement.offsetHeight  - (2 * this.margin),
        };

        const scale = Math.min(parentSize.width / this.element.offsetWidth, parentSize.height / this.element.offsetHeight);

        this.scaleOUT$
            ? this.scaleOUT$.next({
                ...this.latestDataFromBroker,
                targetID: this.uuid,
                targetValue: isFinite(scale) ? scale : 0,
            })
            : this.element.style.transform =  `scale(${scale})`;

        this.checkScaleBoundaries(scale);
    }

    private checkScaleBoundaries(scale: number) {
        if (scale < this.minScale) {
            this.element.style.transform = `scale(${this.minScale})`;
        }

        if (this.maxScale && (scale > this.maxScale)) {
            this.element.style.transform = `scale(${this.maxScale})`;
        }
    }
}
