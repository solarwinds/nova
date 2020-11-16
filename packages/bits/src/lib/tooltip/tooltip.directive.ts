import { AriaDescriber, FocusMonitor } from "@angular/cdk/a11y";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ESCAPE, hasModifierKey } from "@angular/cdk/keycodes";
import {
    ComponentFactoryResolver,
    Directive,
    ElementRef,
    Input,
    NgZone,
    OnDestroy,
    ViewContainerRef
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { OverlayPositionService } from "../overlay/overlay-position.service";
import { OverlayPlacement } from "../overlay/types";

import { TooltipPosition } from "./public-api";
import { TooltipComponent } from "./tooltip.component";

/**
 * <example-url>./../examples/index.html#/tooltip</example-url>
 *
 * @dynamic
 */

@Directive({
    selector: "[nuiTooltip]",
    exportAs: "nuiTooltip",
    host: {
        "(longpress)": "show()",
        "(keydown)": "_handleKeydown($event)",
        "(touchend)": "_handleTouchend()",
    },
    providers: [OverlayPositionService],
})
export class TooltipDirective implements OnDestroy {
    _tooltipInstance?: TooltipComponent;

    private _position: TooltipPosition = "top";
    private _disabled: boolean = false;

    /** Allows the user to define the position of the tooltip relative to the parent element */
    @Input("tooltipPlacement")
    get position(): TooltipPosition { return this._position; }
    set position(value: TooltipPosition) {
        if (value !== this._position) {
            this._position = value;
            this.updateOverlayPositions();
        }
    }

    /** Disables the display of the tooltip. */
    @Input("nuiTooltipDisabled")
    get disabled(): boolean { return this._disabled; }
    set disabled(value) {
        this._disabled = coerceBooleanProperty(value);

        // If tooltip is disabled, hide immediately.
        if (this._disabled) {
            this.hide();
        }
    }

    private _message = "";

    /** The message to be displayed in the tooltip */
    @Input("nuiTooltip")
    get message() { return this._message; }
    set message(value: string) {
        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this._message);

        // If the message is not a string (e.g. number), convert it to a string and trim it.
        this._message = value != null ? `${value}`.trim() : "";

        if (!this._message && this._isTooltipVisible()) {
            this.hide();
        } else {
            this._updateTooltipMessage();
            this._ariaDescriber.describe(this._elementRef.nativeElement, this.message);
        }
    }

    private _manualListeners = new Map<string, EventListenerOrEventListenerObject>();

    /** Emits when the component is destroyed. */
    private readonly _destroyed = new Subject<void>();

    constructor(
        private _elementRef: ElementRef<HTMLElement>,
        private _viewContainerRef: ViewContainerRef,
        private _ngZone: NgZone,
        private _ariaDescriber: AriaDescriber,
        private _focusMonitor: FocusMonitor,
        private resolver: ComponentFactoryResolver,
        private overlayPositionService: OverlayPositionService
    ) {
        this.overlayPositionService.setOverlayPositionConfig({
            arrowSize: 10,
            arrowPadding: 0,
        });
        const element: HTMLElement = _elementRef.nativeElement;

        this._manualListeners
            .set("mouseenter", () => this.show())
            .set("mouseleave", () => this.hide());

        this._manualListeners.forEach((listener, event) => element.addEventListener(event, listener));

        _focusMonitor.monitor(_elementRef).pipe(takeUntil(this._destroyed)).subscribe(origin => {
            // Note that the focus monitor runs outside the Angular zone.
            if (!origin) {
                _ngZone.run(() => this.hide());
            } else if (origin === "keyboard") {
                _ngZone.run(() => this.show());
            }
        });
    }

    /**
     * Dispose the tooltip when destroyed.
     */
    ngOnDestroy() {
        if (this._tooltipInstance) {
            this._tooltipInstance = undefined;
        }

        // Clean up the event listeners set in the constructor
        this._manualListeners.forEach((listener, event) => {
            this._elementRef.nativeElement.removeEventListener(event, listener);
        });
        this._manualListeners.clear();

        this._destroyed.next();
        this._destroyed.complete();

        this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this.message);
        this._focusMonitor.stopMonitoring(this._elementRef);
    }

    /** Shows the tooltip if not disabled or empty */
    show(): void {
        if (!this.canShowTooltip()) {
            return;
        }

        if (!this._tooltipInstance) {
            this.createTooltipComponent();
            this._updateTooltipMessage();

            // wait till overlay view init
            setTimeout(() => {
                // added this check here, because of the manual-trigger-example in docs.
                // "Disabled" attribute is set after 1st "show" is triggered and it should hide the tooltip.
                // That's why inside setTimeout operation there's one more check if it's disabled.
                if (!this.canShowTooltip()) { return; }
                this._tooltipInstance?.show();
            });
        } else {
            this._tooltipInstance?.show();
        }
    }

    /** Hides the tooltip */
    hide(): void {
        // without setTimeout, sometimes 'hide' is called before 'show', because show has setTimeout for it's own reasons.
        setTimeout(() => this._tooltipInstance?.hide());
    }

    /** Shows/hides the tooltip */
    toggle(): void {
        this._isTooltipVisible() ? this.hide() : this.show();
    }

    /** Returns true if the tooltip is currently visible to the user */
    _isTooltipVisible(): boolean {
        return !!this._tooltipInstance && this._tooltipInstance.isVisible();
    }

    /** Handles the keydown events on the host element. */
    _handleKeydown(e: KeyboardEvent) {
        if (this._isTooltipVisible() && e.keyCode === ESCAPE && !hasModifierKey(e)) {
            e.preventDefault();
            e.stopPropagation();
            this.hide();
        }
    }

    /** Handles the touchend events on the host element. */
    _handleTouchend() {
        this.hide();
    }

    private createTooltipComponent() {
        const componentFactory = this.resolver.resolveComponentFactory(TooltipComponent);
        const tooltipComponentRef = this._viewContainerRef.createComponent(componentFactory);
        this._tooltipInstance = tooltipComponentRef.instance;
        this._tooltipInstance.toggleReference = this._elementRef;
        this._tooltipInstance.possiblePositions = this.overlayPositionService.getPossiblePositionsForPlacement(this.position as OverlayPlacement);
    }

    private updateOverlayPositions() {
        if (!this._tooltipInstance) { return; }

        const possiblePositions = this.overlayPositionService.getPossiblePositionsForPlacement(this.position as OverlayPlacement);
        this._tooltipInstance.updatePossiblePositions(possiblePositions);
    }

    /** Updates the tooltip message and repositions the overlay according to the new message length */
    private _updateTooltipMessage() {
        if (this._tooltipInstance) {
            this._tooltipInstance.message = this.message;
        }
    }

    private canShowTooltip() {
        return !(this.disabled || !this.message || this._isTooltipVisible());
    }
}

