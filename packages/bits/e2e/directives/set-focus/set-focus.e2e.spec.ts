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


import { Atom } from "../../atom";
import { ButtonAtom } from "../../components/button/button.atom";
import { Helpers , test, expect} from "../../setup";

test.describe("USERCONTROL setFocus:", () => {
    let carrotRadio: Locator;
    let onionRadio: Locator;
    let carrotBtnAtom: ButtonAtom;
    let onionBtnAtom: ButtonAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("common/set-focus", page);
        carrotRadio = Helpers.page.locator("#nui-demo-setfocus-radio-carrot").locator(
            Helpers.page.locator("input")
        );
        onionRadio = Helpers.page.locator("#nui-demo-setfocus-radio-onion").locator(
            Helpers.page.locator("input")
        );
        carrotBtnAtom = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-setfocus-button-carrot"
        );
        onionBtnAtom = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-setfocus-button-onion");
    });

    test("click button that handle a prop bound to the 'nuiSetFocus' changes focus", async () => {
        await expectIsNotSelected(carrotRadio);
        await carrotBtnAtom.click();
        await expectIsSelected(carrotRadio);
    });

    test("if several component have 'nuiSetFocus' = true, focus gets the latest component", async () => {
        await expectIsNotSelected(carrotRadio);
        await expectIsNotSelected(onionRadio);
        await carrotBtnAtom.click();
        await expectIsSelected(carrotRadio);
        await expectIsNotSelected(onionRadio);
        await onionBtnAtom.click();
        await expectIsSelected(onionRadio);
        await expectIsNotSelected(carrotRadio);
    });

    async function expectIsSelected(finder: Locator) {
        const activeElementHandle = await Helpers.page.evaluateHandle(() => document.activeElement);
        const isSameElement = await finder.evaluate((el, active) => el === active, activeElementHandle);
        expect(isSameElement).toBe(true);
    }

    async function expectIsNotSelected(finder: Locator) {
        const activeElementHandle = await Helpers.page.evaluateHandle(() => document.activeElement);
        const isEqual = await finder.evaluate((el, active) => el === active, activeElementHandle);
        expect(isEqual).toBe(false);
    }
});
