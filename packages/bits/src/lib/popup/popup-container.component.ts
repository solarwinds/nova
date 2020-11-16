import {
    AfterViewInit,
    Component,
    ElementRef,
    NgZone,
    ViewEncapsulation
} from "@angular/core";
import { take } from "rxjs/operators";

import { EdgeDetectionService } from "../../services/edge-detection.service";
import { PositionService } from "../../services/position.service";

/**
 * @ignore
 */
@Component({
    selector: "nui-popup-container",
    template: `
        <div class="nui-popup-container nui-popup--opened nui-popup--detached"
             [style.left.px]="left"
             [style.top.px]="top">
            <ng-content></ng-content>
        </div>
    `,
    encapsulation: ViewEncapsulation.None,
})
/* tslint:disable:use-host-property-decorator */
export class PopupContainerComponent implements AfterViewInit {
    public hostElement: HTMLElement;
    public top: number;
    public left: number;

    constructor(private elRef: ElementRef,
                private zone: NgZone,
                private positionService: PositionService,
                private edgeDetector: EdgeDetectionService) { }

    ngAfterViewInit() {
        const position = this.setPosition(this.elRef.nativeElement, this.hostElement);
        this.zone.onStable.asObservable().pipe(take(1))
            .subscribe(() => {
                // To be sure, that change detection mechanism was invoked and placement was updated
                this.zone.run(() => {
                    this.top = position.top;
                    this.left = position.left;
                });
            });
    }

    public setPosition (popup: HTMLElement, popupTrigger: HTMLElement) {
        // Element with dimensions
        const popupArea = <HTMLElement>popup.querySelector(".nui-popup__area");
        const placement = this.getValidPopupPlacement();
        return this.positionService
            .getPosition(popupTrigger, popupArea, `${placement.vertical}-${placement.horizontal}`, true);
    }

    private getValidPopupPlacement() {
        const popupArea = this.elRef.nativeElement.querySelector(".nui-popup__area");
        const canBe = this.edgeDetector.canBe(this.hostElement, popupArea);
        return {
            vertical: canBe?.placed.bottom ? "bottom" : "top",
            horizontal: canBe?.aligned.right ? "right" : "left",
        };
    }
}

