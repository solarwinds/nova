import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import _capitalize from "lodash/capitalize";
import _get from "lodash/get";
import _isNil from "lodash/isNil";
import _parseInt from "lodash/parseInt";

import { DomUtilService } from "./dom-util.service";
import { LoggerService } from "./log-service";
import {
    IEdgeDefinerMeasurements,
    IEdgeDetectionProperties,
    IEdgeDetectionResult,
} from "./public-api";

/**
 * <example-url>./../examples/index.html#/common/edge-detection-service</example-url>
 */

/**
 * @dynamic
 * @ignore
 *  Service that helps to calculate free space for dynamic elements (popover, dropdown, etc.) and define the best
 *  direction to show them. There are two ways how detection can be made:
 *  1) default one - detection is made within viewport area.
 *  2) custom container can be used for detection. Identify such container using 'nui-edge-definer' CSS-class.
 *
 * __Name :__
 * Edge Detection Service
 */

@Injectable({ providedIn: "root" })
export class EdgeDetectionService {
    public edgeDefinerSelector = ".nui-edge-definer";
    public initialEdgeDetectionResult: IEdgeDetectionResult;

    constructor(
        @Inject(DomUtilService) private domUtilService: DomUtilService,
        @Inject(DOCUMENT) private document: Document,
        private logger: LoggerService
    ) {
        this.initialEdgeDetectionResult = {
            placed: {
                top: false,
                right: false,
                bottom: false,
                left: false,
            },
            aligned: {
                top: false,
                right: false,
                bottom: false,
                left: false,
            },
        };
    }

    public canBe = (
        basePoint: HTMLElement,
        placed: HTMLElement,
        edgeDefinerElement?: Element
    ): IEdgeDetectionResult | undefined => {
        if (!basePoint || !placed) {
            this.logger.error(
                "basePoint: Element and placed: Element arguments are required!"
            );
            return;
        }

        const result = this.initialEdgeDetectionResult;
        const edgeDefiner =
            edgeDefinerElement ||
            this.domUtilService.getClosest(basePoint, this.edgeDefinerSelector);
        const basePosition = this.offset(basePoint).position;
        const baseWidth = this.outer(basePoint, "width");
        const baseHeight = this.outer(basePoint, "height");
        const depositWidth = this.outer(placed, "width");
        const depositHeight = this.outer(placed, "height");
        const container = this.getEdgeDefinerMeasurements(<Element>edgeDefiner);

        if (_isNil(this.document.defaultView)) {
            throw new Error("Document defaultView is not available");
        }

        result.placed.top =
            basePosition.top - container.position.top - depositHeight >
            this.document.defaultView.pageYOffset;
        result.placed.right =
            basePosition.left -
                container.position.left +
                baseWidth +
                depositWidth <
            container.width + this.document.defaultView.pageXOffset;
        result.placed.bottom = edgeDefiner
            ? basePosition.top + baseHeight + depositHeight <
              container.position.top + container.height
            : basePosition.top -
                  container.position.top +
                  baseHeight +
                  depositHeight <
              container.height + this.document.defaultView.pageYOffset;
        result.placed.left =
            basePosition.left - container.position.left - depositWidth >
            this.document.defaultView.pageXOffset;

        result.aligned.top =
            basePosition.top - container.position.top + depositHeight <
            this.document.defaultView.pageYOffset + container.height;
        result.aligned.right =
            basePosition.left -
                container.position.left +
                baseWidth -
                depositWidth >
            this.document.defaultView.pageXOffset;
        result.aligned.bottom =
            basePosition.top -
                container.position.top +
                baseHeight -
                depositHeight >
            this.document.defaultView.pageYOffset;
        result.aligned.left =
            basePosition.left - container.position.left + depositWidth <
            this.document.defaultView.pageXOffset + container.width;

        return result;
    };

    private outer(element: HTMLElement, dimension: "width" | "height"): number {
        const clientValue = _get(element, `offset${_capitalize(dimension)}`);
        if (clientValue) {
            return clientValue;
        }
        return _parseInt(_get(getComputedStyle(element), dimension));
    }

    private offset(element: HTMLElement): IEdgeDetectionProperties {
        const rect = element.getBoundingClientRect();
        const scrollLeft =
            this.document.defaultView?.pageXOffset ||
            this.document.documentElement.scrollLeft;
        const scrollTop =
            this.document.defaultView?.pageYOffset ||
            this.document.documentElement.scrollTop;
        const rectHeight = rect.top < 0 ? rect.height + rect.top : rect.height;
        return {
            position: {
                top: rect.top + scrollTop,
                left: rect.left + scrollLeft,
            },
            height: rectHeight,
        };
    }

    private getEdgeDefinerMeasurements(
        edgeDefiner: Element
    ): IEdgeDefinerMeasurements {
        if (edgeDefiner) {
            return {
                position: this.offset(edgeDefiner as HTMLElement).position,
                width: edgeDefiner.clientWidth,
                height: this.offset(edgeDefiner as HTMLElement).height,
                scrollY: edgeDefiner.scrollTop,
                scrollX: edgeDefiner.scrollLeft,
            };
        }

        if (_isNil(this.document.defaultView)) {
            throw new Error("Document defaultView is not available");
        }

        return {
            position: { top: 0, left: 0 },
            width: this.document.defaultView.innerWidth,
            height: this.document.defaultView.innerHeight,
            scrollY: this.document.defaultView.pageYOffset,
            scrollX: this.document.defaultView.pageXOffset,
        };
    }
}
