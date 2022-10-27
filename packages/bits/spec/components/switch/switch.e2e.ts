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

import { browser, Key } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom, SwitchAtom } from "../public_api";

describe("USERCONTROL switch", () => {
    let switchComponent: SwitchAtom;
    let disabledSwitchComponent: SwitchAtom;
    let toggleDisableBtn: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("switch/switch-test");
        switchComponent = Atom.find(SwitchAtom, "nui-switch-simple-example");
        disabledSwitchComponent = Atom.find(
            SwitchAtom,
            "nui-switch-disabled-example"
        );
        toggleDisableBtn = Atom.find(ButtonAtom, "nui-switch-toggle-button");
    });

    // cleanup
    beforeEach(async () => {
        if (!(await switchComponent.isOn())) {
            await switchComponent.slider().click();
        }
        if (!(await switchComponent.slider().isEnabled())) {
            await toggleDisableBtn.click();
        }
    });

    it("should be switched on by default ", async () => {
        expect(await switchComponent.isOn()).toBe(true);
    });

    it("should be active by default ", async () => {
        expect(await switchComponent.disabled()).toBe(false);
    });

    it("should toggle css class on click ", async () => {
        await switchComponent.slider().click();
        expect(await switchComponent.isOn()).toBe(false);
    });

    it("should change value on click of the switch", async () => {
        expect(await switchComponent.labelText()).toBe("On");
        await switchComponent.slider().click();
        expect(await switchComponent.labelText()).toBe("Off");
    });

    it("should not change value on click if disabled (inactive)", async () => {
        expect(await disabledSwitchComponent.labelText()).toBe("On");
        expect(await disabledSwitchComponent.disabled()).toBe(true);

        // webdriver does not allow clicking on disabled elements, so we have to use browser action
        const webElem = await disabledSwitchComponent.slider().getWebElement();

        const size = await webElem.getSize();
        await browser
            .actions()
            .mouseMove(webElem, { x: size.width / 2, y: size.height / 2 })
            .click()
            .perform();
        await browser.sleep(500);

        expect(await disabledSwitchComponent.labelText()).toBe("On");
    });

    it("should retain value after disable toggle", async () => {
        expect(await disabledSwitchComponent.isOn()).toBe(true);
        await toggleDisableBtn.click();
        expect(await disabledSwitchComponent.isOn()).toBe(true);
        await disabledSwitchComponent.slider().click();
        expect(await disabledSwitchComponent.isOn()).toBe(false);
        await toggleDisableBtn.click();
        await toggleDisableBtn.click();
        expect(await disabledSwitchComponent.isOn()).toBe(false);
    });

    it("should change value with spacebar", async () => {
        expect(await switchComponent.isOn()).toBe(true);
        await switchComponent.slider().sendKeys(Key.SPACE);
        expect(await switchComponent.isOn()).toBe(false);
        await switchComponent.slider().sendKeys(Key.SPACE);
        expect(await switchComponent.isOn()).toBe(true);
    });
});
