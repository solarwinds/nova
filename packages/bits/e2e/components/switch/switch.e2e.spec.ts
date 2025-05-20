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

import { SwitchAtom } from "./switch.atom";
import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";
import { ButtonAtom } from "../button/button.atom";

test.describe("USERCONTROL switch", () => {
    let switchComponent: SwitchAtom;
    let disabledSwitchComponent: SwitchAtom;
    let toggleDisableBtn: ButtonAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("switch/switch-test", page);
        switchComponent = Atom.find<SwitchAtom>(
            SwitchAtom,
            "nui-switch-simple-example"
        );
        disabledSwitchComponent = Atom.find<SwitchAtom>(
            SwitchAtom,
            "nui-switch-disabled-example"
        );
        toggleDisableBtn = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-switch-toggle-button"
        );
    });

    test("should be switched on by default ", async () => {
        await switchComponent.isOn();
    });

    test("should be active by default ", async () => {
        await switchComponent.isNotDisabled();
    });

    test("should toggle css class on click ", async () => {
        await switchComponent.slider.click();
        await switchComponent.isOff();
    });

    test("should change value on click of the switch", async () => {
        await expect(switchComponent.labelElement).toContainText("On");
        await switchComponent.slider.click();
        await expect(switchComponent.labelElement).toContainText("Off");
    });

    test("should not change value on click if disabled (inactive)", async () => {
        await expect(switchComponent.labelElement).toContainText("On");
        await disabledSwitchComponent.isDisabled();

        // webdriver does not allow clicking on disabled elements, so we have to use browser action
        await disabledSwitchComponent.getLocator().evaluate((el: HTMLElement) => el.click());

        await expect(switchComponent.labelElement).toContainText("On");
    });

    test("should retain value after disable toggle", async () => {
        await disabledSwitchComponent.isOn();
        await toggleDisableBtn.click();
        await disabledSwitchComponent.isOn();
        await disabledSwitchComponent.slider.click();
        await disabledSwitchComponent.isOff();
        await toggleDisableBtn.click();
        await toggleDisableBtn.click();
        await disabledSwitchComponent.isOff();
    });

    test("should change value with spacebar", async () => {
        await switchComponent.isOn();
        await switchComponent.slider.press("Space");
        await switchComponent.isOff();
        await switchComponent.slider.press("Space");
        await switchComponent.isOn();
    });
});
