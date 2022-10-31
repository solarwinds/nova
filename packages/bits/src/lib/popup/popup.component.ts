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
    AfterContentInit,
    ApplicationRef,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    ContentChild,
    ElementRef,
    EmbeddedViewRef,
    EventEmitter,
    Injector,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import _isUndefined from "lodash/isUndefined";
import { Subject, Subscription } from "rxjs";

import { DOCUMENT_CLICK_EVENT } from "../../constants/event.constants";
import { EdgeDetectionService } from "../../services/edge-detection.service";
import { EventBusService } from "../../services/event-bus.service";
import { LoggerService } from "../../services/log-service";
import { PopupContainerComponent } from "./popup-container.component";
import { PopupContainerService } from "./popup-container.service";
import { PopupToggleDirective } from "./popup-toggle.directive";

// <example-url>./../examples/index.html#/popup</example-url>
/**
 * @deprecated in v11 - Use PopupComponent instead - Removal: NUI-5796
 */
/**
 * __Name :__
 * NUI Pop-up component.
 *
 * __Usage :__
 * Component represents basic functionality for dropdowns, popups, etc.
 * May be used directly. Use "nuiPopupToggle" attribute inside any layer of content
 * to define element that will toggle popover. Use "popupAreaContent" attribute inside
 * 1st layer of content to define "popup area". DO NOT USE "opened" WITH "nuiPopupToggle".
 * IT IS NEEDED TO CHOOSE ONE.
 */
