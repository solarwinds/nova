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

import { RadioGroupAtom } from "./radio-group.atom";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

const name = "Radio Group";

describe(`Visual tests: ${name}`, () => {
    beforeAll(async () => {
        await Helpers.prepareBrowser("radio-group/radio-group-visual-test");
    });

    it(`${name} visual test`, async () => {
        const camera = new Camera().loadFilm(browser, name);
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        const fruitGroup = Atom.find(RadioGroupAtom, "fruit-radio-group");
        await fruitGroup.getRadioByValue("Banana").click();
        await fruitGroup.hover(fruitGroup.getRadioByValue("Papaya"));
        await camera.say.cheese(`Click Banana and Hover on Papaya`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);
        await Helpers.switchDarkTheme("off");

        await camera.turn.off();
    }, 100000);
});
