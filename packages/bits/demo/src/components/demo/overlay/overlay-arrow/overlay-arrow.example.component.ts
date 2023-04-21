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
    FlexibleConnectedPositionStrategy,
    OverlayConfig,
} from "@angular/cdk/overlay";
import {
    AfterViewInit,
    Component,
    OnDestroy,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import {
    IOverlayPositionServiceConfig,
    OverlayComponent,
    OverlayPlacement,
} from "@nova-ui/bits";

const CUSTOM_OVERLAY_PANEL_CLASS = "custom-overlay-panel-class";

@Component({
    selector: "nui-overlay-arrow-example",
    templateUrl: "./overlay-arrow.example.component.html",
    styleUrls: ["./overlay-arrow.example.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class OverlayArrowExampleComponent implements AfterViewInit, OnDestroy {
    private readonly destroy$ = new Subject<void>();

    public possiblePositions: OverlayPlacement[] = [
        OverlayPlacement.Top,
        OverlayPlacement.Bottom,
        OverlayPlacement.Left,
        OverlayPlacement.Right,
    ];

    public overlayConfig: OverlayConfig = {
        panelClass: [CUSTOM_OVERLAY_PANEL_CLASS],
    };

    public positionSelectControl = new FormControl(this.possiblePositions[0], {
        nonNullable: true,
    });
    public arrowSelectControl = new FormControl(true);
    @ViewChild(OverlayComponent) public overlay: OverlayComponent;

    public ngAfterViewInit(): void {
        this.handlePosition();

        this.overlay.clickOutside
            .pipe(takeUntil(this.destroy$))
            .subscribe((_) => this.overlay.hide());
    }

    public handlePosition(): void {
        // set the positions when showing the popup
        this.overlay.show$.subscribe(() => {
            this.overlay.overlayPositionService.setOverlayPositionConfig(
                this.getPositionServiceConfig()
            );
            // get available positions for the overlay from overlay.overlayPositionService
            const availablePositions =
                this.overlay.overlayPositionService.getPossiblePositionsForPlacement(
                    this.positionSelectControl.value
                );
            // FlexibleConnectedPositionStrategy is default strategy of overlay component.
            const positionStrategy = this.overlay.getOverlayRef().getConfig()
                .positionStrategy as FlexibleConnectedPositionStrategy;
            positionStrategy
                // !!! using default '30' value breaks the edges, when displaying overlay from right, for the sake of the example, it's set to '0'.
                .withViewportMargin(0)
                .withPositions(availablePositions);
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private getPositionServiceConfig():
        | IOverlayPositionServiceConfig
        | undefined {
        const isArrowNeeded = this.arrowSelectControl.value;
        // define config with NO paddings for the overlay in case there's no arrow
        const noArrowCfg = {
            arrowPadding: 0, // you can use custom numbers here
            arrowSize: 0, // you can use custom numbers here
        };

        // 'undefined' is set to take default paddings and arrow size as in the style guides.
        const positionServiceConfig = isArrowNeeded ? undefined : noArrowCfg;

        return positionServiceConfig;
    }
}
