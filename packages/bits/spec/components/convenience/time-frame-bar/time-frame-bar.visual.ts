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

import { $, browser } from "protractor";

import { TimeFrameBarAtom } from "./time-frame-bar.atom";
import { Atom } from "../../../atom";
import { TooltipAtom } from "../../../directives/tooltip/tooltip.atom";
import { Helpers } from "../../../helpers";
import { Camera } from "../../../virtual-camera/Camera";

const name: string = "TimeFrameBar";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    const timeFrameBarFirst: TimeFrameBarAtom = Atom.find(
        TimeFrameBarAtom,
        "first"
    );
    const timeFrameBarSecond: TimeFrameBarAtom = Atom.find(
        TimeFrameBarAtom,
        "second"
    );
    const timeFrameBarNoQuickPick: TimeFrameBarAtom = Atom.find(
        TimeFrameBarAtom,
        "bar-no-quick-pick"
    );
    const tooltip: TooltipAtom = Atom.findIn(
        TooltipAtom,
        $(".cdk-overlay-container")
    );

    beforeAll(async () => {
        await Helpers.prepareBrowser("convenience/time-frame-bar/visual");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await timeFrameBarSecond.quickPickPreset("Last 7 days");
        await camera.say.cheese(`Default with quick preset`);

        await timeFrameBarFirst.prevButton.hover();
        await tooltip.waitToBeDisplayed();
        await camera.say.cheese(`With prev button hovered`);

        await timeFrameBarSecond.popover.open();
        await camera.say.cheese(`With opened popover`);
        await timeFrameBarSecond.popover.closeModal();

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);
        await Helpers.switchDarkTheme("off");

        await timeFrameBarNoQuickPick.popover.open();
        await camera.say.cheese(`With opened popover and no quick picker`);
        await timeFrameBarNoQuickPick.popover.closeModal();

        await camera.turn.off();
    }, 100000);
});
