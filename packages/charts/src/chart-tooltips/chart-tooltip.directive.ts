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
    Overlay,
    OverlayPositionBuilder,
    ScrollStrategyOptions,
} from "@angular/cdk/overlay";
// added the import below on a separate line to avoid warning of unused reference when doing build-lib:prod
// @see https://github.com/angular/angular/issues/21280#issuecomment-608957903
import {
    ConnectedPosition,
    FlexibleConnectedPositionStrategy,
    OverlayRef,
} from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import {
    Directive,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    TemplateRef,
} from "@angular/core";
import { Subject, Subscription } from "rxjs";

import { ChartTooltipComponent } from "./chart-tooltip.component";

/** @ignore */
@Directive({ selector: "[nuiChartTooltip]" })
export class ChartTooltipDirective implements OnInit, OnDestroy {
    @Input() template: TemplateRef<any>;

    @Input() openRemoteControl: Subject<void>;
    @Input() closeRemoteControl: Subject<void>;

    @Input() positions: ConnectedPosition[];

    private overlayRef: OverlayRef;
    private openSubscription: Subscription;
    private closeSubscription: Subscription;
    private positionStrategy: FlexibleConnectedPositionStrategy;

    constructor(
        private overlay: Overlay,
        private overlayPositionBuilder: OverlayPositionBuilder,
        private scrollStrategyOptions: ScrollStrategyOptions,
        public elementRef: ElementRef<HTMLElement>
    ) {}

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

    public show(): void {
        if (this.overlayRef.hasAttached()) {
            this.positionStrategy.apply();
            return;
        }
        const tooltipRef = this.overlayRef.attach(
            new ComponentPortal(ChartTooltipComponent)
        );
        tooltipRef.instance.template = this.template;
    }

    public hide(): void {
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
