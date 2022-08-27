import {
    ConnectedOverlayPositionChange,
    ConnectedPosition,
    FlexibleConnectedPositionStrategy,
    OverlayRef,
} from "@angular/cdk/overlay";
import { Injectable } from "@angular/core";
import isNil from "lodash/isNil";
import { Subscription } from "rxjs";

import { OVERLAY_ARROW_SIZE } from "./constants";
import {
    IOverlayPositionServiceConfig,
    OverlayPlacement,
    OverlayPosition,
} from "./types";

enum OverlayPanelClass {
    overlayCenterTop = "overlay-center-top",
    overlayTopLeft = "overlay-top-left",
    overlayTopRight = "overlay-top-right",
    overlayCenterBottom = "overlay-center-bottom",
    overlayBottomRight = "overlay-bottom-right",
    overlayBottomLeft = "overlay-bottom-left",
    overlayCenterLeft = "overlay-center-left",
    overlayLeftTop = "overlay-left-top",
    overlayLeftBottom = "overlay-left-bottom",
    overlayCenterRight = "overlay-center-right",
    overlayRightTop = "overlay-right-top",
    overlayRightBottom = "overlay-right-bottom",
}

@Injectable()
export class OverlayPositionService {
    private overlayPositions: Record<OverlayPosition, ConnectedPosition>;

    private arrowSize: number;
    private arrowPadding: number;
    public config: IOverlayPositionServiceConfig;

    public setOverlayPositionConfig(config?: IOverlayPositionServiceConfig) {
        this.arrowSize = !isNil(config?.arrowSize)
            ? <number>config?.arrowSize
            : OVERLAY_ARROW_SIZE;
        this.arrowPadding = !isNil(config?.arrowPadding)
            ? <number>config?.arrowPadding
            : 0;
        this.overlayPositions = getOverlayPositions();
    }

    public updateOffsetOnPositionChanges(
        positionStrategy: FlexibleConnectedPositionStrategy,
        getOverlayRef: () => OverlayRef
    ): Subscription {
        return positionStrategy.positionChanges.subscribe(
            (connectedPosition: ConnectedOverlayPositionChange) => {
                const overlayRefElement = getOverlayRef().overlayElement;
                const panelClass = connectedPosition.connectionPair.panelClass;
                if (!panelClass) {
                    return;
                }
                this.setOverlayOffset(panelClass, overlayRefElement);
            }
        );
    }

    private setOverlayOffset(
        panelClass: string | string[],
        overlayRefElement: HTMLElement
    ) {
        if (Array.isArray(panelClass)) {
            panelClass = this.getOverlayPositionPanelClass(panelClass);
        }

        if (!panelClass) {
            return;
        }

        overlayRefElement.style.marginLeft = "";
        overlayRefElement.style.marginTop = "";
        overlayRefElement.style.marginBottom = "";
        overlayRefElement.style.marginRight = "";

        switch (panelClass) {
            case OverlayPanelClass.overlayCenterTop:
                overlayRefElement.style.marginBottom = this.arrowSize + "px";
                break;
            case OverlayPanelClass.overlayTopLeft:
                overlayRefElement.style.marginRight =
                    2 * this.arrowPadding + "px";
                overlayRefElement.style.marginBottom = this.arrowSize + "px";
                break;
            case OverlayPanelClass.overlayTopRight:
                overlayRefElement.style.marginLeft =
                    2 * this.arrowPadding + "px";
                overlayRefElement.style.marginBottom = this.arrowSize + "px";
                break;
            case OverlayPanelClass.overlayCenterBottom:
                overlayRefElement.style.marginTop = this.arrowSize + "px";
                break;
            case OverlayPanelClass.overlayBottomRight:
                overlayRefElement.style.marginLeft =
                    2 * this.arrowPadding + "px";
                overlayRefElement.style.marginTop = this.arrowSize + "px";
                break;
            case OverlayPanelClass.overlayBottomLeft:
                overlayRefElement.style.marginRight =
                    2 * this.arrowPadding + "px";
                overlayRefElement.style.marginTop = this.arrowSize + "px";
                break;
            case OverlayPanelClass.overlayCenterLeft:
                overlayRefElement.style.marginRight = this.arrowSize + "px";
                break;
            case OverlayPanelClass.overlayLeftTop:
                overlayRefElement.style.marginRight = this.arrowSize + "px";
                break;
            case OverlayPanelClass.overlayLeftBottom:
                overlayRefElement.style.marginRight = this.arrowSize + "px";
                break;
            case OverlayPanelClass.overlayCenterRight:
                overlayRefElement.style.marginLeft = this.arrowSize + "px";
                break;
            case OverlayPanelClass.overlayRightTop:
                overlayRefElement.style.marginLeft = this.arrowSize + "px";
                break;
            case OverlayPanelClass.overlayRightBottom:
                overlayRefElement.style.marginLeft = this.arrowSize + "px";
                break;
        }
    }

