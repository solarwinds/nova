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
    AfterViewInit,
    Component,
    ElementRef,
    NgZone,
    ViewEncapsulation,
} from "@angular/core";
import { take } from "rxjs/operators";

import { EdgeDetectionService } from "../../services/edge-detection.service";
import { PositionService } from "../../services/position.service";

/**
 * @ignore
 * @deprecated in v11 - Use PopupComponent instead - Removal: NUI-5796
 */
@Component({
    selector: "nui-popup-container",
    template: `
        <div
            class="nui-popup-container nui-popup--opened nui-popup--detached"
            [style.left.px]="left"
            [style.top.px]="top"
        >
            <ng-content></ng-content>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class PopupContainerComponent implements AfterViewInit {
    public hostElement: HTMLElement;
    public top: number;
    public left: number;

    constructor(
        private elRef: ElementRef,
        private zone: NgZone,
        private positionService: PositionService,
        private edgeDetector: EdgeDetectionService
    ) {}

    public ngAfterViewInit(): void {
        const position = this.setPosition(
            this.elRef.nativeElement,
            this.hostElement
        );
        this.zone.onStable
            .asObservable()
            .pipe(take(1))
            .subscribe(() => {
                // To be sure, that change detection mechanism was invoked and placement was updated
                this.zone.run(() => {
                    this.top = position.top;
                    this.left = position.left;
                });
            });
    }

    public setPosition(
        popup: HTMLElement,
        popupTrigger: HTMLElement
    ): { top: number; left: number } {
        // Element with dimensions
        const popupArea = <HTMLElement>popup.querySelector(".nui-popup__area");
        const placement = this.getValidPopupPlacement();
        return this.positionService.getPosition(
            popupTrigger,
            popupArea,
            `${placement.vertical}-${placement.horizontal}`,
            true
        );
    }

    private getValidPopupPlacement() {
        const popupArea =
            this.elRef.nativeElement.querySelector(".nui-popup__area");
        const canBe = this.edgeDetector.canBe(this.hostElement, popupArea);
        return {
            vertical: canBe?.placed.bottom ? "bottom" : "top",
            horizontal: canBe?.aligned.right ? "right" : "left",
        };
    }
}
