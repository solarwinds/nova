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

import { DateTimepickerAtom } from "./datetimepicker.atom";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Date-time-picker";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let dateTimePickerBasic: DateTimepickerAtom;
    let dateTimePickerRanged: DateTimepickerAtom;
    let dateTimePickerDialog: DateTimepickerAtom;
    let dialogButtonElem: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser(
            "date-time-picker/date-time-picker-visual-test"
        );
        dateTimePickerBasic = Atom.find(
            DateTimepickerAtom,
            "nui-basic-date-time-picker"
        );
        dateTimePickerRanged = Atom.find(
            DateTimepickerAtom,
            "nui-date-time-picker-ranged"
        );
        dialogButtonElem = element(by.id("nui-visual-test-dialog-btn"));

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`Default`);

        await dateTimePickerBasic.getTimePicker().toggle();
        await dateTimePickerRanged.getDatePicker().hover();
        await camera.say.cheese(`Focus time-picker, hover date-picker`);
        await dateTimePickerBasic.getDatePicker().toggle();
        await dateTimePickerRanged.getTimePicker().hover();
        await camera.say.cheese(`Hover time-picker, focus date-picker`);

        await dateTimePickerRanged.getDatePicker().toggle();
        await camera.say.cheese(`Ranged picker disables dates out of range`);

        await dialogButtonElem.click();
        dateTimePickerDialog = Atom.find(
            DateTimepickerAtom,
            "nui-date-time-picker-dialog"
        );

        await dateTimePickerDialog.getDatePicker().toggle();
        await camera.say.cheese(`Date Time Picker Dialog Date`);
        await dateTimePickerDialog.getTimePicker().toggle();
        await camera.say.cheese(`Date Time Picker Dialog Time`);

        await Helpers.switchDarkTheme("on");
        await dateTimePickerDialog.getDatePicker().toggle();
        await camera.say.cheese(`Dark theme - Date Time Picker Dialog Date`);
        await dateTimePickerDialog.getTimePicker().toggle();
        await camera.say.cheese(`Dark theme - Date Time Picker Dialog Time`);

        await camera.turn.off();
    }, 200000);
});
