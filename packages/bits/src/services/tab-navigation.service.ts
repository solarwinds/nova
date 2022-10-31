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

import { ElementRef, Injectable } from "@angular/core";
import isNull from "lodash/isNull";

export const focusableElementsCSSSelector =
    "[tabindex], button, a, input:not([type=hidden])";

interface IFocusableElement {
    nativeElement: Element;
    tabIndex?: string;
}

interface ITabNavigationService {
    disableTabNavigation(domElRef: ElementRef): void;

    restoreTabNavigation(): void;
}

@Injectable()
export class TabNavigationService implements ITabNavigationService {
    // cache to remember the altered DOM elements that will be later restored
    private tabFocusableElements: IFocusableElement[] = [];

    public disableTabNavigation(domElRef: ElementRef) {
        // dom manipulation to cache the altered elements
        // and do tabIndex=-1 on focusable HTML elements
        this.tabFocusableElements = [];
        domElRef.nativeElement
            .querySelectorAll(focusableElementsCSSSelector)
            .forEach((domEl: Element) => {
                const tabIndex = domEl.getAttribute("tabindex");
                this.tabFocusableElements.push({
                    nativeElement: domEl,
                    tabIndex: isNull(tabIndex) ? undefined : tabIndex,
                });

                // disable focusing element via tab
                domEl.setAttribute("tabindex", "-1");
            });
    }

    public restoreTabNavigation() {
        // dom manipulation to restore the tabIndex for the cached elements
        // and remove the tabIndex for those who didn't had it at all
        this.tabFocusableElements.forEach((e) => {
            if (e?.tabIndex?.length) {
                e.nativeElement.setAttribute("tabindex", e.tabIndex);
            } else {
                e.nativeElement.removeAttribute("tabindex");
            }
        });
    }
}
