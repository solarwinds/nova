import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, NgZone, OnDestroy, ViewChild } from "@angular/core";
import { LoggerService } from "@nova-ui/bits";
import ResizeObserver from "resize-observer-polyfill";

import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { BaseLayout } from "../base-layout";

@Component({
    selector: "nui-tiles",
    styleUrls: ["./tiles.component.less"],
    templateUrl: "./tiles.component.html",
})
export class TilesComponent extends BaseLayout implements OnDestroy, AfterViewInit {
    public static lateLoadKey = "TilesComponent";

    @Input() public nodes: string[] = [];
    @Input() public direction = "column";

    @HostBinding("class") public elementClass: string;
    public prioritizeGridRows: boolean = false;

    @ViewChild("gridItemsContainer", { static: true })
    private gridItemsContainer: ElementRef<HTMLElement>;

    private tilesResizeObserver: ResizeObserver;

    constructor(
        changeDetector: ChangeDetectorRef,
        pizzagnaService: PizzagnaService,
        logger: LoggerService,
        private ngZone: NgZone
    ) {
        super(changeDetector, pizzagnaService, logger);
    }

    public ngAfterViewInit() {
        this.handleGridFlowOnResize();
    }

    public ngOnDestroy() {
        this.tilesResizeObserver?.disconnect();
        // Ensures that any base class observables are unsubscribed.
        super.ngOnDestroy();
    }

    public getNodes(): string[] {
        return this.nodes;
    }

    private handleGridFlowOnResize() {
        this.tilesResizeObserver = new ResizeObserver(() => this.onResize());
        this.ngZone.runOutsideAngular(() => {
            this.tilesResizeObserver.observe(this.gridItemsContainer.nativeElement);
        });
    }

    private onResize() {
        if (this.nodes?.length < 2) { return; }

        const cssAttributes = this.gridItemsContainer.nativeElement.getBoundingClientRect();
        const { height, width } = cssAttributes;

        const h2WRatio = height / width;
        const allowedH2WRatio = getHeightToWidthRatioFor(this.nodes.length);

        const gap = 0.05; // height/width gap used in transitions to avoid widget lagging

        if ((h2WRatio - gap > allowedH2WRatio) && !this.prioritizeGridRows) {
            this.prioritizeGridRows = true;
            this.changeDetector.detectChanges();
            return;
        }

        if (h2WRatio + gap < allowedH2WRatio && this.prioritizeGridRows) {
            this.prioritizeGridRows = false;
            this.changeDetector.detectChanges();
            return;
        }
    }
}

/**
 * Height to Width container ratio varies per tiles amount.
 * Experimentally was determined valid h/w ratio for 2...8 tiles and
 * This function represents the linear dependency (approximately).
 */
const getHeightToWidthRatioFor = (tilesAmount: number) => 0.25 * tilesAmount + 0.7;
