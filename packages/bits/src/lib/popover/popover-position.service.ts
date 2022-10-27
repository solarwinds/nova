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

import { ConnectedPosition } from "@angular/cdk/overlay";
import { Injectable } from "@angular/core";

import { OVERLAY_ARROW_SIZE } from "../overlay/constants";
import { PopoverOverlayPosition, PopoverPlacement } from "./public-api";

enum PopoverOverlayPlacement {
    Left = "left",
    Right = "right",
    Top = "top",
    Bottom = "bottom",
}

enum PanelClass {
    overlayLeftTop = "overlay-left-top",
    overlayLeftBottom = "overlay-left-bottom",
    overlayRightTop = "overlay-right-top",
    overlayRightBottom = "overlay-right-bottom",
    overlayTopLeft = "overlay-top-left",
    overlayTopRight = "overlay-top-right",
    overlayBottomLeft = "overlay-bottom-left",
    overlayBottomRight = "overlay-bottom-right",
}

@Injectable()
export class PopoverPositionService {
    private readonly popoverPositions: Record<
        PopoverOverlayPosition,
        ConnectedPosition
    >;

    constructor() {
        this.popoverPositions = getPopoverPositions();
    }

    public setPopoverOffset(
        panelClass: string | string[],
        elRefHeight: number,
        overlayRefElement: HTMLElement
    ) {
        const ARROW_SIZE = OVERLAY_ARROW_SIZE;
        const popoverOffsetY = this.calculateOffsetY(elRefHeight);

        if (Array.isArray(panelClass)) {
            panelClass = this.getPopoverPositionPanelClass(panelClass);
        }

        if (!panelClass) {
            return;
        }

        overlayRefElement.style.marginLeft = "";
        overlayRefElement.style.marginTop = "";
        overlayRefElement.style.marginBottom = "";
        overlayRefElement.style.marginRight = "";

        switch (panelClass) {
            case PanelClass.overlayLeftTop:
                overlayRefElement.style.marginRight = ARROW_SIZE + "px";
                overlayRefElement.style.marginBottom = -popoverOffsetY + "px";
                break;
            case PanelClass.overlayLeftBottom:
                overlayRefElement.style.marginRight = ARROW_SIZE + "px";
                overlayRefElement.style.marginTop = -popoverOffsetY + "px";
                break;
            case PanelClass.overlayRightTop:
                overlayRefElement.style.marginLeft = ARROW_SIZE + "px";
                overlayRefElement.style.marginBottom = -popoverOffsetY + "px";
                break;
            case PanelClass.overlayRightBottom:
                overlayRefElement.style.marginLeft = ARROW_SIZE + "px";
                overlayRefElement.style.marginTop = -popoverOffsetY + "px";
                break;
            case PanelClass.overlayTopLeft:
                overlayRefElement.style.marginRight = -2 * ARROW_SIZE + "px";
                overlayRefElement.style.marginBottom = ARROW_SIZE + "px";
                break;
            case PanelClass.overlayTopRight:
                overlayRefElement.style.marginLeft = -2 * ARROW_SIZE + "px";
                overlayRefElement.style.marginBottom = ARROW_SIZE + "px";
                break;
            case PanelClass.overlayBottomLeft:
                overlayRefElement.style.marginRight = -2 * ARROW_SIZE + "px";
                overlayRefElement.style.marginTop = ARROW_SIZE + "px";
                break;
            case PanelClass.overlayBottomRight:
                overlayRefElement.style.marginLeft = -2 * ARROW_SIZE + "px";
                overlayRefElement.style.marginTop = ARROW_SIZE + "px";
                break;
        }
    }

    public possiblePositionsForPlacement(
        placement: PopoverPlacement
    ): ConnectedPosition[] {
        const possiblePositions: ConnectedPosition[] = [];

        switch (placement) {
            case PopoverOverlayPlacement.Left:
                possiblePositions.push(
                    ...this.getPositionsForPlacement(
                        PopoverOverlayPlacement.Left
                    )
                );
                break;
            case PopoverOverlayPlacement.Right:
                possiblePositions.push(
                    ...this.getPositionsForPlacement(
                        PopoverOverlayPlacement.Right
                    )
                );
                break;
            case PopoverOverlayPlacement.Top:
                possiblePositions.push(
                    ...this.getPositionsForPlacement(
                        PopoverOverlayPlacement.Top
                    )
                );
                break;
            case PopoverOverlayPlacement.Bottom:
                possiblePositions.push(
                    ...this.getPositionsForPlacement(
                        PopoverOverlayPlacement.Bottom
                    )
                );
                break;
        }

        return possiblePositions;
    }

