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
import { ButtonAtom } from "../../components/button/button.atom";
import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Tooltip";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera,
        basicTooltipButton: ButtonAtom,
        leftTooltipButton: ButtonAtom,
        bottomTooltipButton: ButtonAtom,
        rightTooltipButton: ButtonAtom,
        manualTooltipButton: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("tooltip/tooltip-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        basicTooltipButton = Atom.find(ButtonAtom, "basic-tooltip");
        leftTooltipButton = Atom.find(ButtonAtom, "left-tooltip");
        bottomTooltipButton = Atom.find(ButtonAtom, "bottom-tooltip");
        rightTooltipButton = Atom.find(ButtonAtom, "right-tooltip");
        manualTooltipButton = Atom.find(ButtonAtom, "manual-tooltip");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await basicTooltipButton.hover();
        await camera.say.cheese("Hover on button with basic tooltip");

        await Helpers.clickOnEmptySpace();
        await leftTooltipButton.hover();
        await camera.say.cheese("Hover on button with tooltip on the left");

        await Helpers.clickOnEmptySpace();
        await bottomTooltipButton.hover();
        await camera.say.cheese("Hover on button with tooltip on the bottom");

        await Helpers.clickOnEmptySpace();
        await rightTooltipButton.hover();
        await camera.say.cheese("Hover on button with tooltip on the right");

        await Helpers.clickOnEmptySpace();
        await manualTooltipButton.click();
        await camera.say.cheese("After tooltip triggered manually", 400);

        Helpers.switchDarkTheme("on");
        await camera.say.cheese(
            "After tooltip triggered manually with dark theme mode on"
        );

        await camera.turn.off();
    }, 200000);
});
