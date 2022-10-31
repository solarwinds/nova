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
import { BehaviorSubject, EMPTY, merge, Subject, Subscription } from "rxjs";

import { DOCUMENT_CLICK_EVENT } from "../../constants/event.constants";
import { popoverConstants } from "../../constants/popover.constants";
import { EventBusService } from "../../services/event-bus.service";
import { UtilService } from "../../services/util.service";
import { OverlayComponent } from "../overlay/overlay-component/overlay.component";
import { OverlayUtilitiesService } from "../overlay/overlay-utilities.service";
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

// <example-url>./../examples/index.html#/popover</example-url>

@Component({
    selector: "nui-popover",
    host: { class: "nui-popover" },
    templateUrl: "./popover.component.html",
    styleUrls: ["./popover.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [PopoverPositionService],
})
export class PopoverComponent implements OnDestroy, OnInit, OnChanges {
    public static getHostView(
        componentInstance: ComponentRef<PopoverModalComponent>
    ) {
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
    private hidingAnimationInProgress = false;
    private positionStrategySubscriptions: Subscription[] = [];
    private overlayUtilitiesService: OverlayUtilitiesService =
        new OverlayUtilitiesService();
    private resizeObserver: ResizeObserver;

    @HostListener("click", ["$event"])
    public onClick(event: MouseEvent) {
        if (this.isTriggerPresent("click") && this.popover) {
            this.hidePopover();
        } else {
            this.onTrigger("click");
        }
        this.eventBusService
            .getStream({ id: DOCUMENT_CLICK_EVENT })
            .next(event);
        event.stopPropagation();
    }

    @HostListener("mouseenter")
    public onMouseEnter() {
        this.onTrigger("mouseenter");
        this.mouseEnterResolver();
    }

    @HostListener("mouseleave")
    public onMouseLeave() {
        this.onTrigger("mouseleave");
        this.mouseLeaveResolver();
    }

    @HostListener("focusin")
    public onFocusIn() {
        this.onTrigger("focus");
    }

    @HostListener("focusout")
    public onFocusOut() {
        if (!this.closePopover) {
            if (this.isTriggerPresent("focus") && !this.preventClosing) {
                this.hidePopover();
            }
        }
    }

    constructor(
        public host: ElementRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef,
        private overlay: Overlay,
        private cdRef: ChangeDetectorRef,
        private eventBusService: EventBusService,
        private popoverPositionService: PopoverPositionService
    ) {}

    public ngOnInit() {
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

    public ngOnDestroy() {
        if (this.mouseEnterTimeout) {
            clearTimeout(this.mouseEnterTimeout);
            this.mouseEnterTimeout = undefined;
        }

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

    public showPopover() {
        if (this.disabled) {
            return;
        }

        if (!_isNil(this.popover)) {
            this.cleanUp();
        }

        this.hidingAnimationInProgress = false;
        const factory = this.componentFactoryResolver.resolveComponentFactory(
            PopoverModalComponent
        );
        this.popover = this.modalContainer.createComponent(factory);
        this.initializePopover();
        this.setPositionStrategy(this.placement);
        this.overlayComponent.show();
        this.initializeResizeObserver();
        this.shown.emit();
        // Needs for proper initialization of content inside overlay
        this.cdRef.detectChanges();
    }

    /**
     * Updates the position of the popup based on its overlay's current position strategy.
     * This method is currently used in Charts by the ChartPopoverComponent.
     */
    public updatePosition() {
        this.overlayComponent?.getOverlayRef()?.updatePosition();
    }

    /**
     * Resets the size of the popover.
     */
    public resetSize() {
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
                if (this.mouseEnterTimeout) {
                    clearTimeout(this.mouseEnterTimeout);
                }
                this.mouseEnterTimeout = setTimeout(() => {
                    this.activatePopover();
                }, this.delay);
            } else {
                this.activatePopover();
            }
        }
    }

    private activatePopover() {
        this.eventBusService.getStream({ id: "close-popover" }).next();
        this.showPopover();
    }

    private initializePopover() {
        this.popoverModalSubscriptions = [];
        const closePopoverSubscription = merge(
            !this.preventClosing
                ? this.eventBusService.getStream({ id: "close-popover" })
                : EMPTY,
            this.closePopover || EMPTY
        ).subscribe(() => {
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
        this.popoverBeforeHiddenSubject = new Subject();
        this.popoverAfterHiddenSubject = new Subject();
        this.popoverModalEventSubject = new Subject();
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
                .getStream({ id: DOCUMENT_CLICK_EVENT })
                .subscribe((event: any) => {
                    const popoverModalNativeElement =
                        this.popover?.instance.elRef.nativeElement;
                    const eventPath = UtilService.getEventPath(event);
                    const clickInsidePopover = _includes(
                        eventPath,
                        popoverModalNativeElement
                    );
                    if (!clickInsidePopover) {
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
                            this.mouseLeaveResolver();
                            break;
                        case "mouse-enter":
                            this.mouseEnterResolver();
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
        this.popoverModalSubscriptions.forEach((sub) => {
            if (sub) {
                sub.unsubscribe();
            }
        });
        this.popover?.destroy();
        this.overlayComponent.hide();
        this.hidden.emit();
        this.popover = undefined;
    }

    private hidePopover() {
        if (!this.disabled) {
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
        if (this.mouseLeaveTimeout) {
            clearTimeout(this.mouseLeaveTimeout);
            this.mouseLeaveTimeout = undefined;
        }
    }

    private mouseLeaveResolver() {
        // if a cursor leaves both popover trigger and popover body - user has popoverConstants.mouseLeaveDelay ms
        // to return cursor to these elements. In case of using hover trigger it helps to ensure that popover won't close
        // when user moves their's cursor from popover trigger to popover body
        if (this.isTriggerPresent("mouseenter")) {
            this.mouseLeaveTimeout = setTimeout(() => {
                if (this.popover) {
                    this.hidePopover();
                    this.mouseLeaveTimeout = undefined;
                }
            }, popoverConstants.mouseLeaveDelay);

            if (this.mouseEnterTimeout) {
                clearTimeout(this.mouseEnterTimeout);
                this.mouseEnterTimeout = undefined;
            }
        }
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
