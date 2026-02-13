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

import { test, Helpers, Animations } from "../../setup";
import { Atom } from "../../atom";
import { DateTimepickerAtom } from "./datetimepicker.atom";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Date-time-picker";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let dateTimePickerBasic: DateTimepickerAtom;
    let dateTimePickerRanged: DateTimepickerAtom;
    let dateTimePickerDialog: DateTimepickerAtom;
    let dialogButton: Locator;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("date-time-picker/date-time-picker-visual-test", page);
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);
        dateTimePickerBasic = Atom.find<DateTimepickerAtom>(
            DateTimepickerAtom,
            "nui-basic-date-time-picker"
        );
        dateTimePickerRanged = Atom.find<DateTimepickerAtom>(
            DateTimepickerAtom,
            "nui-date-time-picker-ranged"
        );
        dialogButton = Helpers.page.locator("#nui-visual-test-dialog-btn");

        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`Default`);

        await dateTimePickerBasic.timePicker.toggle();
        await dateTimePickerRanged.datePicker.hover();
        await camera.say.cheese(`Focus time-picker, hover date-picker`);
        await dateTimePickerBasic.datePicker.toggle();
        await dateTimePickerRanged.timePicker.hover();
        await camera.say.cheese(`Hover time-picker, focus date-picker`);

        await dateTimePickerRanged.datePicker.toggle();
        await camera.say.cheese(`Ranged picker disables dates out of range`);

        await dialogButton.click();
        dateTimePickerDialog = Atom.find<DateTimepickerAtom>(
            DateTimepickerAtom,
            "nui-date-time-picker-dialog"
        );

        await dateTimePickerDialog.datePicker.toggle();
        await camera.say.cheese(`Date Time Picker Dialog Date`);
        await dateTimePickerDialog.timePicker.toggle();
        await camera.say.cheese(`Date Time Picker Dialog Time`);

        await Helpers.switchDarkTheme("on");
        await dateTimePickerDialog.datePicker.toggle();
        await camera.say.cheese(`Dark theme - Date Time Picker Dialog Date`);
        await dateTimePickerDialog.timePicker.toggle();
        await camera.say.cheese(`Dark theme - Date Time Picker Dialog Time`);

        await camera.turn.off();
    });
});
