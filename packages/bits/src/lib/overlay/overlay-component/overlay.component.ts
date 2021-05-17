import { Overlay, OverlayConfig, OverlayContainer, OverlaySizeConfig } from "@angular/cdk/overlay";
import { CdkPortal } from "@angular/cdk/portal";
import {
    AfterContentChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import set from "lodash/set";
import some from "lodash/some";
import { Observable, Subject, Subscription } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

import { DOCUMENT_CLICK_EVENT } from "../../../constants/event.constants";
import { EventBusService } from "../../../services/event-bus.service";
import { OverlayCustomContainer } from "../overlay-custom-container";
import { OverlayPositionService } from "../overlay-position.service";
import { OverlayService } from "../overlay.service";
import { IOverlayComponent, OverlayContainerType } from "../types";

export const POPUP_V2_VIEWPORT_MARGINS_DEFAULT = 30;

// <example-url>./../examples/index.html#/overlay</example-url>

/* @dynamic */
@Component({
    selector: "nui-overlay",
    template: `
        <ng-template cdk-portal>
            <div id="nui-overlay" class="nui-overlay" [attr.role]="roleAttr || null" [ngClass]="{'empty': empty$ | async}">
                <ng-content></ng-content>
            </div>
        </ng-template>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        Overlay,
        OverlayService,
        OverlayPositionService,
        { provide: OverlayContainer, useClass: OverlayCustomContainer },
    ],
    styleUrls: ["overlay.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class OverlayComponent implements OnDestroy, IOverlayComponent, AfterContentChecked, AfterViewInit, OnChanges {

    /** Sets overlay config in accordance with [Material CDK]{@link https://material.angular.io/cdk/overlay/api#OverlayConfig} */
    @Input() public overlayConfig: OverlayConfig;

    /** Element to which the Popup is attached */
    @Input() public toggleReference: HTMLElement;

    /** Popup viewport margins */
    @Input() viewportMargin: number;

    /** Sets custom container for CDK Overlay. Selector OR ElementRef */
    @Input() customContainer: OverlayContainerType;

    /** Sets the role attribute */
    @Input() roleAttr: string;

    /** Emits MouseEvent when click occurs outside Select/Combobox */
    @Output() public clickOutside = new EventEmitter<MouseEvent>();

    /** The place where the Popup will be attached */
    @ViewChild(CdkPortal)
    public contentTemplate: CdkPortal;

    /** Emits on the Popup show */
    public show$: Subject<void>;

    /** Emits on the Popup hide */
    public hide$: Subject<void>;

    /** Emits when content of the Popup is empty */
    public empty$ = new Subject();

    /** Indicates open/close state */
    public get showing(): boolean {
        return this.overlayService?.showing;
    }

    private positionStrategySubscription: Subscription;

    constructor(
        public overlayPositionService: OverlayPositionService,
        protected overlayService: OverlayService,
        protected cdkOverlay: Overlay,
        private eventBusService: EventBusService
    ) {
        this.show$ = this.overlayService.show$;
        this.hide$ = this.overlayService.hide$;
    }

    public ngOnChanges(changes: SimpleChanges) {
        const overlayPropsToMap = [
            "toggleReference",
            "customContainer",
        ];

        if (changes) {
            overlayPropsToMap.forEach(key => {
                if (changes[key]) {
                    set(this.overlayService, key, changes[key].currentValue);
                }
            });
        }
    }

    public ngAfterViewInit() {
        this.overlayService.contentTemplate = this.contentTemplate;
    }

    public ngAfterContentChecked() {
        this.empty$.next(this.isPopupContentEmpty());
    }

    public ngOnDestroy(): void {
        this.overlayService.ngOnDestroy();
    }

    /** Shows Popup */
    public show() {
        this.setOverlayConfig();
        this.overlayService.show();
        this.handleOutsideClicks();

        setTimeout(() => this.empty$.next(this.isPopupContentEmpty())); // timeout to get the height of rendered content items
    }

    /** Hides Popup */
    public hide() {
        this.overlayService.hide();
        this.positionStrategySubscription?.unsubscribe();
    }

    /** Toggles Popup */
    public toggle() {
        this.overlayService.showing ? this.hide() : this.show();
    }

    public getOverlayRef() {
        return this.overlayService.getOverlayRef();
    }

    public updateSize(size: OverlaySizeConfig): void {
        this.overlayService.updateSize(size);
    }


    /** Stream of clicks outside. */
    private overlayClickOutside(): Observable<MouseEvent> {
        return this.eventBusService.getStream({id: DOCUMENT_CLICK_EVENT})
            .pipe(
                filter(event => {
                    const clickTarget = event.target as HTMLElement;
                    const notOrigin = !some(event.composedPath(), p => p === this.toggleReference); // the toggle elem
                    const notOverlay = this.overlayService.getOverlayRef()?.overlayElement?.contains(clickTarget) === false; // the popup

                    return notOrigin && notOverlay;
                }));
    }

    private handleOutsideClicks() {
        const clicksOutsideStream$ = this.overlayConfig?.hasBackdrop
            ? this.overlayService.getOverlayRef().backdropClick()
            : this.overlayClickOutside();

        clicksOutsideStream$.pipe(takeUntil(this.hide$)).subscribe(v => this.clickOutside.emit(v));
    }

    private setOverlayConfig(): void {
        const overlayConfig = this.overlayService.overlayConfig;

        const positionStrategy = this.cdkOverlay.position()
            .flexibleConnectedTo(this.toggleReference)
            .withPush(false)
            .withViewportMargin(this.viewportMargin || POPUP_V2_VIEWPORT_MARGINS_DEFAULT)
            .withPositions([{
                originX: "start",
                originY: "bottom",
                overlayX: "start",
                overlayY: "top",
            }, {
                originX: "start",
                originY: "top",
                overlayX: "start",
                overlayY: "bottom",
            }]);

        this.positionStrategySubscription = this.overlayPositionService.updateOffsetOnPositionChanges(positionStrategy, () => this.getOverlayRef());

        this.overlayService.overlayConfig = {
            ...overlayConfig,
            positionStrategy,
            ...this.overlayConfig,
        };
    }

    private getContentHeight(): number {
        const lastElementChild = this.overlayService.getOverlayRef()?.hostElement?.lastElementChild;

        // to maintain current signature we will return 0 to avoid unnecessary undefined/null checks
        return lastElementChild?.clientHeight || 0;
    }

    private isPopupContentEmpty(): boolean {
        return this.getContentHeight() <= 10; // 10 is for 5 + 5 paddings
    }
}
