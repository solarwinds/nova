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

import { by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom, ContentAtom } from "../public_api";

// region Test cases
describe("USERCONTROL content: ", () => {
    let atom: ContentAtom;
    let testSmallElement: ElementFinder;
    let testLargeElement: ElementFinder;
    let contentSmallElem: ElementFinder;
    let contentLargeElem: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("content");

        atom = Atom.find(ContentAtom, "test-element-small");

        testSmallElement = element(by.id("test-element-small"));
        contentSmallElem = testSmallElement.element(
            by.className("nui-content")
        );

        testLargeElement = element(by.id("test-element-large"));
        contentLargeElem = testLargeElement.element(
            by.className("nui-content")
        );
    });

    it("should display passed content", async () => {
        const btnAtom = Atom.find(ButtonAtom, "test-element");
        expect(await btnAtom.getElement().getText()).toEqual("Click");
        await btnAtom.click();
        expect(await btnAtom.getElement().getText()).toEqual("Clicked!");
    });

    it("should have scrollbar if its size is too small for content", async () => {
        expect(await atom.hasScrollbar(contentSmallElem)).toBe(true);
    });

    xit("should hide scrollbar if its size is enough space for content", async () => {
        expect(await atom.hasScrollbar(contentLargeElem)).toBe(false);
    });
});
// endregion
