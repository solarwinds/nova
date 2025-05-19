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

import { ElementRef } from "@angular/core";

import {
    focusableElementsCSSSelector,
    TabNavigationService,
} from "./tab-navigation.service";

class MockElementRef extends ElementRef {}

describe("services >", () => {
    describe("tab-navigation-service >", () => {
        const htmlTemplate = `
            <div tabindex="1"></div>
            <button>button</button>
            <a href="#" tabindex="2">link</a>
            <input type="text" value="empty"/>
        `;
        const nativeElement = document.createElement("div");

        let tabNavigationService: TabNavigationService;
        let elRef: ElementRef;

        beforeEach(() => {
            // restore initial HTML between tests
            nativeElement.innerHTML = htmlTemplate;

            tabNavigationService = new TabNavigationService();
            elRef = new MockElementRef(nativeElement);
        });

        it("should detect navigatable elements and disable tab navigation for them", () => {
            tabNavigationService.disableTabNavigation(elRef);

            const tabFocusableElements = elRef.nativeElement.querySelectorAll(
                focusableElementsCSSSelector
            );

            // all known use cases are detected
            // - div with tabindex attribute
            // - button
            // - link
            // - input
            expect(tabFocusableElements.length).toBe(4);

            tabFocusableElements.forEach((domEl: Element) => {
                expect(domEl.hasAttribute("tabindex")).toBeTruthy(
                    `Element tag '${domEl.tagName}' doesn't have tabindex attribute`
                );

                expect(domEl.getAttribute("tabindex")).toBe(
                    "-1",
                    `Element tag '${domEl.tagName}' should have tabindex="-1"`
                );
            });
        });

        it("should enable tab navigation after busy is disabled and restore tabindex", () => {
            tabNavigationService.disableTabNavigation(elRef);
            tabNavigationService.restoreTabNavigation();

            const tabFocusableElements = elRef.nativeElement.querySelectorAll(
                focusableElementsCSSSelector
            );

            // all known use cases are detected
            expect(tabFocusableElements.length).toBe(4);

            // div had a initial tab index
            expect(tabFocusableElements[0].getAttribute("tabindex")).toBe("1");

            // button didn't had initially a tab index
            expect(
                tabFocusableElements[1].hasAttribute("tabindex")
            ).toBeFalsy();

            // a tag had initially a tab index
            expect(tabFocusableElements[2].getAttribute("tabindex")).toBe("2");

            // input didn't had initially a tab index
            expect(
                tabFocusableElements[3].hasAttribute("tabindex")
            ).toBeFalsy();
        });
    });
});
