import { ConnectedPosition, FlexibleConnectedPositionStrategy, Overlay, OverlayConfig, ScrollDispatcher } from "@angular/cdk/overlay";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { skip, take, takeUntil } from "rxjs/operators";

import { fadeIn, TypedAnimationEvent } from "../../animations/fadeIn";
import { OverlayComponent } from "../overlay/overlay-component/overlay.component";

/** CSS class that will be attached to the overlay panel. */
export const TOOLTIP_PANEL_CLASS = "nui-tooltip-panel";
const ANIMATION_DELAY = 200; // ms
/**
 * Internal component that wraps the tooltip"s content.
 */

/** @ignore */
@Component({
    selector: "nui-tooltip-component",
    styleUrls: ["./tooltip.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [fadeIn],
    host: {
        "(body:click)": "this._handleBodyInteraction()",
        "aria-hidden": "true",
    },
    template: `
        <nui-overlay [toggleReference]="toggleReference.nativeElement"
            [overlayConfig]="overlayConfig"
            >
            <div class="nui-tooltip-body with-nui-overlay nui-text-small"
                [@fadeIn]="_visibility"
                (@fadeIn.start)="_animationStart()"
                (@fadeIn.done)="_animationDone($event)">
                {{message}}
            </div>
        </nui-overlay>
    `,
})
export class TooltipComponent implements OnDestroy, OnInit {
    /** Message to display in the tooltip */
    public get message(): string {
        return this._message;
    }

    public set message(value: string) {
        this._message = value;
        this._markForCheck();
        this.ngZone.onMicrotaskEmpty.asObservable().pipe(
            take(1),
            takeUntil(this.destroy$)
        ).subscribe(() => {
            this.overlayComponent?.getOverlayRef()?.updatePosition();
        });
    }

    private _message: string;
    public possiblePositions: ConnectedPosition[];

    /** Property watched by the animation framework to show or hide the tooltip */
    _visibility: boolean = false;

    public overlayConfig: OverlayConfig;
    public toggleReference: ElementRef<HTMLElement>;

    @ViewChild(OverlayComponent, { static: true })
    private overlayComponent: OverlayComponent;

    /** Whether interactions on the page should close the tooltip */
    private _closeOnInteraction: boolean = false;

    /** Subject for notifying that the tooltip has been hidden from the view */
    private readonly _onHide: Subject<any> = new Subject();
    private destroy$ = new Subject();
    private hiding$ = new BehaviorSubject<boolean>(false);

    constructor(private _changeDetectorRef: ChangeDetectorRef,
        private scrollDispatcher: ScrollDispatcher,
        private ngZone: NgZone,
        protected overlay: Overlay) {
    }

    public ngOnInit() {
        this.updatePopupOverlayConfig();
    }

    public updatePossiblePositions(positions: ConnectedPosition[]) {
        this.possiblePositions = positions;
        const positionStrategy = this.overlayComponent.getOverlayRef().getConfig().positionStrategy as FlexibleConnectedPositionStrategy;
        positionStrategy.withPositions(this.possiblePositions);
    }

    /**
     * Shows the tooltip with an animation originating from the provided origin
     */
    show(): void {
        if (this.hiding$.value) {
            this.hiding$.pipe( // open after "hide" in case hide is already in process (animation)
                skip(1),  // skip behavior subject 1st emit
                take(1)
            ).subscribe((v) => this._show());
        } else {
            this._show();
        }

    }

    private _show() {
        this.overlayComponent.show();
        // Body interactions should cancel the tooltip if there is a delay in showing.
        this._closeOnInteraction = true;
        this._visibility = true;
        this._markForCheck();
    }

    /**
     * Begins the animation to hide the tooltip after the provided delay in ms.
     */
    hide(): void {
        this._visibility = false;
        // Mark for check so if any parent component has set the
        // ChangeDetectionStrategy to OnPush it will be checked anyways
        this._markForCheck();
        this.hiding$.next(true);
        setTimeout(() => {
            this.overlayComponent.hide();
            this.hiding$.next(false);
        }, ANIMATION_DELAY);
    }

    /** Returns an observable that notifies when the tooltip has been hidden from view. */
    afterHidden(): Observable<void> {
        return this._onHide.asObservable();
    }

    /** Whether the tooltip is being displayed. */
    isVisible(): boolean {
        return this._visibility === true;
    }

    ngOnDestroy() {
        this.overlayComponent.hide();
        this._onHide.complete();
        this.destroy$.next();
        this.destroy$.complete();
    }

    _animationStart() {
        this._closeOnInteraction = false;
    }

    _animationDone(event: TypedAnimationEvent): void {
        this._closeOnInteraction = true;

        // Note: If from state is void (this case can happen in some environments and that causes the tooltip to disappear instantly)
        // Note: We should check if the tooltip is coming from a valid state before handling event
        if (event.fromState === "void") {
            return;
        }

        // Note: We don't really understand why do we need this check
        if (this.isVisible()) {
            return;
        }

        // Note: If the current animation is already transitioning in false state
        if (event.toState !== false) {
            return;
        }

        this._onHide.next();
    }

    _handleBodyInteraction(): void {
        if (this._closeOnInteraction) {
            this.hide();
        }
    }

    /**
     * Marks that the tooltip needs to be checked in the next change detection run.
     * Mainly used for rendering the initial text before positioning a tooltip, which
     * can be problematic in components with OnPush change detection.
     */
    _markForCheck(): void {
        this._changeDetectorRef.markForCheck();
    }

    // this is initial overlay cfg that may me improved, didn't touch it not to break anything,- + added positions
    private updatePopupOverlayConfig() {
        const scrollableAncestors = this.scrollDispatcher.getAncestorScrollContainers(this.toggleReference);

        // Create connected position strategy that listens for scroll events to reposition.
        const strategy = this.overlay.position()
            .flexibleConnectedTo(this.toggleReference)
            .withTransformOriginOn(".nui-tooltip")
            .withFlexibleDimensions(false)
            .withViewportMargin(8)
            .withScrollableContainers(scrollableAncestors)
            .withPositions(this.possiblePositions);

        strategy.positionChanges.pipe(takeUntil(this.destroy$)).subscribe(change => {
            if (change.scrollableViewProperties.isOverlayClipped && this.isVisible()) {
                // After position changes occur and the overlay is clipped by
                // a parent scrollable then close the tooltip.
                this.ngZone.run(() => this.hide());
            }
        });
        this.overlayConfig = {
            positionStrategy: strategy,
            panelClass: TOOLTIP_PANEL_CLASS,
            scrollStrategy: this.overlay.scrollStrategies.reposition({autoClose: true}),
        };
        this._markForCheck();
    }
}
