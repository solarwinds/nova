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

import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, Output, Renderer2, SimpleChanges, inject } from "@angular/core";
import debounce from "lodash/debounce";
import isFunction from "lodash/isFunction";
import isUndefined from "lodash/isUndefined";
import { Subscription } from "rxjs";

import {
    IResizeProperties,
    ResizeDirection,
    resizeDirectionHelpers,
    ResizeUnit,
} from "./public-api";
import { COMPLETE_RESIZE_EVENT } from "../../../constants/event.constants";
import { RESIZE_DEBOUNCE_TIME } from "../../../constants/resize.constants";
import { EventBusService } from "../../../services/event-bus.service";
import { UtilService } from "../../../services/util.service";

/** @ignore */
const resizeClass = "nui-resize-gutter";

/**
 * @ignore
 * <example-url>./../examples/index.html#/resizer</example-url>
 */
@Directive({
    selector: "[nuiResizer]",
    standalone: false,
})
export class ResizerDirective implements AfterViewInit, OnChanges, OnDestroy {
    private elRef = inject(ElementRef);
    private renderer = inject(Renderer2);
    private utilService = inject(UtilService);
    private _element = inject(ElementRef);
    private ngZone = inject(NgZone);
    private eventBusService = inject(EventBusService);

    /**
     * Direction in which element can be resizable. can be "top", "right", "left" and "bottom"
     */
    private _direction: ResizeDirection;

    @Input() set resizerDirection(direction: ResizeDirection) {
        this._direction = direction;
        this.refreshStyle();
    }

    get resizerDirection(): ResizeDirection {
        return this._direction;
    }

    /**
     * Sets custom size of resizable element
     */
    protected _size: number = 16;

    /**
     * Disables element resizing
     */
    private _disabled: boolean = false;

    @Input() set resizerDisabled(isDisabled: boolean) {
        this._disabled = isDisabled;
        if (this.resizeGutter) {
            this.switchDisabledClasses();
            if (!isDisabled) {
                this.refreshStyle();
            }
        }
    }

    get resizerDisabled(): boolean {
        return this._disabled;
    }
    /**
     * Choose resize value of your element(pixel, percent). By default pixels are used.
     */
    @Input() public resizerValue: ResizeUnit = ResizeUnit.pixel;

    /**
     * Switch to mode in which resizer change parent's and sibling's flex-basis (layout-specific)
     */
    @Input() public isMultiple: boolean;

    /**
     * Emits new size of element on which directive was applied
     */
    @Output() public resizerSizeChanged = new EventEmitter<string>();

    protected resizePropObj: IResizeProperties;
    protected parentContainerNode: HTMLElement;
    protected resizerSplit: HTMLElement;
    protected targetElement: ElementRef;
    protected resizeClass = resizeClass;
    protected resizeGutter: HTMLElement;
    protected offsetSize = this._size / 2;

