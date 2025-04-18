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

import { DOCUMENT } from "@angular/common";
import {
    Directive,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Inject,
    Input,
    NgZone,
    OnInit,
    Output,
} from "@angular/core";
import throttle from "lodash/throttle";

import { DragAndDropService } from "./drag-and-drop.service";
import { scrollConstants } from "./dragdrop.constants";
import { IDragEvent } from "./public-api";
import { UtilService } from "../../../services/util.service";

/**
 * Directive that provides draggable behavior for an element
 *
 *  __Usage:__
 *
 * Bind this directive to an element to add a draggable behavior to it.
 *
 *        `<div nuiDraggable>Some content</div>`
 *
 * Make sure that this zone has some content, because draggable directive doesn't set any height
 * to the element. This won't work:
 *
 *        `<div nuiDraggable></div>`
 *
 * Don't forget to assign some payload (data for transmission from draggable to droppable).
 * It can be an `Object`, string or whatever can be converted to a string:
 *
 *        `<div nuiDraggable [payload]="myData"></div>`
 *
 * To subscribe to an event `dragStart, dragEnd` just transmit an attribute
 *
 *         `<div nuiDroppable (dragStart)="dragStart($event)"></div>`
 *
 * And `dragStart` method will look like that:
 *
 *         `public dragStart(dropEvent: DragEvent) {
 *              //dropEvent - HTML 5 drag event (native)
 *          };`
 *
 * <example-url>./../examples/index.html#/dragdrop</example-url>
 *
 * @dynamic
 * @ignore
 */
@Directive({
    selector: "[nuiDraggable]",
    standalone: false
})
export class DraggableDirective implements OnInit {
    private static draggableClass = "nui-drag__draggable";
    private static draggingClass = "nui-drag--dragging";
    private static dragSourceClass = "nui-drag__drag-source";
    private static adornerClass = "nui-drag__drag-container";
    private static adornerHaloClass = "nui-drag__drag-halo";
    private static dragsourceOverlayClass = "nui-drag__drag-source--overlay";

    @Input() adornerDragClass: string;
    @Input() payload: any;
    @Output() dragStart = new EventEmitter();
    @Output() dragEnd = new EventEmitter();

    private adorner?: HTMLElement;
    private dragsourceOverlay?: HTMLElement;
    private moveDragAdorner = throttle(
        (coordinates: { x: number; y: number }) => {
            requestAnimationFrame(() => {
                if (this.adorner) {
                    this.adorner.style.left = coordinates.x + "px";
                    this.adorner.style.top = coordinates.y + "px";
                }
                this.autoScroll(coordinates.x, coordinates.y);
            });
        },
        scrollConstants.adornerUpdateThrottleInMs
    );

    @HostBinding(`class.${DraggableDirective.draggableClass}`)
    @HostBinding("attr.draggable")
    draggable: boolean;

    @HostListener("dragstart", ["$event"])
    onDragStart(event: IDragEvent): void {
        this.dragStart.emit(event);
        this.document.defaultView?.getSelection()?.removeAllRanges();
        window.getSelection()?.removeAllRanges();
        this.dragsourceOverlay = this.createDragVisuals(event);
        this.setImageAndData(event);
        /*
            runOutsideAngular is used when some action has to be performed outside
            angular zone. Therefore, this action won't trigger change detection.
        */
        this.zone.runOutsideAngular(() => {
            this.document.addEventListener("dragover", this.mouseHook);
        });
        event.stopPropagation();
    }

    @HostListener("dragend", ["$event"])
    onDragEnd(event: IDragEvent): void {
        this.dragEnd.emit(event);
        this.elRef.nativeElement.classList.remove(
            DraggableDirective.dragSourceClass
        );
        if (this.adorner) {
            this.adorner.remove();
            this.adorner = undefined;
        }

        if (this.dragsourceOverlay) {
            this.dragsourceOverlay.remove();
            this.dragsourceOverlay = undefined;
        }
        this.dragAndDropService.resetPayload();
        event.stopPropagation();

        this.zone.runOutsideAngular(() => {
            this.document.removeEventListener("dragover", this.mouseHook);
        });
    }

    constructor(
        private elRef: ElementRef,
        private zone: NgZone,
        private utilService: UtilService,
        private dragAndDropService: DragAndDropService,
        @Inject(DOCUMENT) private document: Document
    ) {}

    public ngOnInit(): void {
        this.draggable = true;
    }

    private mouseHook = (event: DragEvent) => {
        const clientX = event.clientX;
        const clientY = event.clientY;
        this.moveDragAdorner({ x: clientX, y: clientY });
    };

