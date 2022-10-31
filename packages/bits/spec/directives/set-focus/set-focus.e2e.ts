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

import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../../components/public_api";
import { Helpers } from "../../helpers";

describe("USERCONTROL setFocus:", () => {
    let carrotRadio: ElementFinder;
    let onionRadio: ElementFinder;
    let carrotBtnAtom: ButtonAtom;
    let onionBtnAtom: ButtonAtom;

    beforeEach(async () => {
        await Helpers.prepareBrowser("common/set-focus");
        carrotRadio = element(by.id("nui-demo-setfocus-radio-carrot")).element(
            by.tagName("input")
        );
        onionRadio = element(by.id("nui-demo-setfocus-radio-onion")).element(
            by.tagName("input")
        );
        carrotBtnAtom = Atom.find(
            ButtonAtom,
            "nui-demo-setfocus-button-carrot"
        );
        onionBtnAtom = Atom.find(ButtonAtom, "nui-demo-setfocus-button-onion");
    });

    it("click button that handle a prop bound to the 'nuiSetFocus' changes focus", async () => {
        await expectIsNotSelected(carrotRadio);
        await carrotBtnAtom.click();
        await expectIsSelected(carrotRadio);
    });

    it("if several component have 'nuiSetFocus' = true, focus gets the latest component", async () => {
        await expectIsNotSelected(carrotRadio);
        await expectIsNotSelected(onionRadio);
        await carrotBtnAtom.click();
        await expectIsSelected(carrotRadio);
        await expectIsNotSelected(onionRadio);
        await onionBtnAtom.click();
        await expectIsSelected(onionRadio);
        await expectIsNotSelected(carrotRadio);
    });

    async function expectIsSelected(finder: ElementFinder) {
        expect(
            await finder.equals(await browser.driver.switchTo().activeElement())
        ).toEqual(true);
        await browser.driver.switchTo().defaultContent();
    }

    async function expectIsNotSelected(finder: ElementFinder) {
        expect(
            await finder.equals(await browser.driver.switchTo().activeElement())
        ).toEqual(false);
        await browser.driver.switchTo().defaultContent();
    }
});
