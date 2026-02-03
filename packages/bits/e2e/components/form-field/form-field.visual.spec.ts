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

import { Locator } from "@playwright/test";

import { Atom } from "../../atom";
import { Animations, Helpers, test } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";
import { CheckboxAtom } from "../checkbox/checkbox.atom";
import { CheckboxGroupAtom } from "../checkbox-group/checkbox-group.atom";
import { ComboboxAtom } from "../combobox/combobox.atom";
import { RadioGroupAtom } from "../radio-group/radio-group.atom";
import { SelectAtom } from "../select/select.atom";
import { SwitchAtom } from "../switch/switch.atom";
import { TextboxAtom } from "../textbox/textbox.atom";
import { TimepickerAtom } from "../timepicker/timepicker.atom";

const name: string = "Form Field";

test.describe(`Visual tests: ${name}`, () => {
    let textbox: TextboxAtom;
    let nickname: TextboxAtom;
    let city: TextboxAtom;
    let checkbox: CheckboxAtom;
    let switchElement: SwitchAtom;
    let checkboxGroup: CheckboxGroupAtom;
    let radioGroup: RadioGroupAtom;
    let combobox: ComboboxAtom;
    let select: SelectAtom;
    let timepicker: TimepickerAtom;
    let markAsDirty: Locator;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("form-field/form-field-visual-test", page);
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);
        nickname = Atom.find<TextboxAtom>(
            TextboxAtom,
            "nui-form-field-visual-test-nickname"
        );
        city = Atom.find<TextboxAtom>(TextboxAtom, "nui-form-field-visual-test-city");
        textbox = Atom.find<TextboxAtom>(TextboxAtom, "nui-form-field-visual-test-textbox");
        checkbox = Atom.find<CheckboxAtom>(
            CheckboxAtom,
            "nui-form-field-visual-test-checkbox"
        );
        switchElement = Atom.find<SwitchAtom>(
            SwitchAtom,
            "nui-form-field-visual-test-switch"
        );
        checkboxGroup = Atom.find<CheckboxGroupAtom>(
            CheckboxGroupAtom,
            "nui-form-field-visual-test-checkbox-group"
        );
        radioGroup = Atom.find<RadioGroupAtom>(
            RadioGroupAtom,
            "nui-form-field-visual-test-radio"
        );
        combobox = Atom.find<ComboboxAtom>(
            ComboboxAtom,
            "nui-form-field-visual-test-combobox",
            true
        );
        select = Atom.find<SelectAtom>(SelectAtom, "nui-form-field-visual-test-select", true);
        timepicker = Atom.find<TimepickerAtom>(
            TimepickerAtom,
            "nui-form-field-visual-test-timepicker"
        );
        markAsDirty = page.locator("#nui-demo-mark-as-touched-button");
    });

    test(`${name} visual test`, async ({ page }) => {
        const camera = new Camera().loadFilm(page, name, "Bits");
        await camera.turn.on();

        await markAsDirty.click();
        await camera.say.cheese("The entire form is invalid");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme test 1");

        await Helpers.switchDarkTheme("off");
        await nickname.acceptText("John Wick");
        await city.acceptText("New York");
        await textbox.acceptText("Default text");
        await checkbox.toggle();
        await switchElement.toggle();
        await checkboxGroup.getCheckboxByIndex(0).toggle();
        await radioGroup.getRadioByValue("Carrot").click();
        await combobox.select("Cabbage");
        await select.select("Cabbage");
        await timepicker.selectTime("17:30");
        await camera.say.cheese("The entire form is valid");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    });
});