    private createDragVisuals = (event: DragEvent) => {
        // copy the node being dragged, and add effects
        this.adorner = this.document.createElement("div");
        this.adorner.style.left = event.clientX + "px";
        this.adorner.style.top = event.clientY + "px";
        this.adorner.classList.add(DraggableDirective.adornerClass);
        if (this.adornerDragClass) {
            this.adorner.classList.add(this.adornerDragClass);
        }
        const adornerHalo = this.document.createElement("div");
        adornerHalo.classList.add(DraggableDirective.adornerHaloClass);
        this.adorner.appendChild(adornerHalo);

        // Safari shows the dragImage natively, so we don't have to fake it
        if (!this.utilService.browser?.isSafari()) {
            const copiedNode = (<any>event.currentTarget).cloneNode(true);
            copiedNode.style.width =
                this.elRef.nativeElement.offsetWidth + "px";
            copiedNode.style.height =
                this.elRef.nativeElement.offsetHeight + "px";
            copiedNode.classList.add(DraggableDirective.draggingClass);
            copiedNode.removeAttribute("draggable");
            this.adorner.appendChild(copiedNode);
        }

        // if there is a place to attach to, do it.  Otherwise, place it after the copied node

        this.elRef.nativeElement.parentNode.appendChild(this.adorner);

        // this should be the overlay that fades out the existing node
        const dragSourceOverlay = this.document.createElement("div");
        dragSourceOverlay.classList.add(
            DraggableDirective.dragsourceOverlayClass
        );

        // Fix for Google Chrome, appending of overlay in regular way cause unreasonable dispatch of "dragend" event
        setTimeout(() => {
            this.elRef.nativeElement.appendChild(dragSourceOverlay);
        }, 0);

        this.elRef.nativeElement.classList.add(
            DraggableDirective.dragSourceClass
        );

        return dragSourceOverlay;
    };

    private setImageAndData(event: DragEvent) {
        if (
            (typeof DragEvent !== "undefined" && event instanceof DragEvent) ||
            event.dataTransfer
        ) {
            if (event.dataTransfer?.setDragImage) {
                if (this.utilService.browser?.isSafari()) {
                    // Safari supports dragImage in a usable way
                    event.dataTransfer.setDragImage(
                        this.elRef.nativeElement,
                        0,
                        -10
                    );
                } else {
                    // but other browsers don't so we have to disable it
                    const emptyItem = this.document.createElement("div");
                    event.dataTransfer.setDragImage(emptyItem, 0, 0);
                }
            }

            if (!event.dataTransfer) {
                throw new Error("Event do not contain dataTransfer property");
            }
            event.dataTransfer.dropEffect = "copy";

            this.dragAndDropService.setDragPayload(this.payload, event);
        }
    }

    private autoScroll(clientX: number, clientY: number) {
        if (!clientX || !clientY) {
            return;
        }

        if (!this.document.defaultView) {
            throw new Error("Document does not contain defaultView property");
        }
        const verticalDistPercentage =
            (clientY / this.document.defaultView.innerHeight) * 100;
        const horizontalDistPercentage =
            (clientX / this.document.defaultView.innerWidth) * 100;
        const topScrollBoundary = scrollConstants.verticalScrollPercentage;
        const bottomScrollBoundary =
            100 - scrollConstants.verticalScrollPercentage;
        const leftScrollBoundary = scrollConstants.horizontalScrollPercentage;
        const rightScrollBoundary =
            100 - scrollConstants.horizontalScrollPercentage;

        let newX = this.document.defaultView.pageXOffset;
        let newY = this.document.defaultView.pageYOffset;

        let scrollNeeded = false;
        if (verticalDistPercentage < topScrollBoundary) {
            const throttleDistance =
                (topScrollBoundary - verticalDistPercentage) *
                scrollConstants.accelerationFactor;
            newY = newY - throttleDistance;
            scrollNeeded = true;
        }
        if (verticalDistPercentage > bottomScrollBoundary) {
            const throttleDistance =
                (verticalDistPercentage - bottomScrollBoundary) *
                scrollConstants.accelerationFactor;
            newY = newY + throttleDistance;
            scrollNeeded = true;
        }
        if (horizontalDistPercentage < leftScrollBoundary) {
            const throttleDistance =
                (leftScrollBoundary - horizontalDistPercentage) *
                scrollConstants.accelerationFactor;
            newX = newX - throttleDistance;
            scrollNeeded = true;
        }
        if (horizontalDistPercentage > rightScrollBoundary) {
            const throttleDistance =
                (horizontalDistPercentage - rightScrollBoundary) *
                scrollConstants.accelerationFactor;
            newX = newX + throttleDistance;
            scrollNeeded = true;
        }
        if (scrollNeeded) {
            this.document.defaultView.scrollTo(newX, newY);
        }
    }
}
