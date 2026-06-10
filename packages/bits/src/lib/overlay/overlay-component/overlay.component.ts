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
    ConfigurableFocusTrap,
    ConfigurableFocusTrapFactory,
} from "@angular/cdk/a11y";
import {
    Overlay,
    OVERLAY_DEFAULT_CONFIG,
    OverlayConfig,
    OverlayContainer,
    OverlayRef,
    OverlaySizeConfig,
} from "@angular/cdk/overlay";
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
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import set from "lodash/set";
import some from "lodash/some";
import _uniqueId from "lodash/uniqueId";
import { Observable, Subject, Subscription } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

import { DOCUMENT_CLICK_EVENT } from "../../../constants/event.constants";
import { EventBusService } from "../../../services/event-bus.service";
import { OverlayCustomContainer } from "../overlay-custom-container";
import { OverlayPositionService } from "../overlay-position.service";
import { OverlayService } from "../overlay.service";
import { IOverlayComponent, OverlayContainerType } from "../types";

export const POPUP_V2_VIEWPORT_MARGINS_DEFAULT = 30;

const isMouseEvent = (event: Event): event is MouseEvent =>
    event instanceof MouseEvent;

// <example-url>./../examples/index.html#/overlay</example-url>

/* @dynamic */
@Component({
    selector: "nui-overlay",
    template: ` <ng-template cdkPortal>
        <div
            [attr.id]="overlayId"
            class="nui-overlay"
            [attr.role]="roleAttr || null"
            [attr.aria-label]="ariaLabel || null"
            [attr.aria-labelledby]="ariaLabelledby || null"
            [attr.aria-describedby]="ariaDescribedby || null"
            [attr.aria-modal]="ariaModal ? 'true' : null"
            [ngClass]="{ empty: empty$ | async }"
        >
            <ng-content></ng-content>
        </div>
    </ng-template>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        Overlay,
        OverlayService,
        OverlayPositionService,
        { provide: OverlayContainer, useClass: OverlayCustomContainer },
        { provide: OVERLAY_DEFAULT_CONFIG, useValue: { usePopover: false } },
    ],
    styleUrls: ["overlay.component.less"],
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class OverlayComponent
    implements
        OnInit,
        OnDestroy,
        IOverlayComponent,
        AfterContentChecked,
        AfterViewInit,
        OnChanges
{
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

    /** Sets the id attribute */
    @Input() idAttr?: string;

    /** Sets the aria-label attribute for accessibility */
    @Input() ariaLabel?: string;

    /** Sets the aria-labelledby attribute for accessibility */
    @Input() ariaLabelledby?: string;

    /** Sets the aria-describedby attribute for accessibility */
    @Input() ariaDescribedby?: string;

    /** Sets whether the overlay is modal (adds aria-modal="true") */
    @Input() ariaModal?: boolean;
    /**
     * When enabled, keyboard focus is trapped inside the overlay content while it is open,
     * and restored to the previously focused element once the overlay is closed.
     * Useful for modal-like overlays (e.g. confirmation dialogs). Defaults to false so that
     * dropdown-like usages (select, combobox) keep their current behavior.
     */
    @Input() public trapFocus = false;
    /** Emits MouseEvent when click occurs outside Select/Combobox */
    @Output() public readonly clickOutside = new EventEmitter<MouseEvent>();

    /** The place where the Popup will be attached */
    @ViewChild(CdkPortal)
    public contentTemplate: CdkPortal;

    /** Emits on the Popup show */
    public readonly show$: Subject<void>;

    /** Emits on the Popup hide */
    public readonly hide$: Subject<void>;

    /** Emits when content of the Popup is empty */
    public readonly empty$ = new Subject<boolean>();

    /** Indicates open/close state */
    public get showing(): boolean {
        return this.overlayService?.showing;
    }

    public overlayId!: string;

    private positionStrategySubscription!: Subscription;
    private focusTrap: ConfigurableFocusTrap | null = null;
    private previouslyFocusedElement: HTMLElement | null = null;

    constructor(
        public overlayPositionService: OverlayPositionService,
        protected overlayService: OverlayService,
        protected cdkOverlay: Overlay,
        private eventBusService: EventBusService,
        private focusTrapFactory: ConfigurableFocusTrapFactory
    ) {
        this.show$ = this.overlayService.show$;
        this.hide$ = this.overlayService.hide$;
    }

    public ngOnInit(): void {
        this.overlayId = this.idAttr || _uniqueId("nui-overlay-");
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const overlayPropsToMap = ["toggleReference", "customContainer"];

        if (changes) {
            overlayPropsToMap.forEach((key) => {
                if (changes[key]) {
                    set(this.overlayService, key, changes[key].currentValue);
                }
            });
        }
    }

    public ngAfterViewInit(): void {
        this.overlayService.contentTemplate = this.contentTemplate;
    }

    public ngAfterContentChecked(): void {
        this.empty$.next(this.isPopupContentEmpty());
    }

    public ngOnDestroy(): void {
        this.deactivateFocusTrap();
        this.overlayService.ngOnDestroy();
    }

    /** Shows Popup */
    public show(): void {
        this.setOverlayConfig();
        this.overlayService.show();
        this.handleOutsideClicks();
        this.activateFocusTrap();

        setTimeout(() => this.empty$.next(this.isPopupContentEmpty())); // timeout to get the height of rendered content items
    }

    /** Hides Popup */
    public hide(): void {
        this.deactivateFocusTrap();
        this.overlayService.hide();
        this.positionStrategySubscription?.unsubscribe();
    }

    /** Toggles Popup */
    public toggle(): void {
        this.overlayService.showing ? this.hide() : this.show();
    }

    public getOverlayRef(): OverlayRef {
        return this.overlayService.getOverlayRef();
    }

    public updateSize(size: OverlaySizeConfig): void {
        this.overlayService.updateSize(size);
    }

    /** Stream of clicks outside. */
    private overlayClickOutside(): Observable<MouseEvent> {
        return this.eventBusService.getStream(DOCUMENT_CLICK_EVENT).pipe(
            filter(isMouseEvent),
            filter((event) => {
                const clickTarget = event.target as HTMLElement;
                const notOrigin = !some(
                    event.composedPath(),
                    (p) => p === this.toggleReference
                ); // the toggle elem
                const notOverlay =
                    this.overlayService
                        .getOverlayRef()
                        ?.overlayElement?.contains(clickTarget) === false; // the popup

                return notOrigin && notOverlay;
            })
        );
    }

    private handleOutsideClicks() {
        const clicksOutsideStream$ = this.overlayConfig?.hasBackdrop
            ? this.overlayService.getOverlayRef().backdropClick()
            : this.overlayClickOutside();

        clicksOutsideStream$
            .pipe(takeUntil(this.hide$))
            .subscribe((v) => this.clickOutside.emit(v));
    }

    private setOverlayConfig(): void {
        const overlayConfig = this.overlayService.overlayConfig;

        const positionStrategy = this.cdkOverlay
            .position()
            .flexibleConnectedTo(this.toggleReference)
            .withPush(false)
            .withViewportMargin(
                this.viewportMargin || POPUP_V2_VIEWPORT_MARGINS_DEFAULT
            )
            .withPositions([
                {
                    originX: "start",
                    originY: "bottom",
                    overlayX: "start",
                    overlayY: "top",
                },
                {
                    originX: "start",
                    originY: "top",
                    overlayX: "start",
                    overlayY: "bottom",
                },
            ]);

        this.positionStrategySubscription =
            this.overlayPositionService.updateOffsetOnPositionChanges(
                positionStrategy,
                () => this.getOverlayRef()
            );

        this.overlayService.overlayConfig = {
            ...overlayConfig,
            positionStrategy,
            ...this.overlayConfig,
        };
    }

    private getContentHeight(): number {
        const lastElementChild =
            this.overlayService.getOverlayRef()?.hostElement?.lastElementChild;

        // to maintain current signature we will return 0 to avoid unnecessary undefined/null checks
        return lastElementChild?.clientHeight || 0;
    }

    private isPopupContentEmpty(): boolean {
        return this.getContentHeight() <= 10; // 10 is for 5 + 5 paddings
    }

    private activateFocusTrap(): void {
        if (!this.trapFocus) {
            return;
        }

        const overlayElement =
            this.overlayService.getOverlayRef()?.overlayElement;
        if (!overlayElement) {
            return;
        }

        this.previouslyFocusedElement =
            (document.activeElement as HTMLElement) ?? null;

        this.focusTrap = this.focusTrapFactory.create(overlayElement);
        // Defer focus until the overlay content has been rendered.
        this.focusTrap.focusInitialElementWhenReady();
    }

    private deactivateFocusTrap(): void {
        if (this.focusTrap) {
            this.focusTrap.destroy();
            this.focusTrap = null;
        }

        if (this.previouslyFocusedElement) {
            this.previouslyFocusedElement.focus();
            this.previouslyFocusedElement = null;
        }
    }
}
