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
import { Injectable, inject } from "@angular/core";
import _isNull from "lodash/isNull";

import { OVERLAY_CONTAINER_CLASS, OVERLAY_DEFAULT_PRIORITY } from "./types";

const PRIORITY_ATTRIBUTE = "priority";

/** @dynamic */
@Injectable({ providedIn: "root" })
export class OverlayContainerService {
    private document = inject<Document>(DOCUMENT);


    /**
     * Create a shared container to be used by all overlays if needed
     *
     * @param elementOrSelector - specifies the container where the overlay will be created
     * @param priority          - used for rendering overlays above or below others
     *                            (lower values will be rendered below higher priority values)
     */
    public getOverlayContainer(
        elementOrSelector: Element | string = this.document.body,
        priority: number = OVERLAY_DEFAULT_PRIORITY
    ): HTMLElement {
        // eslint-disable-next-line no-undef-init
        let elementFromSelector: HTMLElement | undefined = undefined;

        if (typeof elementOrSelector === "string") {
            const result: HTMLElement | null =
                this.document.querySelector<HTMLElement>(elementOrSelector);
            elementFromSelector = !_isNull(result) ? result : undefined;

            if (!elementFromSelector) {
                throw new Error(
                    `Specified overlay container '${
                        elementOrSelector || "body"
                    }' was not found in the DOM.`
                );
            }
        }

        // according priority to custom container selector provided by user.
        const targetContainer: HTMLElement =
            elementFromSelector ??
            <HTMLElement>elementOrSelector ??
            this.document.body;
        const sharedContainer = this.createSharedContainer(targetContainer);

        let overlayContainer: HTMLElement | undefined;

        const overlayPriorityClass = "overlay-container-priority";
        const desiredPriorityClass = priority.toString().padStart(3, "0");
        let lastPriorityDomEl: HTMLElement | undefined;

        let overlays: NodeListOf<HTMLElement>;

        if (targetContainer === this.document.body) {
            overlays = this.document.querySelectorAll(
                `body > .cdk-overlay-container > .${overlayPriorityClass}`
            );
        } else {
            overlays = sharedContainer.querySelectorAll(
                `.${overlayPriorityClass}`
            );
        }

        // loop through all our priorities in case we have any
        for (let i = 0; i < overlays.length; i++) {
            lastPriorityDomEl = overlays[i];

            if (
                lastPriorityDomEl.getAttribute(PRIORITY_ATTRIBUTE) ===
                desiredPriorityClass
            ) {
                // we already have our priority container
                overlayContainer = lastPriorityDomEl;
            }

            // we need to stop if our priority is higher than the desired priority
            if (
                (lastPriorityDomEl.getAttribute(PRIORITY_ATTRIBUTE) ?? "") >
                desiredPriorityClass
            ) {
                break;
            }
        }

        if (!overlayContainer) {
            const div: HTMLElement = this.document.createElement("div");
            div.classList.add(overlayPriorityClass);
            div.setAttribute(PRIORITY_ATTRIBUTE, desiredPriorityClass);

            if (!lastPriorityDomEl) {
                // create our priority element in case our shared container just got created
                // and we don't have any priorities yet
                overlayContainer = sharedContainer.appendChild(div);
            } else {
                // create our priory element before or after the last priority DOM element
                // depending on the desired priority
                overlayContainer = lastPriorityDomEl.insertAdjacentElement(
                    (lastPriorityDomEl.getAttribute(PRIORITY_ATTRIBUTE) ?? "") >
                        desiredPriorityClass
                        ? "beforebegin"
                        : "afterend",
                    div
                ) as HTMLElement;
            }
        }

        return overlayContainer;
    }

    private createSharedContainer(targetContainer: Element): Element {
        let sharedContainer: Element | undefined;

        if (targetContainer === this.document.body) {
            // create shared container only if it doesn't exist already
            sharedContainer =
                targetContainer.querySelector(
                    `body > .${OVERLAY_CONTAINER_CLASS}`
                ) ?? undefined;
        } else {
            // create shared container only if it doesn't exist already
            sharedContainer =
                targetContainer.querySelector(`.${OVERLAY_CONTAINER_CLASS}`) ??
                undefined;
        }

        if (!sharedContainer) {
            sharedContainer = this.document.createElement("div");
            sharedContainer.classList.add(
                OVERLAY_CONTAINER_CLASS,
                "cdk-overlay-container"
            );
            targetContainer.appendChild(sharedContainer);
        }

        return sharedContainer;
    }
}
