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

import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { TimepickerAtom } from "../timepicker/timepicker.atom";

const name: string = "Timepicker";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let basicTimepicker: TimepickerAtom;
    let customFormatTimepicker: TimepickerAtom;
    let customStepTimepicker: TimepickerAtom;
    let requiredTimepicker: TimepickerAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("time-picker/time-picker-visual-test");
        basicTimepicker = Atom.find(
            TimepickerAtom,
            "nui-visual-test-timepicker-basic"
        );
        customFormatTimepicker = Atom.find(
            TimepickerAtom,
            "nui-visual-test-custom-format-timepicker"
        );
        customStepTimepicker = Atom.find(
            TimepickerAtom,
            "nui-visual-test-custom-step-timepicker"
        );
        requiredTimepicker = Atom.find(
            TimepickerAtom,
            "nui-visual-test-required-timepicker"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`Default`);

        await customStepTimepicker.toggle();
        await basicTimepicker.textbox.hover();
        await camera.say.cheese(
            "Timepicker with custom step is toggled and Basic Timepicker is hovered"
        );

        await customFormatTimepicker.toggle();
        await camera.say.cheese("Timepicker with custom format is toggled");

        await customFormatTimepicker.toggle();
        await requiredTimepicker.toggle();
        await camera.say.cheese("Timepicker with validation is toggled");

        await basicTimepicker.toggle();
        await basicTimepicker.menuPopup.clickItemByText("2");
        await basicTimepicker.toggle();
        await basicTimepicker.menuPopup.hover(
            basicTimepicker.menuPopup.getSelectedItem()
        );
        await camera.say.cheese(
            "Selected menuitem in Basic Timepicker is focused"
        );

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await basicTimepicker.menuPopup.hover(
            basicTimepicker.menuPopup.getItemByIndex(2)
        );
        await camera.say.cheese(
            "Unelected menuitem in Basic Timepicker is focused"
        );

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme with focus`);

        await camera.turn.off();
    }, 200000);
});
