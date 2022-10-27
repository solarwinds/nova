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
import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { CheckboxAtom } from "../public_api";

const name: string = "Checkbox";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera,
        checkboxBasic: CheckboxAtom,
        checkboxSpecial: CheckboxAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("checkbox/checkbox-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        checkboxBasic = Atom.find(CheckboxAtom, "nui-demo-checkbox");
        checkboxSpecial = Atom.find(CheckboxAtom, "nui-demo-checkbox-special");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await checkboxBasic.hover(checkboxBasic.getLabel());
        await camera.say.cheese(`Basic checkbox hovered`);

        await checkboxSpecial.hoverLink();
        await camera.say.cheese(`Special template of checkbox`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
