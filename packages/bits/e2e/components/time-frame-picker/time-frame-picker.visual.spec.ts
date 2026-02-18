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

import { QuickPickerAtom } from "./quick-picker.atom";
import { TimeFramePickerAtom } from "./time-frame-picker.atom";
import { Atom } from "../../atom";
import { test, Helpers, Animations } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";
import { PopoverAtom } from "../popover/popover.atom";

const name: string = "Timeframe Picker";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let popoverWithTimeframePicker: PopoverAtom;
    let popoverWithDatePicker: PopoverAtom;
    let popoverComplex: PopoverAtom;
    let quickpickerWithTimeramePicker: QuickPickerAtom;
    let timeFramePicker: TimeFramePickerAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser(
            "time-frame-picker/time-frame-picker-visual-test",
            page
        );
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        popoverWithTimeframePicker = Atom.find<PopoverAtom>(
            PopoverAtom,
            "nui-demo-visual-default-popover"
        );
        popoverWithDatePicker = Atom.find<PopoverAtom>(
            PopoverAtom,
            "nui-demo-visual-datepicker-popover"
        );
        popoverComplex = Atom.find<PopoverAtom>(
            PopoverAtom,
            "nui-demo-visual-complex-popover"
        );

        quickpickerWithTimeramePicker = Atom.findIn(
            QuickPickerAtom,
            popoverWithTimeframePicker.getPopoverBody()
        ) as QuickPickerAtom;
        timeFramePicker = Atom.findIn(
            TimeFramePickerAtom,
            popoverWithTimeframePicker.getPopoverBody()
        ) as TimeFramePickerAtom;

        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async () => {
        await camera.turn.on();

        await popoverWithTimeframePicker.open();
        await quickpickerWithTimeramePicker.hoverPresetByTitle("Last 24 hours");
        await camera.say.cheese("Default time frame picker view");

        // Playwright DateTimepickerAtom uses properties instead of getX methods
        await timeFramePicker.getStartDatetimePicker().datePicker.toggle();
        await camera.say.cheese("With date picker opened");

        await timeFramePicker.getStartDatetimePicker().datePicker.toggle();
        await timeFramePicker.getEndDatetimePicker().timePicker.toggle();
        await camera.say.cheese("With time picker opened");

        await timeFramePicker
            .getEndDatetimePicker()
            .timePicker
            .menuPopup.clickItemByText("1:00 AM");
        await camera.say.cheese(
            "Checking the confirmation buttons alignment and styling"
        );

        await popoverWithTimeframePicker.togglePopover();

        await popoverWithDatePicker.open();
        await camera.say.cheese("Default quickpicker with datepicker");

        await popoverWithDatePicker.togglePopover();
        await Helpers.switchDarkTheme("on");
        await popoverWithDatePicker.open();
        await camera.say.cheese("Dark theme");
        await popoverWithDatePicker.togglePopover();
        await Helpers.switchDarkTheme("off");

        await popoverComplex.open();
        await camera.say.cheese(
            "Complex popover with timeframepicker and datepicker"
        );

        await camera.turn.off();
    });
});
