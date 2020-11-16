import { ConnectionPositionPair, Overlay, OverlayPositionBuilder, PositionStrategy, ScrollStrategyOptions } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { AfterViewInit, Component, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { GaugeComponent } from "@solarwinds/nova-charts";

/** @ignore */
@Component({
    selector: "nui-gauge-component-prototype",
    templateUrl: "./gauge-component-prototype.component.html",
    styleUrls: ["./gauge-component-prototype.component.less"],
})
export class GaugeComponentPrototypeComponent implements AfterViewInit {
    public value = 42;
    private _thickness = 30;

    public get thickness() {
        return this._thickness;
    }

    public set thickness(val: number) {
        this._thickness = val;
        if (this.positionStrategy) {
            this.positionStrategy.apply();
        }
    }

    public thresholds = {
        error: 90,
        warning: 65,
    };

    public positionStrategy: PositionStrategy;

    public templatePortal: TemplatePortal;

    @ViewChild("templatePortalContent") templatePortalContent: TemplateRef<any>;
    @ViewChild("withConnectedContent") gaugeWithContent: GaugeComponent;

    constructor(private _viewContainerRef: ViewContainerRef,
                private overlay: Overlay,
                private overlayPositionBuilder: OverlayPositionBuilder,
                private scrollStrategyOptions: ScrollStrategyOptions) {
    }

    ngAfterViewInit(): void {
        this.templatePortal = new TemplatePortal(this.templatePortalContent, this._viewContainerRef);
        const positions: ConnectionPositionPair[] = [
            {
                overlayX: "center",
                overlayY: "center",
                originX: "center",
                originY: "center",
            },
        ];
        this.positionStrategy = this.overlayPositionBuilder
            .flexibleConnectedTo(this.gaugeWithContent.control)
            .withPositions(positions)
            .withFlexibleDimensions(true)
            .withPush(true);

        const overlayRef = this.overlay.create({
            positionStrategy: this.positionStrategy,
            scrollStrategy: this.scrollStrategyOptions.close(),
        });
        overlayRef.attach(this.templatePortal);
    }
}
