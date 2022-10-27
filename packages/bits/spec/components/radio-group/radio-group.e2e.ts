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
import { Helpers } from "../../helpers";
import { CheckboxAtom } from "../checkbox/checkbox.atom";
import { RadioGroupAtom } from "../public_api";

describe("USERCONTROL Radio group", () => {
    let basicGroup: RadioGroupAtom;
    let disabledGroup: RadioGroupAtom;
    let toggleDisabledGroupCheckbox: CheckboxAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("radio-group/radio-group-test");
        basicGroup = Atom.find(RadioGroupAtom, "basic-radio-group");
        disabledGroup = Atom.find(RadioGroupAtom, "disabled-radio-group");
        toggleDisabledGroupCheckbox = Atom.find(
            CheckboxAtom,
            "toggle-disabled-group-checkbox"
        );
    });

    it("should have 'Kiwi' fruit value", async () => {
        await basicGroup.getRadioByValue("Kiwi").click();
        expect(await basicGroup.getValue()).toEqual("Kiwi");
    });

    it("should not be allowed to select if disabled", async () => {
        const bananaRadioInput = basicGroup.getRadioInputByValue("Banana");
        const bananaRadioLabel = basicGroup.getRadioByValue("Banana");
        const papayaRadioLabel = basicGroup.getRadioByValue("Papaya");
        const orangeRadioLabel = basicGroup.getRadioByValue("Orange");
        expect(await bananaRadioInput.isEnabled()).toBe(false);
        await papayaRadioLabel.click();
        await bananaRadioLabel.click();
        expect(await basicGroup.getValue()).not.toEqual("Banana");
        expect(await basicGroup.getValue()).toEqual("Papaya");
        expect(await basicGroup.isRadioSelected("Papaya")).toBe(true);
        // Return to initial state
        await orangeRadioLabel.click();
        expect(await basicGroup.getValue()).toEqual("Orange");
    });

    it("should initialize a disabled state and be able to handle dynamic disabled state change", async () => {
        const total = await disabledGroup.getNumberOfItems();
        expect(await disabledGroup.getNumberOfDisabledItems()).toBe(total);
        await toggleDisabledGroupCheckbox.toggle();
        expect(await disabledGroup.getNumberOfDisabledItems()).toBe(0);
        await toggleDisabledGroupCheckbox.toggle();
        expect(await disabledGroup.getNumberOfDisabledItems()).toBe(total);
    });
});
