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

import { Atom } from "../../../atom";
import { Helpers, test, Animations } from "../../../setup";
import { TooltipAtom } from "../../../directives/tooltip/tooltip.atom";
import { Camera } from "../../../virtual-camera/Camera";

import { TimeFrameBarAtom } from "./time-frame-bar.atom";

const name: string = "TimeFrameBar";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let timeFrameBarFirst: TimeFrameBarAtom;
    let timeFrameBarSecond: TimeFrameBarAtom;
    let timeFrameBarNoQuickPick: TimeFrameBarAtom;
    let tooltip: TooltipAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("convenience/time-frame-bar/visual", page);
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        camera = new Camera().loadFilm(page, name, "Bits");

        timeFrameBarFirst = Atom.find(TimeFrameBarAtom, "first") as TimeFrameBarAtom;
        timeFrameBarSecond = Atom.find(TimeFrameBarAtom, "second") as TimeFrameBarAtom;
        timeFrameBarNoQuickPick = Atom.find(
            TimeFrameBarAtom,
            "bar-no-quick-pick"
        ) as TimeFrameBarAtom;

        tooltip = Atom.findIn(
            TooltipAtom,
            Helpers.page.locator(".cdk-overlay-container")
        ) as TooltipAtom;
    });

    test(`${name} visual test`, async () => {
        await camera.turn.on();

        await timeFrameBarSecond.quickPickPreset("Last 7 days");
        await camera.say.cheese("Default with quick preset");

        await timeFrameBarFirst.prevButton.hover();
        await tooltip.waitToBeDisplayed();
        await camera.say.cheese("With prev button hovered");

        await timeFrameBarSecond.popover.open();
        await camera.say.cheese("With opened popover");
        await timeFrameBarSecond.popover.closeModal();

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await timeFrameBarNoQuickPick.popover.open();
        await camera.say.cheese("With opened popover and no quick picker");
        await timeFrameBarNoQuickPick.popover.closeModal();

        await camera.turn.off();
    });
});
