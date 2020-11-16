import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, HostBinding, Input, NgZone, OnDestroy } from "@angular/core";
import ResizeObserver from "resize-observer-polyfill";
import { Subject } from "rxjs";

/**
 * @ignore
 * PROTOTYPE for DONUT ZOOMING
 *
 * This directive allows to zoom it's element to fit the dimensions of parent element
 */
@Directive({
    selector: "[nuiZoomContent]",
})
export class ZoomContentDirective implements OnDestroy, AfterViewInit {
    private destroy$ = new Subject();

    @HostBinding("style.zoom")
    public zoom = 1;

    @HostBinding("style.transform")
    public scale: string = `scale(1)`;

    @HostBinding("style.padding")
    public scalePadding: string = "0";
    
    @Input() public zoomRatio = 0.9;
    @Input() public minZoomDifference = 0.1;
    @Input() public maxZoom: number;
    @Input() public minZoom: number;
    @Input() public useZoom: boolean = true;

    private element: HTMLElement;
    private parentElement: HTMLElement;
    private defaultScaleWidth: number;
    private elementRect: DOMRect;
    private parentRect: DOMRect;

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

    public onResize() {
        this.elementRect = this.element?.getBoundingClientRect();
        this.parentRect = this.parentElement?.getBoundingClientRect();

        if (!this.elementRect || !this.parentRect) {
            return;
        }

        if (this.useZoom) {
            this.applyZoom();
        } else {
            this.applyScale();
        }
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
        // Saving the default target element width when scale is 1 to base calculations on
        if (!this.defaultScaleWidth) {
            this.defaultScaleWidth = this.elementRect.width;
        }
        // Getting the minimum of parent container's width and height to properly resize the contents in any of 2d dimensions
        const minDimension = Math.min(this.parentRect.width, this.parentRect.height);

        // We can control the resulting scale range with the 'zoomRatio' param
        const scale = (minDimension / this.defaultScaleWidth) * this.zoomRatio;

        this.scale = `scale(${scale})`;

        if (this.parentRect.width < this.elementRect.width) {
            // When we apply 'scale()' to a container it will grow in size if scale > 1. In this case, if a target container width
            // gets larger than the parent container's width the overflow may happen, especially in case of long strings.
            // To prevent this from happening we use left and right paddings here to adjust the position of the target container and
            // prevernt the overflow.
            this.scalePadding = `0 ${(this.parentRect.width - (this.parentRect.width / scale)) / 2}px`;
        }

        if (scale < 1) {
            // If scale < 1 there is no overflow happening, no need to adjust container size with paddings
            this.scalePadding = "0";
        }
        this.cdRef.detectChanges();
    }
}
