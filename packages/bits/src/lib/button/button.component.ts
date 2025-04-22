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
    AfterContentChecked,
    Attribute,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation,
} from "@angular/core";
import { fromEvent, merge, Subject, timer } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

import { ButtonSizeType } from "./public-api";
import { buttonConstants } from "../../constants/button.constants";
import { LoggerService } from "../../services/log-service";

// <example-url>./../examples/index.html#/button</example-url>

@Component({
    selector: "[nui-button]",
    templateUrl: "./button.component.html",
    host: {
        "[attr.aria-busy]": "isBusy || null",
        class: "nui-button btn",
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./button.component.less"],
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class ButtonComponent implements OnInit, OnDestroy, AfterContentChecked {
    /**
     * Optionally, specify the display style. Supported values are "default", "primary", "action", and "destructive".
     */
    @Input() public displayStyle: string;
    /**
     * Optionally, specify an icon to be displayed within the button.
     */
    @Input() public icon: string;
    /**
     * Optionally, specify an icon color. Note: The icon color for displayStyle "primary" is "white" and is not configurable.
     */
    @Input() public get iconColor(): string {
        return this._iconColor ? this._iconColor : "";
    }
    public set iconColor(value: string) {
        this._iconColor = value;
    }
    /**
     * Optionally, modify the placement of the icon. If true, the icon is placed to the right of the button's text; otherwise, it's
     * placed to the left.
     */
    @Input() public iconRight: boolean;
    /**
     * Optionally, set the current busy state of the button.
     */
    @Input() public isBusy: boolean;
    /**
     * Optionally, set whether to apply special styling for a button consisting of an icon by itself with no accompanying text
     * (the special styling reduces min-width, adjusts padding, etc.). Note: If no value is provided for this input and
     * the button has no inner content, the empty button styling will still be applied.
     */
    @Input() public isEmpty: boolean;

    /** Sets aria-label for the component */
    @Input() public ariaLabel: string = "";

    /**
     * Optionally, set whether to fire a "click" event repeatedly while the button is pressed.
     */
    @Input() public isRepeat = false;
    /**
     * Optionally, set the size of the button. Supported values are "compact", "default", and "large".
     */
    // TODO: Remove this setter/getter logic in scope of NUI-3475
    @Input() public get size(): ButtonSizeType {
        return this._size;
    }
    public set size(value: ButtonSizeType) {
        this._size =
            (value as string) === "small" ? ButtonSizeType.compact : value;
    }

    @HostBinding("class.btn-lg")
    public get sizeClassLarge(): boolean {
        return this.size === "large";
    }

    @HostBinding("class.btn-xs")
    public get sizeClassCompact(): boolean {
        return this.size === "compact";
    }

    @HostBinding("class.icon-right")
    public get iconRightClass(): boolean {
        return this.iconRight;
    }

    @HostBinding("class.icon-left")
    public get iconleftClass(): boolean {
        return !this.iconRight;
    }

    @HostBinding("class.is-busy")
    public get isBusyClass(): boolean {
        return this.isBusy;
    }

    @HostBinding("class.is-empty")
    public get isEmptyClass(): boolean {
        return this.isEmpty ?? this._isContentEmpty;
    }

    @HostBinding("class.btn-primary")
    public get dispStylePrimClass(): boolean {
        return this.displayStyle === "primary";
    }

    @HostBinding("class.btn-action")
    public get dispStyleActionClass(): boolean {
        return this.displayStyle === "action";
    }

    @HostBinding("class.btn-destructive")
    public get displayStyleDestructiveClass(): boolean {
        return this.displayStyle === "destructive";
    }

    @HostBinding("class.btn-default")
    public get dispStyleDefaultClass(): boolean {
        return (
            this.displayStyle === "default" ||
            !(
                this.dispStylePrimClass ||
                this.dispStyleActionClass ||
                this.displayStyleDestructiveClass
            )
        );
    }

    @HostBinding("attr.aria-label")
    public get ariaIconLabel(): string {
        return this.ariaLabel || this.getAriaLabel();
    }

    @ViewChild("contentContainer", { static: true, read: ViewContainerRef })
    private contentContainer: ViewContainerRef;

    private ngUnsubscribe: Subject<void> = new Subject<void>();
    private _iconColor: string;
    private _isContentEmpty: boolean;
    private _size: ButtonSizeType;

    constructor(
        @Attribute("type") private type: string,
        private el: ElementRef,
        private logger: LoggerService
    ) {
        if (this.getHostElement().tagName === "BUTTON" && !type) {
            this.logger.error(
                `No type specified for button element. To avoid potential problems, the "type" attribute \
should be set explicitly: `,
                el.nativeElement
            );
        }
    }

    public ngOnInit(): void {
        this.setupRepeatEvent();
    }

    public ngAfterContentChecked(): void {
        if (this.isEmpty === undefined) {
            this.setIsContentEmptyValue();
        }
    }

    public ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    /**
     * Passes correct size of icon to inner HTML template.
     */
    public getIconSize(): string {
        return this.size
            ? buttonConstants.iconSizeMap[this.size.toLowerCase()]
            : "";
    }

    /**
     * Passes correct styles to inner HTML template for displaying busy state.
     */
    public getRippleContainerStyle(): Partial<CSSStyleDeclaration> {
        const host = this.getHostElement();
        const d = Math.max(host.offsetWidth, host.offsetHeight);
        const x = Math.floor((host.offsetWidth - d) / 2);
        const y = Math.floor((host.offsetHeight - d) / 2);

        return {
            left: `${x}px`,
            top: `${y}px`,
            width: `${d}px`,
            height: `${d}px`,
        };
    }

    private getAriaLabel() {
        // In chrome once innerText gets touched in a native element this caused issues in table-sticky-header NUI-6033
        return this._isContentEmpty
            ? this.icon
            : this.contentContainer.element.nativeElement.textContent.trim();
    }

    private setIsContentEmptyValue() {
        const innerHTML = this.contentContainer.element.nativeElement.innerHTML;
        this._isContentEmpty = !innerHTML || !innerHTML.trim();
    }

    private setupRepeatEvent() {
        const hostElement = this.getHostElement();
        const mouseUp$ = fromEvent(hostElement, "mouseup").pipe(
            takeUntil(this.ngUnsubscribe)
        );
        const mouseLeave$ = fromEvent(hostElement, "mouseleave").pipe(
            takeUntil(this.ngUnsubscribe)
        );
        fromEvent(hostElement, "mousedown")
            .pipe(
                takeUntil(this.ngUnsubscribe),
                filter(() => this.isRepeat)
            )
            .subscribe(() => {
                const repeatSubscription = timer(
                    buttonConstants.repeatDelay,
                    buttonConstants.repeatInterval
                )
                    .pipe(
                        takeUntil(
                            merge(mouseUp$, mouseLeave$, this.ngUnsubscribe)
                        )
                    )
                    .subscribe(() => {
                        if (hostElement.disabled) {
                            repeatSubscription.unsubscribe();
                        } else {
                            hostElement.click();
                        }
                    });
            });
    }

    private getHostElement() {
        return this.el.nativeElement;
    }
}