    public getConnectedPositions(
        positions: PopoverOverlayPosition[]
    ): ConnectedPosition[] {
        return positions.map(
            (positionName: PopoverOverlayPosition) =>
                this.popoverPositions[positionName]
        );
    }

    /**
     * Returns all possible positions for a placement
     * Eg: left => [OVERLAY_POSITIONS[centerLeft], OVERLAY_POSITIONS[topLeft], OVERLAY_POSITIONS[bottomLeft]]
     *
     * @param placement
     * @returns ConnectedPosition[]
     */
    private getPositionsForPlacement(
        placement: PopoverOverlayPlacement
    ): ConnectedPosition[] {
        let possiblePositionNames: PopoverOverlayPosition[] = [];
        switch (placement) {
            case PopoverOverlayPlacement.Left:
                possiblePositionNames = [
                    PopoverOverlayPosition.leftBottom,
                    PopoverOverlayPosition.leftTop,
                    PopoverOverlayPosition.rightBottom,
                    PopoverOverlayPosition.rightTop,
                ];
                break;

            case PopoverOverlayPlacement.Right:
                possiblePositionNames = [
                    PopoverOverlayPosition.rightBottom,
                    PopoverOverlayPosition.rightTop,
                    PopoverOverlayPosition.leftBottom,
                    PopoverOverlayPosition.leftTop,
                ];
                break;

            case PopoverOverlayPlacement.Top:
                possiblePositionNames = [
                    PopoverOverlayPosition.topRight,
                    PopoverOverlayPosition.topLeft,
                    PopoverOverlayPosition.bottomRight,
                    PopoverOverlayPosition.bottomLeft,
                ];
                break;

            case PopoverOverlayPlacement.Bottom:
                possiblePositionNames = [
                    PopoverOverlayPosition.bottomRight,
                    PopoverOverlayPosition.bottomLeft,
                    PopoverOverlayPosition.topRight,
                    PopoverOverlayPosition.topLeft,
                ];
                break;
        }

        return this.getConnectedPositions(possiblePositionNames);
    }

    private getPopoverPositionPanelClass(panelClass: string[]): string {
        let result;
        for (const panelClassKey in PanelClass) {
            if (PanelClass.hasOwnProperty(panelClassKey)) {
                result = panelClass.find((i) => i === panelClassKey);
            }
        }
        return result || "";
    }

    private calculateOffsetY(elRefHeight: number): number {
        const ARROW_CENTER_POSITION_PX = 20;
        if (!elRefHeight) {
            return 5;
        }
        return ARROW_CENTER_POSITION_PX - elRefHeight / 2;
    }
}

export function getPopoverPositions(): Record<
    PopoverOverlayPosition,
    ConnectedPosition
> {
    return {
        [PopoverOverlayPosition.topLeft]: {
            panelClass: "overlay-top-left",
            originX: "center",
            originY: "top",
            overlayX: "end",
            overlayY: "bottom",
        },
        [PopoverOverlayPosition.bottomLeft]: {
            panelClass: "overlay-bottom-left",
            originX: "center",
            originY: "bottom",
            overlayX: "end",
            overlayY: "top",
        },
        [PopoverOverlayPosition.topRight]: {
            panelClass: "overlay-top-right",
            originX: "center",
            originY: "top",
            overlayX: "start",
            overlayY: "bottom",
        },
        [PopoverOverlayPosition.bottomRight]: {
            panelClass: "overlay-bottom-right",
            originX: "center",
            originY: "bottom",
            overlayX: "start",
            overlayY: "top",
        },
        [PopoverOverlayPosition.leftTop]: {
            panelClass: "overlay-left-top",
            originX: "start",
            originY: "bottom",
            overlayX: "end",
            overlayY: "bottom",
        },
        [PopoverOverlayPosition.leftBottom]: {
            panelClass: "overlay-left-bottom",
            originX: "start",
            originY: "top",
            overlayX: "end",
            overlayY: "top",
        },
        [PopoverOverlayPosition.rightTop]: {
            panelClass: "overlay-right-top",
            originX: "end",
            originY: "bottom",
            overlayX: "start",
            overlayY: "bottom",
        },
        [PopoverOverlayPosition.rightBottom]: {
            panelClass: "overlay-right-bottom",
            originX: "end",
            originY: "top",
            overlayX: "start",
            overlayY: "top",
        },
    };
}