    private _resizeElement = document.createElement("div");
    private _oldSize: number = 0;
    private _isDragging: boolean = false;
    private _isFirstTimeInteracting: boolean = true;
    private _isHovering = false;
    private resizeObserver?: ResizeObserver;
    private resizeSubscription: Subscription;
    private eventSubscriptions: (() => void)[] = [];
    private mouseUpUnlisten: () => void;
    private mouseMoveUnlisten: () => void;
    private sibling: any;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["resizerDirection"] && this.resizeGutter) {
            this.appendResizeElement();
        }
    }

    public ngAfterViewInit(): void {
        // as derived class doesn't inherits lifecycle hooks,
        // we can reassign targetElement there, in this case we just use directive's nativeElement
        this.targetElement = this.elRef;
        this.addSubscription();

        if (!this.isAtTheBeginning()) {
            this.renderer.appendChild(
                this.targetElement.nativeElement,
                this._resizeElement
            );
            this.resizeGutter =
                this.targetElement.nativeElement.lastElementChild;
        } else {
            this.renderer.insertBefore(
                this.targetElement.nativeElement,
                this._resizeElement,
                this.targetElement.nativeElement.firstElementChild
            );
            this.resizeGutter =
                this.targetElement.nativeElement.firstElementChild;
        }
        this.appendResizeElement();
        this.resizeGutter.className = this.resizeClass;
        this.parentContainerNode =
            this.targetElement.nativeElement.parentElement;
        this.addResizeObserver();
        this.appendEvents();
        this.refreshStyle();
    }

    public ngOnDestroy(): void {
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(
                <Element>this.targetElement.nativeElement.parentElement
            );
        }
        if (this.resizeSubscription) {
            this.resizeSubscription.unsubscribe();
        }
        this.unlistenEvents();
    }

    protected addResizeObserver(): void {
        const resizeHandler = debounce(
            (entry) => this.refreshStyle(),
            RESIZE_DEBOUNCE_TIME
        );
        this.resizeObserver = new ResizeObserver((entries) => {
            entries.forEach((entry: ResizeObserverEntry) => {
                this.ngZone.run(() => {
                    if (!this.resizerDisabled) {
                        resizeHandler(entry);
                    }
                });
            });
        });
        this.ngZone.runOutsideAngular(() => {
            this.resizeObserver?.observe(
                <Element>this.targetElement.nativeElement.parentElement
            );
        });
    }

    protected addSubscription(): void {
        this.resizeSubscription = this.eventBusService
            .getStream(COMPLETE_RESIZE_EVENT)
            .subscribe((resize) => this.refreshStyle());
    }

    protected onSizeChanged(newSize: string): void {
        this.resizerSizeChanged.emit(newSize);
    }

    protected refreshStyle(): void {
        if (this.resizeGutter && !this.resizerDisabled) {
            // fix safari bug about gutter height when direction is horizontal
            this.renderer.setStyle(
                this.resizeGutter,
                this.resizePropObj.sizeToSet,
                `${this._size}px`
            );
            this.renderer.setStyle(
                this.resizeGutter,
                this.resizePropObj.otherSizeProperty,
                "100%"
            );
            this.calculatePosition();
            this.renderer.setStyle(
                this.resizeGutter,
                "cursor",
                this.resizePropObj.cursor
            );
            this.switchDisabledClasses();
        }
    }

    protected unlistenEvents(): void {
        this.eventSubscriptions.forEach((unlistenFn) => {
            if (isFunction(unlistenFn)) {
                unlistenFn();
            }
        });
    }

    protected appendEvents(): void {
        this.eventSubscriptions.push(
            this.renderer.listen(
                this.resizeGutter,
                "mouseenter",
                ($event: MouseEvent) => this.onMouseEnter($event)
            )
        );
        this.eventSubscriptions.push(
            this.renderer.listen(this.resizeGutter, "mouseleave", () =>
                this.onMouseLeave()
            )
        );
        this.eventSubscriptions.push(
            this.renderer.listen(
                this.resizeGutter,
                "mousedown",
                ($event: MouseEvent) => this.onMouseDown($event)
            )
        );
    }

    protected isResizeHorizontal(): boolean {
        return (
            this.resizerDirection === ResizeDirection.left ||
            this.resizerDirection === ResizeDirection.right
        );
    }

    protected isAtTheBeginning(): boolean {
        return (
            this.resizerDirection === ResizeDirection.left ||
            this.resizerDirection === ResizeDirection.top
        );
    }

    private switchDisabledClasses(): void {
        this.resizerDisabled
            ? this.renderer.addClass(
                  this.resizeGutter,
                  `${this.resizeClass}-disabled`
              )
            : this.renderer.removeClass(
                  this.resizeGutter,
                  `${this.resizeClass}-disabled`
              );
    }

    private appendResizeElement() {
        if (this.resizerSplit) {
            this.renderer.removeChild(this.resizeGutter, this.resizerSplit);
        }
        this.resizerSplit = document.createElement("div");
        this.renderer.addClass(this.resizerSplit, `${this.resizeClass}__split`);
        this.renderer.addClass(
            this.resizerSplit,
            `${this.resizeClass}__split-${
                this.isResizeHorizontal() ? "horizontal" : "vertical"
            }`
        );
        this.renderer.appendChild(this.resizeGutter, this.resizerSplit);
        this.resizePropObj = resizeDirectionHelpers[this.resizerDirection];
    }

    private unlistenResizeEvents() {
        if (isFunction(this.mouseMoveUnlisten) && !this._isHovering) {
            this.mouseMoveUnlisten();
        }
        if (isFunction(this.mouseUpUnlisten)) {
            this.mouseUpUnlisten();
        }
    }

    // Registers mousemove
    private onMouseEnter(event: MouseEvent) {
        this._isHovering = true;
        // Add hovering class only while mouse is not clicked
        // "which" is supported by Safari
        if (
            (!isUndefined(event.buttons) && event.buttons === 0) ||
            (!isUndefined(event.which) && event.which === 0)
        ) {
            this.renderer.addClass(
                this.resizeGutter,
                `${this.resizeClass}--hovering`
            );
            this.mouseMoveUnlisten = this.renderer.listen(
                document,
                "mousemove",
                ($event: MouseEvent) => this.onMouseMove($event)
            );
        }
    }

    private onMouseLeave() {
        this.renderer.removeClass(
            this.resizeGutter,
            `${this.resizeClass}--hovering`
        );
        if (!this._isDragging) {
            this._isHovering = false;
            this.unlistenResizeEvents();
        }
    }

    private onMouseMove(event: MouseEvent): void {
        // No need to update styles for resizer that we're not dragging
        if (this._isFirstTimeInteracting && this._isDragging) {
            this.refreshStyle();
            this._isFirstTimeInteracting = false;
        }
        if (this._isDragging) {
            this.applyNewSize(event);
            this.calculatePosition();
        }
    }

    // Registers mouseup
    private onMouseDown(event: MouseEvent): void {
        this.renderer.addClass(
            this.resizeGutter,
            `${this.resizeClass}--active`
        );
        // Cursor should be there until mouseUp.
        this.renderer.setStyle(
            document.documentElement,
            "cursor",
            this.resizePropObj.cursor
        );
        this._isDragging = true;
        this._oldSize = this.isResizeHorizontal()
            ? event.clientX
            : event.clientY;
        this.mouseUpUnlisten = this.renderer.listen(
            document,
            "mouseup",
            ($event: MouseEvent) => this.onMouseUp($event)
        );
        event.preventDefault(); // This disables accidental text selection while resizingw
    }

    private onMouseUp(event: MouseEvent): void {
        this.renderer.removeStyle(document.documentElement, "cursor");
        this.renderer.removeClass(
            this.resizeGutter,
            `${this.resizeClass}--active`
        );
        this._isDragging = false;
        this.eventBusService.getStream(COMPLETE_RESIZE_EVENT).next(event);
    }

    private calculatePosition() {
        if (this.resizerDisabled) {
            return;
        }
        const parentCoord =
            this.parentContainerNode.getBoundingClientRect()[
                this.resizePropObj.appendDirection
            ];
        const elementCoord =
            this.targetElement.nativeElement.getBoundingClientRect()[
                this.resizePropObj.borderToCalculate
            ];
        this.renderer.setStyle(
            this.resizeGutter,
            this.resizePropObj.appendDirection,
            `${Math.abs(parentCoord - elementCoord) - this.offsetSize}px`
        );
    }

    private applyNewSize(event: MouseEvent) {
        this.sibling = this.targetElement.nativeElement.nextSibling;
        if (!this._isDragging || this.resizerDisabled) {
            return;
        }
        const newSize = this.isResizeHorizontal()
            ? event.clientX
            : event.clientY;
        this.updateSize(newSize);
    }

    private updateSize(newSize: number) {
        const updatedProp = this.isMultiple
            ? "flex-basis"
            : this.resizePropObj.sizeToSet;
        const parentSize =
            this.parentContainerNode[
                this.resizePropObj.nativeElementSizeProperty
            ];
        const valueCoeff =
            this.resizerValue === ResizeUnit.pixel ? 1 : 100 / parentSize;

        // if width is already defined then use it without calculating
        const nativeElSize = `${
            this.calculateNativeElementSize(
                newSize,
                this.resizePropObj.nativeElementSizeProperty
            ) * valueCoeff
        }${this.resizerValue}`;
        const resizerPosition = `${
            this.targetElement.nativeElement[
                this.resizePropObj.nativeElementSizeProperty
            ] - this.offsetSize
        }px`;
        if (!this.isMultiple) {
            this.renderer.setStyle(
                this.targetElement.nativeElement,
                updatedProp,
                nativeElSize
            );
        } else {
            const siblingSize = `${
                this.calculateSiblingSize(
                    newSize,
                    this.resizePropObj.nativeElementSizeProperty
                ) * valueCoeff
            }${this.resizerValue}`;
            if (this.parentContainerNode.children.length > 2) {
                // These 2 should ALWAYS be together
                this.renderer.setStyle(this.sibling, updatedProp, siblingSize);
                this.renderer.setStyle(
                    this.targetElement.nativeElement,
                    updatedProp,
                    nativeElSize
                );
            }
        }
        this.renderer.setStyle(
            this.resizeGutter,
            this.resizePropObj.appendDirection,
            resizerPosition
        );

        this.onSizeChanged(nativeElSize);
        this._oldSize = newSize;
    }

    private calculateNativeElementSize(
        newSize: number,
        updatedProp: string
    ): number {
        return this.isAtTheBeginning()
            ? this.targetElement.nativeElement[updatedProp] -
                  (newSize - this._oldSize)
            : this.targetElement.nativeElement[updatedProp] +
                  (newSize - this._oldSize);
    }

    private calculateSiblingSize(newSize: number, updatedProp: string): number {
        return this.isAtTheBeginning()
            ? this.sibling[updatedProp] + (newSize - this._oldSize)
            : this.sibling[updatedProp] - (newSize - this._oldSize);
    }
}
