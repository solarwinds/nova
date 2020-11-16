import { Overlay, OverlayPositionBuilder, ScrollStrategyOptions } from "@angular/cdk/overlay";
// added the import below on a separate line to avoid warning of unused reference when doing build-lib:prod
// @see https://github.com/angular/angular/issues/21280#issuecomment-608957903
import { ConnectedPosition, FlexibleConnectedPositionStrategy, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ComponentRef, Directive, ElementRef, Input, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { Subject, Subscription } from "rxjs";

import { ChartTooltipComponent } from "./chart-tooltip.component";

/** @ignore */
@Directive({selector: "[nuiChartTooltip]"})
export class ChartTooltipDirective implements OnInit, OnDestroy {

    @Input() template: TemplateRef<any>;

    @Input() openRemoteControl: Subject<void>;
    @Input() closeRemoteControl: Subject<void>;

    @Input() positions: ConnectedPosition[];

    private overlayRef: OverlayRef;
    private openSubscription: Subscription;
    private closeSubscription: Subscription;
    private positionStrategy: FlexibleConnectedPositionStrategy;

    constructor(private overlay: Overlay,
                private overlayPositionBuilder: OverlayPositionBuilder,
                private scrollStrategyOptions: ScrollStrategyOptions,
                public elementRef: ElementRef<HTMLElement>) {
    }

    public ngOnInit(): void {
        this.positionStrategy = this.overlayPositionBuilder
            .flexibleConnectedTo(this.elementRef)
            .withPositions(this.positions)
            .withFlexibleDimensions(false)
            .withPush(true);

        this.overlayRef = this.overlay.create({
            panelClass: "nui-chart-tooltip-pane",
            positionStrategy: this.positionStrategy,
            scrollStrategy: this.scrollStrategyOptions.close(),
        });

        if (this.openRemoteControl) {
            this.openSubscription = this.openRemoteControl.subscribe(() => {
                this.show();
            });
        }

        if (this.closeRemoteControl) {
            this.closeSubscription = this.closeRemoteControl.subscribe(() => {
                this.hide();
            });
        }
    }

    public show() {
        if (this.overlayRef.hasAttached()) {
            this.positionStrategy.apply();
        } else {
            const tooltipRef: ComponentRef<ChartTooltipComponent>
                = this.overlayRef.attach(new ComponentPortal(ChartTooltipComponent));
            tooltipRef.instance.template = this.template;
        }
    }

    public hide() {
        this.overlayRef.detach();
    }

    public ngOnDestroy(): void {
        this.hide();

        if (this.openSubscription) {
            this.openSubscription.unsubscribe();
        }
        if (this.closeSubscription) {
            this.closeSubscription.unsubscribe();
        }
    }

    public getOverlayElement(): HTMLElement {
        return this.overlayRef.overlayElement;
    }

}
