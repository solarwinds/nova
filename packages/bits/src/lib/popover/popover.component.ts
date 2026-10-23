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

import { InteractivityChecker } from "@angular/cdk/a11y";
import { hasModifierKey } from "@angular/cdk/keycodes";
import {
    ConnectedOverlayPositionChange,
    ConnectedPosition,
    Overlay,
    OverlayConfig,
} from "@angular/cdk/overlay";
import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    ContentChild,
    ElementRef,
    EmbeddedViewRef,
    EventEmitter,
    HostListener,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from "@angular/core";
import _includes from "lodash/includes";
import _isNil from "lodash/isNil";
import _isUndefined from "lodash/isUndefined";
import {
    BehaviorSubject,
    EMPTY,
    mergeWith,
    Observable,
    Subject,
    Subscription,
} from "rxjs";

import {
    PopoverModalComponent,
    PopoverModalEvents,
} from "./popover-modal.component";
import { IPopoverModalContext } from "./popover-modal.service";
import { PopoverPositionService } from "./popover-position.service";
import {
    PopoverOverlayPosition,
    PopoverPlacement,
    PopoverTrigger,
} from "./public-api";
import {
    CLOSE_POPOVER_EVENT,
    DOCUMENT_CLICK_EVENT,
} from "../../constants/event.constants";
import { KEYBOARD_CODE } from "../../constants/keycode.constants";
import { popoverConstants } from "../../constants/popover.constants";
import { EventBusService } from "../../services/event-bus.service";
import { UtilService } from "../../services/util.service";
import { OverlayComponent } from "../overlay/overlay-component/overlay.component";
import { OverlayUtilitiesService } from "../overlay/overlay-utilities.service";

// <example-url>./../examples/index.html#/popover</example-url>

