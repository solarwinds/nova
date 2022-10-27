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
import { Inject, Injectable } from "@angular/core";
import _isNil from "lodash/isNil";

/**
 * Service for calculating element's position (e.g. tooltip, popover).
 * For now has one public method 'getCoordinates' (see method description).
 */

/**
 * @dynamic
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class PositionService {
    constructor(@Inject(DOCUMENT) private document: Document) {}
    /**
     * __Description:__
     * Takes two HTMLElements (hostElement and targetElement) and calculates a position for the targetElement.
     * @param  hostElement If you want to display tooltip for some textbox, hostElement is textbox.
     * @param   targetElement Tooltip (or popover) element, for which position will be returned.
     * @param   placementAndAlign String in format "placement-align", e.g. "top-center".
     * 'Placement' could be 'right', 'left', 'top' (default), 'bottom'. It defines how target will be placed
     * to the host.
     * 'Align' could be 'right', 'left', 'top', 'bottom' and 'center' (default). It defines whether one of the target's
     * edges will be aligned to host's one. Be aware that horizontal placements need vertical alignment and vice verca.
     * Possible values of 'placementAndAlign' could be: 'top' (the same as 'top-center'), 'top-right', 'left-bottom',
     * 'bottom-left' etc.
     * @param   appendToBody Specifies whether target element is appended to the body.
     * When not, service seeks for the first positioned parent of host.
     * @returns Object literal { top:number, left:number } that contains
     * coordinates for the top left corner of targetElement.
     */
    public getPosition(
        hostElement: HTMLElement,
        targetElement: HTMLElement,
        placementAndAlign: string,
        appendToBody?: boolean
    ): { top: number; left: number } {
        const placement = placementAndAlign.split("-")[0];
        const align = placementAndAlign.split("-")[1];
        let shiftByX: number;
        let shiftByY: number;
        const hostElementPosition = appendToBody
            ? this.offset(hostElement)
            : this.position(hostElement);
        switch (align) {
            case "right":
                shiftByX =
                    hostElementPosition.width - targetElement.offsetWidth;
                shiftByY =
                    (hostElementPosition.height - targetElement.offsetHeight) /
                    2;
                break;
            case "left":
                shiftByX = 0;
                shiftByY =
                    (hostElementPosition.height - targetElement.offsetHeight) /
                    2;
                break;
            case "top":
                shiftByX =
                    (hostElementPosition.width - targetElement.offsetWidth) / 2;
                shiftByY = 0;
                break;
            case "bottom":
                shiftByX =
                    (hostElementPosition.width - targetElement.offsetWidth) / 2;
                shiftByY =
                    hostElementPosition.height - targetElement.offsetHeight;
                break;
            case "center":
            default:
                shiftByX =
                    (hostElementPosition.width - targetElement.offsetWidth) / 2;
                shiftByY =
                    (hostElementPosition.height - targetElement.offsetHeight) /
                    2;
                break;
        }
        let targetElementPosition: { top: number; left: number };
        switch (placement) {
            case "right":
                targetElementPosition = {
                    top: hostElementPosition.top + shiftByY,
                    left: hostElementPosition.left + hostElementPosition.width,
                };
                break;
            case "left":
                targetElementPosition = {
                    top: hostElementPosition.top + shiftByY,
                    left: hostElementPosition.left - targetElement.offsetWidth,
                };
                break;
            case "bottom":
                targetElementPosition = {
                    top: hostElementPosition.top + hostElementPosition.height,
                    left: hostElementPosition.left + shiftByX,
                };
                break;
            case "top":
            default:
                targetElementPosition = {
                    top: hostElementPosition.top - targetElement.offsetHeight,
                    left: hostElementPosition.left + shiftByX,
                };
                break;
        }
        return targetElementPosition;
    }

    private position(nativeElement: HTMLElement): {
        width: number;
        height: number;
        top: number;
        left: number;
    } {
        let offsetParentBoundingClientRect = { top: 0, left: 0 };
        const elementBoundingClientRect = this.offset(nativeElement);
        const offsetParentElement = this.parentOffsetEl(nativeElement);

        if (offsetParentElement !== this.document) {
            offsetParentBoundingClientRect = this.offset(offsetParentElement);
            offsetParentBoundingClientRect.top +=
                offsetParentElement.clientTop - offsetParentElement.scrollTop;
            offsetParentBoundingClientRect.left +=
                offsetParentElement.clientLeft - offsetParentElement.scrollLeft;
        }

        const boundingClientRect = nativeElement.getBoundingClientRect();

        return {
            width: boundingClientRect.width || nativeElement.offsetWidth,
            height: boundingClientRect.height || nativeElement.offsetHeight,
            top:
                elementBoundingClientRect.top -
                offsetParentBoundingClientRect.top,
            left:
                elementBoundingClientRect.left -
                offsetParentBoundingClientRect.left,
        };
    }

    private offset(nativeElement: any): {
        width: number;
        height: number;
        top: number;
        left: number;
    } {
        const boundingClientRect = nativeElement.getBoundingClientRect();
        if (_isNil(this.document.defaultView)) {
            throw new Error("Document defaultView is not available");
        }

        return {
            width: boundingClientRect.width || nativeElement.offsetWidth,
            height: boundingClientRect.height || nativeElement.offsetHeight,
            top:
                boundingClientRect.top +
                (this.document.defaultView.pageYOffset ||
                    this.document.documentElement.scrollTop),
            left:
                boundingClientRect.left +
                (this.document.defaultView.pageXOffset ||
                    this.document.documentElement.scrollLeft),
        };
    }

    private getStyle(nativeElement: HTMLElement, cssProp: string): string {
        if (_isNil(this.document.defaultView)) {
            throw new Error("Document defaultView is not available");
        }

        if (this.document.defaultView.getComputedStyle) {
            return (
                this.document.defaultView.getComputedStyle(
                    nativeElement
                ) as CSSStyleDeclaration & { [key: string]: any }
            )[cssProp];
        }

        // finally try and get inline style
        return (
            nativeElement.style as CSSStyleDeclaration & { [key: string]: any }
        )[cssProp];
    }

    private isStaticPositioned(nativeElement: HTMLElement): boolean {
        return (
            (this.getStyle(nativeElement, "position") || "static") === "static"
        );
    }

    private parentOffsetEl(nativeElement: HTMLElement): any {
        let offsetParent: any = nativeElement.offsetParent || this.document;

        while (
            offsetParent &&
            offsetParent !== this.document &&
            this.isStaticPositioned(offsetParent)
        ) {
            offsetParent = offsetParent.offsetParent;
        }

        return offsetParent || this.document;
    }
}
