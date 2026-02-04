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
import { test, Helpers, Animations } from "../../setup";
import { DatepickerAtom } from "./datepicker.atom";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "DatePicker";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let datepickerBasic: DatepickerAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("date-picker/date-picker-visual-test", page);
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);
        datepickerBasic = Atom.find<DatepickerAtom>(
            DatepickerAtom,
            "nui-basic-usage-datepicker"
        );
        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await datepickerBasic.hover();
        await camera.say.cheese(`Hover state`);

        await datepickerBasic.toggle();
        await datepickerBasic.hover(datepickerBasic.getActiveDay);
        await camera.say.cheese(`Opened state`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);
        await Helpers.switchDarkTheme("off");

        await camera.turn.off();
    });
});