    public getPossiblePositionsForPlacement(
        placement: OverlayPlacement
    ): ConnectedPosition[] {
        const possiblePositions: ConnectedPosition[] = [];

        // add positions for the requested placement
        possiblePositions.push(...this.getPositionsForPlacement(placement));

        // add positions for the opposite placement in case the requested placement
        // would be rendered outside the screen
        switch (placement) {
            case OverlayPlacement.Left:
                possiblePositions.push(
                    ...this.getPositionsForPlacement(OverlayPlacement.Right),
                    ...this.getPositionsForPlacement(OverlayPlacement.Top),
                    ...this.getPositionsForPlacement(OverlayPlacement.Bottom)
                );
                break;
            case OverlayPlacement.Right:
                possiblePositions.push(
                    ...this.getPositionsForPlacement(OverlayPlacement.Left),
                    ...this.getPositionsForPlacement(OverlayPlacement.Top),
                    ...this.getPositionsForPlacement(OverlayPlacement.Bottom)
                );
                break;
            case OverlayPlacement.Top:
                possiblePositions.push(
                    ...this.getPositionsForPlacement(OverlayPlacement.Bottom),
                    ...this.getPositionsForPlacement(OverlayPlacement.Left),
                    ...this.getPositionsForPlacement(OverlayPlacement.Right)
                );
                break;
            case OverlayPlacement.Bottom:
                possiblePositions.push(
                    ...this.getPositionsForPlacement(OverlayPlacement.Top),
                    ...this.getPositionsForPlacement(OverlayPlacement.Left),
                    ...this.getPositionsForPlacement(OverlayPlacement.Right)
                );
                break;
        }

        return possiblePositions;
    }

    private getOverlayPositionPanelClass(panelClass: string[]): string {
        let result;
        for (const panelClassKey in OverlayPanelClass) {
            if (OverlayPanelClass.hasOwnProperty(panelClassKey)) {
                result = panelClass.find((i) => i === panelClassKey);
            }
        }
        return result || "";
    }

    /**
     * Returns all possible positions for a placement
     * Eg: left => [OVERLAY_POSITIONS[centerLeft], OVERLAY_POSITIONS[topLeft], OVERLAY_POSITIONS[bottomLeft]]
     *
     * @param placement
     * @returns ConnectedPosition[]
     */
    private getPositionsForPlacement(
        placement: OverlayPlacement
    ): ConnectedPosition[] {
        let possiblePositionNames: OverlayPosition[] = [];
        switch (placement) {
            case OverlayPlacement.Left:
                possiblePositionNames = [
                    OverlayPosition.centerLeft,
                    OverlayPosition.leftTop,
                    OverlayPosition.leftBottom,
                ];
                break;

            case OverlayPlacement.Right:
                possiblePositionNames = [
                    OverlayPosition.centerRight,
                    OverlayPosition.rightTop,
                    OverlayPosition.rightBottom,
                ];
                break;

            case OverlayPlacement.Top:
                possiblePositionNames = [
                    OverlayPosition.centerTop,
                    OverlayPosition.topLeft,
                    OverlayPosition.topRight,
                ];
                break;

            case OverlayPlacement.Bottom:
                possiblePositionNames = [
                    OverlayPosition.centerBottom,
                    OverlayPosition.bottomLeft,
                    OverlayPosition.bottomRight,
                ];
                break;

            case OverlayPlacement.Custom:
                throw new Error(`Custom position should be handled by user`);
        }

        return possiblePositionNames.map(
            (positionName: OverlayPosition) =>
                this.overlayPositions[positionName]
        );
    }
}

export function getOverlayPositions(): Record<
    OverlayPosition,
    ConnectedPosition
> {
    return {
        // TOP
        [OverlayPosition.centerTop]: {
            panelClass: "overlay-center-top",
            originX: "center",
            originY: "top",
            overlayX: "center",
            overlayY: "bottom",
        },
        [OverlayPosition.topLeft]: {
            panelClass: "overlay-top-left",
            originX: "end",
            originY: "top",
            overlayX: "end",
            overlayY: "bottom",
        },
        [OverlayPosition.topRight]: {
            panelClass: "overlay-top-right",
            originX: "start",
            originY: "top",
            overlayX: "start",
            overlayY: "bottom",
        },
        // BOTTOM
        [OverlayPosition.centerBottom]: {
            panelClass: "overlay-center-bottom",
            originX: "center",
            originY: "bottom",
            overlayX: "center",
            overlayY: "top",
        },
        [OverlayPosition.bottomRight]: {
            panelClass: "overlay-bottom-right",
            originX: "start",
            originY: "bottom",
            overlayX: "start",
            overlayY: "top",
        },
        [OverlayPosition.bottomLeft]: {
            panelClass: "overlay-bottom-left",
            originX: "end",
            originY: "bottom",
            overlayX: "end",
            overlayY: "top",
        },
        // LEFT
        [OverlayPosition.centerLeft]: {
            panelClass: "overlay-center-left",
            originX: "start",
            originY: "center",
            overlayX: "end",
            overlayY: "center",
        },
        [OverlayPosition.leftTop]: {
            panelClass: "overlay-left-top",
            originX: "start",
            originY: "bottom",
            overlayX: "end",
            overlayY: "bottom",
        },
        [OverlayPosition.leftBottom]: {
            panelClass: "overlay-left-bottom",
            originX: "start",
            originY: "top",
            overlayX: "end",
            overlayY: "top",
        },
        // RIGHT
        [OverlayPosition.centerRight]: {
            panelClass: "overlay-center-right",
            originX: "end",
            originY: "center",
            overlayX: "start",
            overlayY: "center",
        },
        [OverlayPosition.rightTop]: {
            panelClass: "overlay-right-top",
            originX: "end",
            originY: "bottom",
            overlayX: "start",
            overlayY: "bottom",
        },
        [OverlayPosition.rightBottom]: {
            panelClass: "overlay-right-bottom",
            originX: "end",
            originY: "top",
            overlayX: "start",
            overlayY: "top",
        },
    };
}