@Component({
    selector: "nui-popover",
    host: { class: "nui-popover" },
    templateUrl: "./popover.component.html",
    styleUrls: ["./popover.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [PopoverPositionService],
    standalone: false,
})
export class PopoverComponent implements OnDestroy, OnInit, OnChanges {
    public static getHostView(
        componentInstance: ComponentRef<PopoverModalComponent>
    ): HTMLElement {
        return (componentInstance.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;
    }

    public displayed: boolean;
    /**
     * Popover listens to this stream and closes when the stream emits
     */
    @Input() closePopover: Subject<void>;
    /**
     * Popover listens to this stream and opens when the stream emits
     */
    @Input() openPopover: Subject<void>;
    /**
     * Should popover be disabled, which prevents it from showing
     */
    @Input() disabled: boolean = false;
    /**
     * Events that trigger the popover: 'click' | 'mouseenter' | 'mouseleave' | 'focus' | 'openPopoverSubject'
     */
    @Input() trigger: PopoverTrigger = "mouseenter";
    /**
     * TemplateRef instance that represents content of popover
     */
    @Input() template: TemplateRef<string>;
    /**
     * Placement of the popover: 'left' | 'right' | 'top' | 'bottom'
     */
    @Input() placement: PopoverPlacement = "right";
    /**
     * Title text of the popover. To prevent rendering of the popover's title section,
     * simply leave this attribute unspecified.
     */
    @Input() popoverTitle: string;
    /**
     * Name of icon to display
     */
    @Input() icon: string;
    /**
     * Enable modal mode (dark background)
     */
    @Input() modal = false;
    /**
     * Container for the popover
     */
    @Input() container: HTMLElement;
    /**
     * Specify whether the popover body has any padding.
     * Setting this to false will remove all padding from the popover body.
     */
    @Input() hasPadding = true;
    /**
     * Prevent closing popover when clicking itself.
     */
    @Input() preventClosing = false;
    /**
     * Specifies whether the default width and height constraints are in effect for the popover
     */
    @Input() unlimited = false;

    /**
     * Specifies the timeout in ms after which the tooltip is displayed
     */
    @Input() delay: number = 0;

    /**
     * Sets whether the overlay can grow after the initial open via flexible width/height.
     */
    @Input() withGrowAfterOpen: boolean = false;

    @Input() popoverOverlayPosition: PopoverOverlayPosition[];

    /**
     * Emits an event upon display of the popover
     */
    @Output() shown = new EventEmitter<any>();
    /**
     * Emits an event upon disappearance of the popover
     */
    @Output() hidden = new EventEmitter<any>();

    @ContentChild(TemplateRef) myTemplate: any;

    @ViewChild("renderContainer") renderContainer: TemplateRef<ElementRef>;

    @ViewChild("modalContainer", { read: ViewContainerRef })
    modalContainer: ViewContainerRef;

    @ViewChild(OverlayComponent) overlayComponent: OverlayComponent;

    public overlayConfig: OverlayConfig = { width: "auto" };
    public containerElementRef: ElementRef;

    private popover?: ComponentRef<PopoverModalComponent>;
    private position: any;
    private arrowMarginTop: any;
    // When this subject emits a value popover should be hidden
    private popoverDisplaySubject: BehaviorSubject<boolean>;
    // When hiding animation of popover starts this subject will trigger
    private popoverBeforeHiddenSubject: Subject<void>;
    // When hiding animation of popover ends this subject will trigger
    private popoverAfterHiddenSubject: Subject<void>;
    // Subject which is used by PopoverModalComponent to emit if something happened in PopoverModalComponent
    private popoverModalEventSubject: Subject<PopoverModalEvents>;
    private closePopoverSubscription: Subscription;
    private openPopoverSubscription: Subscription;
    private popoverModalSubscriptions: Array<Subscription>;
    private popoverOpenedProgrammatically: boolean = false;
    // See PopoverComponent.mouseLeaveResolver for details
    private mouseLeaveTimeout?: NodeJS.Timeout;
    private mouseEnterTimeout?: NodeJS.Timeout;
    private pendingEscapeListener?: (event: KeyboardEvent) => void;
    private popoverKeydownSubscription?: Subscription;
    private hidingAnimationInProgress = false;
    private triggerPointerActive = false;
    private popoverPointerActive = false;
    private triggerFocusActive = false;
    private popoverFocusActive = false;
    private suppressHoverReopenUntilExit = false;
    private suppressFocusReopenUntilExit = false;
    private focusReturnTarget?: HTMLElement;
    private positionStrategySubscriptions: Subscription[] = [];
    public host: ElementRef<HTMLElement> =
        inject<ElementRef<HTMLElement>>(ElementRef);
    private componentFactoryResolver = inject(ComponentFactoryResolver);
    private viewContainerRef = inject(ViewContainerRef);
    private overlay = inject(Overlay);
    private cdRef = inject(ChangeDetectorRef);
    private eventBusService = inject(EventBusService);
    private popoverPositionService = inject(PopoverPositionService);
    private readonly interactivityChecker = inject(InteractivityChecker);
    private overlayUtilitiesService: OverlayUtilitiesService =
        new OverlayUtilitiesService();
    private resizeObserver: ResizeObserver;

    @HostListener("click", ["$event"])
    public onClick(event: MouseEvent): void {
        if (this.isTriggerPresent("click") && this.isPopoverVisible()) {
            this.hidePopover();
        } else {
            this.onTrigger("click");
        }
        this.eventBusService.getStream(DOCUMENT_CLICK_EVENT).next(event);
        event.stopPropagation();
    }

    @HostListener("mouseenter")
    public onMouseEnter(): void {
        this.triggerPointerActive = this.isTriggerPresent("mouseenter");
        this.onTrigger("mouseenter");
        this.mouseEnterResolver();
    }

    @HostListener("mouseleave", ["$event"])
    public onMouseLeave(event?: MouseEvent): void {
        this.triggerPointerActive = false;
        if (
            event &&
            this.isNode(event.relatedTarget) &&
            this.isInsidePopover(event.relatedTarget)
        ) {
            this.popoverPointerActive = true;
        }
        this.onTrigger("mouseleave");
        this.mouseLeaveResolver();
        this.clearPassiveDismissalIfInactive();
    }

    @HostListener("focusin")
    public onFocusIn(): void {
        this.triggerFocusActive = true;
        const focusReturnTarget = this.getFocusableFocusOrigin();
        if (focusReturnTarget) {
            this.focusReturnTarget = focusReturnTarget;
        }
        this.onTrigger("focus");
    }

    @HostListener("focusout", ["$event"])
    public onFocusOut(event: FocusEvent): void {
        const relatedTarget = this.isNode(event.relatedTarget)
            ? event.relatedTarget
            : null;
        this.triggerFocusActive =
            !!relatedTarget && this.isInsideHost(relatedTarget);
        this.popoverFocusActive =
            !!relatedTarget && this.isInsidePopover(relatedTarget);
        this.clearPassiveDismissalIfInactive();

        if (
            !this.closePopover &&
            this.isTriggerPresent("focus") &&
            !this.preventClosing &&
            !this.isInsideHostOrPopover(relatedTarget)
        ) {
            this.closeIfNoPassiveTriggerIsActive();
        }
    }

    @HostListener("keydown", ["$event"])
    public onKeydown(event: KeyboardEvent): void {
        if (event.defaultPrevented) {
            return;
        }
        this.handleEscapeKeydown(event);
        if (!event.defaultPrevented) {
            this.handleTriggerTabKeydown(event);
        }
    }

    public ngOnInit(): void {
        if (this.container) {
            this.containerElementRef = new ElementRef(this.container);
        }
        if (this.modal) {
            this.overlayConfig = {
                ...this.overlayConfig,
                backdropClass: "modal-backdrop",
                hasBackdrop: true,
            };
        }
        if (!this.overlayConfig?.positionStrategy) {
            this.setPositionStrategy(this.placement);
        }
        if (this.openPopover && this.isTriggerPresent("openPopoverSubject")) {
            this.openPopoverSubscription = this.openPopover.subscribe(() => {
                this.popoverOpenedProgrammatically = true;
                this.showPopover();
            });
        }
        this.overlayConfig = {
            ...this.overlayConfig,
            panelClass: "nui-popover-overlay",
        };
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.placement) {
            this.setPositionStrategy(changes.placement.currentValue);
        }
    }

    public ngOnDestroy(): void {
        this.clearMouseEnterTimeout();
        this.clearMouseLeaveTimeout();

        if (this.popover) {
            this.cleanUp();
        }

        if (this.closePopoverSubscription) {
            this.closePopoverSubscription.unsubscribe();
        }

        if (this.openPopoverSubscription) {
            this.openPopoverSubscription.unsubscribe();
        }

        this.clearPositionStrategySubscriptions();
    }

    public onBackdropClick(): void {
        if (this.modal) {
            this.popoverModalEventSubject.next("backdrop-click");
        }
    }

    public showPopover(): void {
        if (this.disabled) {
            return;
        }

        this.suppressHoverReopenUntilExit = false;
        this.suppressFocusReopenUntilExit = false;
        this.clearMouseEnterTimeout();
        this.clearMouseLeaveTimeout();

        if (!_isNil(this.popover)) {
            this.cleanUp();
        }

        this.hidingAnimationInProgress = false;
        this.focusReturnTarget = this.getFocusableFocusOrigin();
        const factory = this.componentFactoryResolver.resolveComponentFactory(
            PopoverModalComponent
        );
        this.popover = this.modalContainer.createComponent(factory);
        this.initializePopover();
        this.setPositionStrategy(this.placement);
        this.overlayComponent.show();
        this.popoverKeydownSubscription = this.overlayComponent
            .getOverlayRef()
            .keydownEvents()
            .subscribe(event => {
                this.handleEscapeKeydown(event);
                if (!event.defaultPrevented) {
                    this.handlePopoverTabKeydown(event);
                }
            });
        this.popoverModalSubscriptions.push(this.popoverKeydownSubscription);
        this.initializeResizeObserver();
        this.shown.emit();
        // Needs for proper initialization of content inside overlay
        this.cdRef.detectChanges();
    }

    /**
     * Updates the position of the popup based on its overlay's current position strategy.
     * This method is currently used in Charts by the ChartPopoverComponent.
     */
    public updatePosition(): void {
        this.overlayComponent?.getOverlayRef()?.updatePosition();
    }

    /**
     * Resets the size of the popover.
     */
    public resetSize(): void {
        // This is set to undefined so that angular cdk will set the height and width automatically
        this.overlayComponent?.getOverlayRef()?.updateSize({
            height: undefined,
            width: undefined,
        });
    }

    private onTrigger(triggerType: PopoverTrigger) {
        if (this.isTriggerPresent(triggerType)) {
            if (
                this.delay > 0 &&
                triggerType === "mouseenter" &&
                this.isTriggerPresent("mouseenter")
            ) {
                if (this.suppressHoverReopenUntilExit) {
                    return;
                }
                this.clearMouseEnterTimeout();
                // Debounce configured hover activation; leaving the trigger or pressing Escape
                // cancels the pending open.
                this.mouseEnterTimeout = setTimeout(() => {
                    this.mouseEnterTimeout = undefined;
                    this.removePendingEscapeListener();
                    this.activatePopover("mouseenter");
                }, this.delay);
                this.addPendingEscapeListener();
            } else {
                this.activatePopover(triggerType);
            }
        }
    }

    private activatePopover(triggerType: PopoverTrigger) {
        const isPassiveTrigger =
            triggerType === "mouseenter" || triggerType === "focus";
        if (this.isPassiveTriggerSuppressed(triggerType)) {
            return;
        }
        if (!isPassiveTrigger) {
            this.suppressHoverReopenUntilExit = false;
            this.suppressFocusReopenUntilExit = false;
        }
        if (this.isPopoverVisible()) {
            return;
        }

        this.eventBusService.getStream(CLOSE_POPOVER_EVENT).next();
        this.showPopover();
    }

    private initializePopover() {
        this.popoverModalSubscriptions = [];
        const closePopoverEvents: Observable<void> = !this.preventClosing
            ? this.eventBusService.getStream(CLOSE_POPOVER_EVENT)
            : EMPTY;
        const closePopoverSubscription = closePopoverEvents
            .pipe(mergeWith(this.closePopover || EMPTY))
            .subscribe(() => {
                this.hidePopover();
            });

        if (!this.popover) {
            throw new Error("PopoverModalComponent is undefined");
        }

        this.popover.instance.context = this.getContext();
        this.popover.instance.template = this.template;
        this.popover.instance.hostElement =
            this.viewContainerRef.element.nativeElement;
        this.popover.instance.unlimited = this.unlimited;
        this.popover.instance.placement = this.placement;
        this.popoverDisplaySubject = new BehaviorSubject<boolean>(true);
        this.popoverBeforeHiddenSubject = new Subject<void>();
        this.popoverAfterHiddenSubject = new Subject<void>();
        this.popoverModalEventSubject = new Subject<PopoverModalEvents>();
        this.popover.instance.popoverBeforeHiddenSubject =
            this.popoverBeforeHiddenSubject;
        this.popover.instance.popoverAfterHiddenSubject =
            this.popoverAfterHiddenSubject;
        this.popover.instance.popoverModalEventSubject =
            this.popoverModalEventSubject;
        const popoverBeforeHiddenSubscription =
            this.popoverBeforeHiddenSubject.subscribe(() => {
                this.hidingAnimationInProgress = true;
            });
        const popoverAfterHiddenSubscription =
            this.popoverAfterHiddenSubject.subscribe(() => {
                if (this.hidingAnimationInProgress) {
                    this.cleanUp();
                    this.hidingAnimationInProgress = false;
                }
            });

        if (this.isTriggerPresent("click") && !this.preventClosing) {
            const documentClickSubscription = this.eventBusService
                .getStream(DOCUMENT_CLICK_EVENT)
                .subscribe((event: any) => {
                    const popoverModalNativeElement =
                        this.popover?.instance.elRef.nativeElement;
                    const eventPath = UtilService.getEventPath(event);
                    const clickInsidePopover = _includes(
                        eventPath,
                        popoverModalNativeElement
                    );
                    const clickInsideTrigger = _includes(
                        eventPath,
                        this.host.nativeElement
                    );
                    if (!clickInsidePopover && !clickInsideTrigger) {
                        this.popoverOpenedProgrammatically
                            ? (this.popoverOpenedProgrammatically = false)
                            : this.hidePopover();
                    }
                });
            this.popoverModalSubscriptions.push(documentClickSubscription);
        }
        const popoverModalEventSubscription =
            this.popoverModalEventSubject.subscribe(
                (reason: PopoverModalEvents) => {
                    switch (reason) {
                        case "backdrop-click":
                        case "outside-click":
                            if (!this.preventClosing) {
                                this.hidePopover();
                            }
                            break;
                        case "mouse-leave":
                            this.popoverPointerActive = false;
                            this.mouseLeaveResolver();
                            this.clearPassiveDismissalIfInactive();
                            break;
                        case "mouse-enter":
                            this.popoverPointerActive = true;
                            this.mouseEnterResolver();
                            break;
                        case "focus-enter":
                            this.popoverFocusActive = true;
                            break;
                        case "focus-leave-trigger":
                            this.popoverFocusActive = false;
                            this.triggerFocusActive = true;
                            this.clearPassiveDismissalIfInactive();
                            break;
                        case "focus-leave":
                            this.popoverFocusActive = false;
                            this.triggerFocusActive = false;
                            this.clearPassiveDismissalIfInactive();
                            if (
                                !this.closePopover &&
                                this.isTriggerPresent("focus") &&
                                !this.preventClosing
                            ) {
                                this.closeIfNoPassiveTriggerIsActive();
                            }
                            break;
                    }
                }
            );
        this.popoverModalSubscriptions.push(
            popoverModalEventSubscription,
            popoverBeforeHiddenSubscription,
            popoverAfterHiddenSubscription,
            closePopoverSubscription
        );
        this.popover.instance.displayChange = this.popoverDisplaySubject;
        this.popover.instance.backdrop = this.modal;
        this.popover.instance.hasPadding = _isUndefined(this.hasPadding)
            ? true
            : this.hasPadding;
    }

    private cleanUp() {
        this.resizeObserver?.disconnect();
        this.popoverModalSubscriptions.forEach(sub => {
            if (sub) {
                sub.unsubscribe();
            }
        });
        this.popover?.destroy();
        this.overlayComponent.hide();
        this.popoverKeydownSubscription = undefined;
        this.hidden.emit();
        this.popover = undefined;
        this.popoverPointerActive = false;
        this.popoverFocusActive = false;
        this.clearPassiveDismissalIfInactive();
    }

    private hidePopover() {
        this.clearMouseEnterTimeout();
        this.clearMouseLeaveTimeout();
        if (!this.disabled && this.isPopoverVisible()) {
            this.popoverKeydownSubscription?.unsubscribe();
            this.popoverDisplaySubject.next(false);
        }
    }

    private getContext(): IPopoverModalContext {
        return {
            placement: this.placement,
            arrowMarginTop: this.arrowMarginTop,
            popoverPosition: this.position,
            icon: this.getIcon(),
            title: this.popoverTitle,
        };
    }

    private mouseEnterResolver() {
        this.clearMouseLeaveTimeout();
    }

    private mouseLeaveResolver() {
        // if a cursor leaves both popover trigger and popover body - user has popoverConstants.mouseLeaveDelay ms
        // to return cursor to these elements. In case of using hover trigger it helps to ensure that popover won't close
        // when user moves their's cursor from popover trigger to popover body
        if (this.isTriggerPresent("mouseenter")) {
            this.clearMouseLeaveTimeout();
            this.mouseLeaveTimeout = setTimeout(() => {
                this.mouseLeaveTimeout = undefined;
                this.clearPassiveDismissalIfInactive();
                if (this.isPopoverVisible()) {
                    this.closeIfNoPassiveTriggerIsActive();
                }
            }, popoverConstants.mouseLeaveDelay);

            this.clearMouseEnterTimeout();
        }
    }

    private closeIfNoPassiveTriggerIsActive(): void {
        if (!this.hasActivePassiveTrigger()) {
            this.hidePopover();
        }
    }

    private hasActivePassiveTrigger(): boolean {
        return this.isHoverTriggerActive() || this.isFocusTriggerActive();
    }

    private clearPassiveDismissalIfInactive(): void {
        if (!this.isHoverTriggerActive()) {
            this.suppressHoverReopenUntilExit = false;
        }
        if (!this.isFocusTriggerActive()) {
            this.suppressFocusReopenUntilExit = false;
        }
    }

    private isHoverTriggerActive(): boolean {
        return (
            this.isTriggerPresent("mouseenter") &&
            (this.triggerPointerActive || this.popoverPointerActive)
        );
    }

    private isFocusTriggerActive(): boolean {
        return (
            this.isTriggerPresent("focus") &&
            (this.triggerFocusActive || this.popoverFocusActive)
        );
    }

    private isPassiveTriggerSuppressed(triggerType: PopoverTrigger): boolean {
        return (
            (triggerType === "mouseenter" &&
                this.suppressHoverReopenUntilExit) ||
            (triggerType === "focus" && this.suppressFocusReopenUntilExit)
        );
    }

    private isPopoverVisible(): boolean {
        return !!this.popover && this.popoverDisplaySubject?.value === true;
    }

    private isUnmodifiedEscape(event: KeyboardEvent): boolean {
        return (
            (event.key === KEYBOARD_CODE.ESCAPE ||
                event.code === KEYBOARD_CODE.ESCAPE) &&
            !hasModifierKey(event)
        );
    }

    private handleEscapeKeydown(event: KeyboardEvent): void {
        if (event.defaultPrevented || !this.isUnmodifiedEscape(event)) {
            return;
        }

        if (this.disabled) {
            return;
        }

        if (!this.isPopoverVisible()) {
            return;
        }

        const activeElement =
            this.host.nativeElement.ownerDocument.activeElement;
        const shouldRestoreFocus =
            !!activeElement && this.isInsidePopover(activeElement);
        const focusTarget = this.getSafeFocusReturnTarget();

        this.suppressHoverReopenUntilExit = this.isHoverTriggerActive();
        this.suppressFocusReopenUntilExit = this.isFocusTriggerActive();
        this.hidePopover();

        if (shouldRestoreFocus && focusTarget) {
            focusTarget.focus({ preventScroll: true });
        }

        event.preventDefault();
        event.stopPropagation();
    }

    private handleTriggerTabKeydown(event: KeyboardEvent): void {
        if (
            event.defaultPrevented ||
            event.shiftKey ||
            !this.isTabNavigationKey(event) ||
            !this.isPopoverVisible() ||
            this.disabled ||
            !this.isNode(event.target) ||
            !this.isInsideHost(event.target) ||
            this.isInsidePopover(event.target)
        ) {
            return;
        }

        const ownerDocument: Document = this.host.nativeElement.ownerDocument;
        const HTMLElementConstructor = ownerDocument.defaultView?.HTMLElement;
        const activeElement = ownerDocument.activeElement;
        if (
            !HTMLElementConstructor ||
            !(activeElement instanceof HTMLElementConstructor) ||
            !this.isInsideHost(activeElement)
        ) {
            return;
        }

        const hostTabStops = this.getTabbableElements(this.host.nativeElement);
        if (hostTabStops[hostTabStops.length - 1] !== activeElement) {
            return;
        }

        const popoverElement = this.popover?.instance.elRef.nativeElement;
        const popoverTabStops = popoverElement
            ? this.getTabbableElements(popoverElement)
            : [];
        const firstPopoverTabStop = popoverTabStops[0];
        if (!firstPopoverTabStop) {
            return;
        }

        firstPopoverTabStop.focus();
        event.preventDefault();
    }

    private handlePopoverTabKeydown(event: KeyboardEvent): void {
        if (
            event.defaultPrevented ||
            !this.isTabNavigationKey(event) ||
            !this.isNode(event.target) ||
            !this.isInsidePopover(event.target)
        ) {
            return;
        }

        const ownerDocument: Document = this.host.nativeElement.ownerDocument;
        const HTMLElementConstructor = ownerDocument.defaultView?.HTMLElement;
        const activeElement = ownerDocument.activeElement;
        const popoverElement = this.popover?.instance.elRef.nativeElement;
        if (
            !HTMLElementConstructor ||
            !(activeElement instanceof HTMLElementConstructor) ||
            !popoverElement
        ) {
            return;
        }

        const popoverTabStops = this.getTabbableElements(popoverElement);
        const focusTarget = this.getSafeFocusReturnTarget();
        if (!focusTarget || popoverTabStops.length === 0) {
            return;
        }

        if (event.shiftKey && popoverTabStops[0] === activeElement) {
            focusTarget.focus();
            event.preventDefault();
        } else if (
            !event.shiftKey &&
            popoverTabStops[popoverTabStops.length - 1] === activeElement
        ) {
            // Let the browser perform its native Tab action from the trigger.
            // This preserves the trigger's normal place in the page tab order.
            focusTarget.focus();
        }
    }

    private isTabNavigationKey(event: KeyboardEvent): boolean {
        return (
            (event.key === KEYBOARD_CODE.TAB ||
                event.code === KEYBOARD_CODE.TAB) &&
            !event.altKey &&
            !event.ctrlKey &&
            !event.metaKey
        );
    }

    private getTabbableElements(root: HTMLElement): HTMLElement[] {
        const elements = [
            root,
            ...Array.from(root.querySelectorAll<HTMLElement>("*")),
        ];
        return elements
            .filter(
                element =>
                    this.interactivityChecker.isFocusable(element) &&
                    this.interactivityChecker.isTabbable(element)
            )
            .sort((first, second) => {
                if (first.tabIndex > 0 && second.tabIndex > 0) {
                    return first.tabIndex - second.tabIndex;
                }
                if (first.tabIndex > 0) {
                    return -1;
                }
                if (second.tabIndex > 0) {
                    return 1;
                }
                return 0;
            });
    }

    private getSafeFocusReturnTarget(): HTMLElement | undefined {
        const focusTarget = this.focusReturnTarget;
        const ownerDocument: Document = this.host.nativeElement.ownerDocument;
        return focusTarget &&
            focusTarget.isConnected &&
            focusTarget.ownerDocument === ownerDocument &&
            this.isInsideHost(focusTarget) &&
            this.interactivityChecker.isFocusable(focusTarget)
            ? focusTarget
            : undefined;
    }

    private addPendingEscapeListener(): void {
        if (this.pendingEscapeListener) {
            return;
        }

        const ownerDocument: Document = this.host.nativeElement.ownerDocument;
        this.pendingEscapeListener = (event: KeyboardEvent) => {
            if (!event.defaultPrevented && this.isUnmodifiedEscape(event)) {
                this.suppressHoverReopenUntilExit = this.isHoverTriggerActive();
                this.clearMouseEnterTimeout();
            }
        };
        ownerDocument.addEventListener(
            "keydown",
            this.pendingEscapeListener,
            true
        );
    }

    private removePendingEscapeListener(): void {
        if (!this.pendingEscapeListener) {
            return;
        }
        const ownerDocument: Document = this.host.nativeElement.ownerDocument;
        ownerDocument.removeEventListener(
            "keydown",
            this.pendingEscapeListener,
            true
        );
        this.pendingEscapeListener = undefined;
    }

    private clearMouseEnterTimeout(): void {
        if (this.mouseEnterTimeout !== undefined) {
            clearTimeout(this.mouseEnterTimeout);
            this.mouseEnterTimeout = undefined;
        }
        this.removePendingEscapeListener();
    }

    private clearMouseLeaveTimeout(): void {
        if (this.mouseLeaveTimeout !== undefined) {
            clearTimeout(this.mouseLeaveTimeout);
            this.mouseLeaveTimeout = undefined;
        }
    }

    private isNode(target: EventTarget | null): target is Node {
        const NodeConstructor =
            this.host.nativeElement.ownerDocument.defaultView?.Node;
        return !!NodeConstructor && target instanceof NodeConstructor;
    }

    private isInsideHost(target: Node): boolean {
        return this.host.nativeElement.contains(target);
    }

    private isInsidePopover(target: Node): boolean {
        const popoverElement = this.popover?.instance.elRef.nativeElement;
        return !!popoverElement && popoverElement.contains(target);
    }

    private isInsideHostOrPopover(target: Node | null): boolean {
        return (
            !!target &&
            (this.isInsideHost(target) || this.isInsidePopover(target))
        );
    }

    private getFocusableFocusOrigin(): HTMLElement | undefined {
        const ownerDocument: Document = this.host.nativeElement.ownerDocument;
        const activeElement = ownerDocument.activeElement;
        const HTMLElementConstructor = ownerDocument.defaultView?.HTMLElement;
        if (
            HTMLElementConstructor &&
            activeElement instanceof HTMLElementConstructor &&
            this.isInsideHost(activeElement) &&
            this.interactivityChecker.isFocusable(activeElement)
        ) {
            return activeElement;
        }

        const hostElement = this.host.nativeElement;
        if (
            HTMLElementConstructor &&
            hostElement instanceof HTMLElementConstructor &&
            this.interactivityChecker.isFocusable(hostElement)
        ) {
            return hostElement;
        }

        return undefined;
    }

    private isTriggerPresent(valueToCompare: string): boolean {
        return this.trigger.split(" ").indexOf(valueToCompare) !== -1;
    }

    private getIcon(): string {
        return this.icon;
    }

    private setPositionStrategy(position: PopoverPlacement): void {
        const positionStrategy = this.overlay
            .position()
            .flexibleConnectedTo(this.host.nativeElement)
            .withPush(false)
            .withViewportMargin(0)
            .withGrowAfterOpen(this.withGrowAfterOpen)
            .withPositions(this.getPopoverConnectedPosition(position));

        const subscription = positionStrategy.positionChanges.subscribe(
            (connectedPosition: ConnectedOverlayPositionChange) => {
                const overlayRefElement =
                    this.overlayComponent.getOverlayRef().overlayElement;
                const elRefHeight = (
                    this.host.nativeElement as HTMLElement
                ).getBoundingClientRect().height;
                const panelClass = connectedPosition.connectionPair.panelClass;
                if (!panelClass) {
                    return;
                }
                this.popoverPositionService.setPopoverOffset(
                    panelClass,
                    elRefHeight,
                    overlayRefElement
                );
            }
        );
        this.positionStrategySubscriptions.push(subscription);

        this.overlayConfig = { ...this.overlayConfig, positionStrategy };
    }

    private getPopoverConnectedPosition(
        position: PopoverPlacement
    ): ConnectedPosition[] {
        this.popoverPositionService = new PopoverPositionService();

        if (this.popoverOverlayPosition) {
            return this.popoverPositionService.getConnectedPositions(
                this.popoverOverlayPosition
            );
        }

        return this.popoverPositionService.possiblePositionsForPlacement(
            position
        );
    }

    private clearPositionStrategySubscriptions() {
        for (const sub of this.positionStrategySubscriptions) {
            sub.unsubscribe();
        }
    }

    private initializeResizeObserver(): void {
        this.resizeObserver = this.overlayUtilitiesService
            .setPopupComponent(this.overlayComponent)
            .getResizeObserver();
        this.resizeObserver.observe(
            this.overlayComponent.getOverlayRef().overlayElement
        );
    }
}
