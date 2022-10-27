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

import { popoverConstants } from "../../constants/popover.constants";
import { EdgeDetectionService } from "../../services/edge-detection.service";
import { PositionService } from "../../services/position.service";
import { IEdgeDetectionResult } from "../../services/public-api";
import { PopoverPlacement } from "./public-api";
/**
 * @ignore
 */
interface IPopoverPlacementAlignment {
    placement: PopoverPlacement;
    alignment: PopoverAlignment;
}
/**
 * @ignore
 */
export type PopoverAlignment = "left" | "right" | "top" | "bottom";
/**
 * @ignore
 */
export interface IPopoverModalContext {
    arrowMarginTop?: number;
    icon: string;
    popoverPosition?: string;
    title?: string;
    placement?: PopoverPlacement;
}
/**
 * @ignore
 */
export interface IPopoverPosition {
    placement: PopoverPlacement;
    arrowPosition: PopoverAlignment;
    position: {
        top: number;
        left: number;
    };
}

/**
 * @dynamic
 * @ignore
 */
@Injectable()
export class PopoverModalService {
    constructor(
        private positionService: PositionService,
        @Inject(DOCUMENT) private document: Document,
        private edgeDetector: EdgeDetectionService
    ) {}

    public setPosition(
        popoverModal: HTMLElement,
        popoverTrigger: HTMLElement,
        appendToBody: boolean,
        contextPlacement: PopoverPlacement
    ): IPopoverPosition {
        // Element with dimensions
        const popoverElement = <HTMLElement>(
            popoverModal.querySelector(".nui-popover-container")
        );
        const edgeDetectionResult = this.edgeDetector.canBe(
            popoverTrigger,
            popoverElement
        );

        if (_isNil(edgeDetectionResult)) {
            throw new Error("edgeDetectionResult is Nil");
        }

        const placementAndAlignment = this.getPlacementAndAlignment(
            edgeDetectionResult,
            contextPlacement
        );
        const placement = placementAndAlignment.placement;
        const arrowPosition = placementAndAlignment.alignment;
        const position = this.positionService.getPosition(
            popoverTrigger,
            popoverElement,
            `${placement}-${arrowPosition}`,
            appendToBody
        );
        position.top += this.getYAdjustment(
            popoverTrigger,
            placementAndAlignment
        );
        position.left += this.getXAdjustment(
            popoverTrigger,
            placementAndAlignment
        );
        return {
            placement,
            position,
            arrowPosition,
        };
    }

    private getPlacementAndAlignment(
        edgeDetectionResult: IEdgeDetectionResult,
        contextPlacement: PopoverPlacement
    ): IPopoverPlacementAlignment {
        const canOpenHorizontally =
            edgeDetectionResult.placed.right || edgeDetectionResult.placed.left;
        const canOpenVertically =
            edgeDetectionResult.placed.top || edgeDetectionResult.placed.bottom;
        // placements
        const canBePlacedRight = edgeDetectionResult.placed.right
            ? "right"
            : "left";
        const canBePlacedLeft = edgeDetectionResult.placed.left
            ? "left"
            : "right";
        const canBePlacedBottom = edgeDetectionResult.placed.bottom
            ? "bottom"
            : "top";
        const canBePlacedTop = edgeDetectionResult.placed.top
            ? "top"
            : "bottom";
        // alignments
        const canBeAlignedTop = edgeDetectionResult.aligned.top
            ? "top"
            : "bottom";
        const canBeAlignedRight = edgeDetectionResult.aligned.right
            ? "right"
            : "left";
        const canBeAlignedLeft = edgeDetectionResult.aligned.left
            ? "left"
            : "right";
        // if horizontal/vertical placement is possible opening left/right/top/bottom respectively
        switch (contextPlacement) {
            case "left":
                return {
                    placement: canOpenHorizontally
                        ? canBePlacedLeft
                        : canBePlacedBottom,
                    alignment: canOpenHorizontally
                        ? canBeAlignedTop
                        : canBeAlignedRight,
                };
            case "right":
                return {
                    placement: canOpenHorizontally
                        ? canBePlacedRight
                        : canBePlacedBottom,
                    alignment: canOpenHorizontally
                        ? canBeAlignedTop
                        : canBeAlignedRight,
                };
            case "bottom":
                return {
                    placement: canOpenVertically
                        ? canBePlacedBottom
                        : canBePlacedRight,
                    alignment: canOpenVertically
                        ? canBeAlignedLeft
                        : canBeAlignedTop,
                };
            case "top":
                return {
                    placement: canOpenVertically
                        ? canBePlacedTop
                        : canBePlacedRight,
                    alignment: canOpenVertically
                        ? canBeAlignedLeft
                        : canBeAlignedTop,
                };
            default:
                return {
                    placement: canOpenHorizontally
                        ? canBePlacedRight
                        : canBePlacedBottom,
                    alignment: canOpenHorizontally
                        ? canBeAlignedTop
                        : canBeAlignedRight,
                };
        }
    }

    // calculating adjustments for popover modal on Y axis
    private getYAdjustment(
        popoverTrigger: HTMLElement,
        placementAndAlignment: IPopoverPlacementAlignment
    ): number {
        // y-adjustment not needed for top or bottom placement
        if (
            placementAndAlignment.placement === "top" ||
            placementAndAlignment.placement === "bottom"
        ) {
            return 0;
        }

        const yAdjustment =
            popoverTrigger.offsetHeight / 2 -
            (popoverConstants.arrowOffset + popoverConstants.arrowBorderWidth);
        return placementAndAlignment.alignment === "top"
            ? yAdjustment
            : -yAdjustment;
    }

    // calculating adjustments for popover modal on X axis
    // popover modal should be always on center on X axis
    private getXAdjustment(
        popoverTrigger: HTMLElement,
        placementAndAlignment: IPopoverPlacementAlignment
    ): number {
        // x-adjustment not needed for left or right placement
        if (
            placementAndAlignment.placement === "left" ||
            placementAndAlignment.placement === "right"
        ) {
            return 0;
        }

        const xAdjustment =
            popoverTrigger.offsetWidth / 2 -
            (popoverConstants.arrowOffset + popoverConstants.arrowBorderWidth);
        return placementAndAlignment.alignment === "left"
            ? xAdjustment
            : -xAdjustment;
    }
}
