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

// TODO: Refactor class to use strongly typed values
/**
 * Service providing DOM utilities
 */
/**
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class DomUtilService {
    constructor(@Inject(DOCUMENT) private document: any) {}

    /**
     * Gets the closest parent element matching the specified selector
     * @param elem the source element
     * @param selector the selector to match
     * @returns the matching element
     */
    public getClosest = (elem: HTMLElement | undefined, selector: string) => {
        // Element.matches() polyfill
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                (Element.prototype as any).msMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function (slctr: string): boolean {
                    const matches =
                        // @ts-ignore: 'this' implicitly has type 'any' because it does not have a type annotation
                        // An outer value of 'this' is shadowed by this container.
                        (this.document || this.ownerDocument).querySelectorAll(
                            slctr
                        );
                    let index = matches.length - 1;
                    // @ts-ignore: 'this' implicitly has type 'any' because it does not have a type annotation
                    // An outer value of 'this' is shadowed by this container.
                    while (index >= 0 && matches.item(index) !== this) {
                        --index;
                    }
                    return index > -1;
                };
        }

        // Get the closest matching element
        for (
            ;
            elem && elem !== this.document;
            elem = elem.parentElement ?? undefined
        ) {
            if (elem?.matches(selector)) {
                return elem;
            }
        }
        return null;
    };
}