/* eslint-disable @angular-eslint/no-host-metadata-property */
@Component({
    selector: "nui-popup-deprecated",
    host: {
        class: "nui-popup",
        role: "dialog",
        "[attr.aria-label]": "ariaLabel",
    },
    template: `
        <div
            class="nui-popup-container"
            [class.nui-popup--opened]="isOpen"
            nuiClickInterceptor
        >
            <div class="nui-popup__content">
                <ng-content></ng-content>
            </div>
            <div
                #popupArea
                class="nui-popup__area {{ contextClass }}"
                [style.width]="width"
                [class.nui-popup__area--visible]="visible"
                [class.nui-popup__area--top]="_directionTop && !appendToBody"
                [class.nui-popup__area--right]="
                    _directionRight && !appendToBody
                "
            >
                <div
                    #popupAreaContainer
                    tabindex="-1"
                    class="nui-popup__area--container"
                >
                    <ng-content select="[popupAreaContent]"></ng-content>
                </div>
            </div>
        </div>
    `,
    styleUrls: ["./popup.component.less"],
    encapsulation: ViewEncapsulation.None,
})
/* eslint-disable @angular-eslint/no-host-metadata-property */
export class PopupDeprecatedComponent
    implements AfterContentInit, OnDestroy, OnInit
{
    @Input() width: string;
    /**
     * If additional styles should be applied to popup
     */
    @Input() contextClass: string;
    /**
     * Allows popup box to be attached to document.body
     */
    @Input()
    public appendToBody: boolean;
    @Input()
    public isOpen = false;
    @Input()
    public manualOpenControl: Subject<MouseEvent>;
    /**
     * Defines in which direction popup area will be opened.
     */
    @Input()
    public directionTop: boolean;
    /**
     * Parent css element class used determining of popup direction to top.
     */
    @Input()
    public directionRight: boolean;
    /**
     * Parent css element class used determining of popup direction to right.
     */
    @Input()
    public baseElementSelector: string;

    @Input()
    public ariaLabel: string = "Popup";

    @Output()
    public opened = new EventEmitter<boolean>();

    @ContentChild(PopupToggleDirective)
    public popupToggle: PopupToggleDirective;
    @ViewChild("popupAreaContainer")
    public popupAreaContainer: ElementRef;

    @ViewChild("popupArea", { static: true })
    public popupAreaContent: ElementRef;

    private popupSubscriptions: Subscription[] = [];
    private lastEventType: string;
    private _popupInstance?: ComponentRef<PopupContainerComponent>;

    public get popupInstance():
        | ComponentRef<PopupContainerComponent>
        | undefined {
        return this._popupInstance;
    }
    /** @ignore */
    public _directionRight: boolean;
    /** @ignore */
    public _directionTop: boolean;
    /**
     * switches visibility of popup area
     */
    public visible = false;

    constructor(
        private elementRef: ElementRef,
        private edgeDetector: EdgeDetectionService,
        private changeDetectorRef: ChangeDetectorRef,
        private eventBusService: EventBusService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private appRef: ApplicationRef,
        private logger: LoggerService,
        @Optional() private popupContainer: PopupContainerService
    ) {
        this.logger.warn(
            "<nui-popup-deprecated> is deprecated as of Nova v11. Please use <nui-popup> instead."
        );
    }
    public ngOnInit() {
        if (this.manualOpenControl) {
            this.popupSubscriptions.push(
                this.manualOpenControl.subscribe((event) => {
                    this.toggleOpened(event);
                })
            );
        }
        this.popupSubscriptions.push(
            this.eventBusService
                .getStream({ id: DOCUMENT_CLICK_EVENT })
                .subscribe((event: MouseEvent) => {
                    if (this.isOpen) {
                        this.closePopup(event);
                    }
                })
        );

        // This is needed to make the isOpen @Input work.
        this.visible = this.isOpen;
    }

    public ngAfterContentInit(): void {
        this.setPopupPosition();

        if (!this.popupToggle) {
            return;
        }

        this.popupSubscriptions.push(
            this.popupToggle.toggle.subscribe((event: Event) => {
                this.toggleOpened(event);
            })
        );
    }

    public toggleOpened(event: Event): void {
        this.visible = false;
        let emit = true;
        if (event) {
            // since click triggers focusin event, we need to prevent popup from closing
            // when focus on the input is gained via click
            if (this.lastEventType === "focusin" && event.type === "click") {
                emit = false;
            }

            // if popup is already closed, prevent it from opening on focusout
            if (event.type === "focusout" && !this.isOpen) {
                emit = false;
            }

            this.lastEventType = event.type;
        }
        if (emit) {
            this.isOpen = !this.isOpen;
            this.changeDetectorRef.detectChanges();
            this.changeDetectorRef.detach();
            if (this.isOpen) {
                if (!this._popupInstance && this.appendToBody) {
                    const popupContainerFactory =
                        this.componentFactoryResolver.resolveComponentFactory(
                            PopupContainerComponent
                        );
                    this._popupInstance = popupContainerFactory.create(
                        this.injector,
                        [[this.popupAreaContent.nativeElement]]
                    );
                    this._popupInstance.instance.hostElement =
                        this.popupToggle.host.nativeElement;
                    this.appRef.attachView(this._popupInstance.hostView);
                    const hostElement = (
                        this._popupInstance.hostView as EmbeddedViewRef<any>
                    ).rootNodes[0] as HTMLElement;
                    if (this.popupContainer?.parent) {
                        hostElement.setAttribute(
                            "parent",
                            this.popupContainer.parent.constructor.name
                        );
                    }
                    document.body.appendChild(hostElement);
                } else {
                    this.setPopupPosition();
                }

                this.visible = true;
                this.changeDetectorRef.detectChanges();
                this.changeDetectorRef.detach();
                // If closed, remove popup instance from DOM if there's one
            } else if (this._popupInstance && this.appendToBody) {
                this.deletePopupInstance();
            }

            this.opened.emit(this.isOpen);
        }
    }

    public closePopup(event?: MouseEvent): void {
        const isToggle =
            this.popupToggle && event
                ? (this.popupToggle.host.nativeElement as HTMLElement).contains(
                      event.target as HTMLElement
                  )
                : false;

        if (!isToggle) {
            this.deletePopupInstance();
            this.isOpen = false;
            this.visible = false;
            this.opened.emit(this.isOpen);
            this.changeDetectorRef.detectChanges();
            this.changeDetectorRef.detach();
        }
    }

    private setPopupPosition() {
        let parentEl: HTMLElement | undefined;
        if (!this.baseElementSelector && !this.popupToggle) {
            return;
        }

        if (this.popupToggle) {
            parentEl = this.popupToggle.host.nativeElement;
        } else {
            parentEl =
                document.querySelector<HTMLElement>(this.baseElementSelector) ??
                undefined;
        }

        if (!parentEl) {
            return;
        }

        const canBe = this.edgeDetector.canBe(
            <HTMLElement>parentEl,
            this.popupAreaContent.nativeElement
        );
        this._directionTop = _isUndefined(this.directionTop)
            ? !canBe?.placed.bottom
            : this.directionTop;
        this._directionRight = _isUndefined(this.directionRight)
            ? !canBe?.aligned.left
            : this.directionRight;
    }

    private deletePopupInstance() {
        if (this._popupInstance) {
            this.appRef.detachView(this._popupInstance.hostView);
            this._popupInstance.destroy();
            this._popupInstance = undefined;
        }
    }

    public ngOnDestroy(): void {
        this.popupSubscriptions.forEach((subscription) =>
            subscription.unsubscribe()
        );
        this.deletePopupInstance();
    }
}
