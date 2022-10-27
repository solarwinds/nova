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

import { Injectable } from "@angular/core";
import includes from "lodash/includes";
import isUndefined from "lodash/isUndefined";

import { IEventPropagationService } from "./public-api";

/**
 * <example-url>./../examples/index.html#/common/event-propagation-service</example-url>
 */

/**
 *  Service that provides event propagation rules for NUI components.
 *
 * __Name :__
 * Event Propagation service
 *
 */

/** @ignore */
@Injectable({ providedIn: "root" })
export class EventPropagationService implements IEventPropagationService {
    private preventedTargetSelectors: string[] = [
        "a",
        "nui-checkbox-mark",
        "nui-checkbox-glyph",
        "nui-checkbox-input",
        "input",
        "button",
    ];

    // nui-button uses transclusion and so we need to check the parent too
    private preventedTargetParentSelectors: string[] = [
        "button",
        "nui-button-content",
    ];

    private should: boolean;

    /**
     * __Description:__
     * Returns a boolean which indicates if event should propagate based on predefined list of selectors.
     * @param   event Event to handle propagation.
     * @returns  Value indicating whether that event should be propagated.
     */
    public targetShouldPropagate(event: Event): boolean {
        // TODO: Refactor event.target logic, incorrect type, EventTarget type does not contain parentElement property
        const element = <Element>event.target;
        const parentElement: HTMLElement | undefined =
            element.parentElement ?? undefined;
        this.should = true;

        if (isUndefined(parentElement)) {
            throw new Error("parentElement is not defined");
        }

        this.compareElementSelector(this.preventedTargetSelectors, element);
        this.compareElementSelector(
            this.preventedTargetParentSelectors,
            parentElement
        );

        return this.should;
    }

    /**
     * __Description:__
     * Helper compare function
     * @param   selectors Selectors list to compare with.
     * @param  element Event's target element or its parent.
     * @returns  Value indicating whether that event should be propagated.
     */
    private compareElementSelector(selectors: string[], element: Element) {
        selectors.forEach((selector: string) => {
            if (
                element.tagName.toLowerCase() === selector ||
                includes(element.classList, selector)
            ) {
                return (this.should = false);
            }
        });
    }
}
