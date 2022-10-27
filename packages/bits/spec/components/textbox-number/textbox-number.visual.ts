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
import { TextboxNumberAtom } from "../textbox-number/textbox-number.atom";

const name: string = "Textbox Number";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let basicTextboxNumber: TextboxNumberAtom;
    let customTextboxNumber: TextboxNumberAtom;
    let disabledTextboxNumber: TextboxNumberAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("textbox/textbox-number-visual-test");
        basicTextboxNumber = Atom.find(
            TextboxNumberAtom,
            "nui-visual-test-textbox-number"
        );
        customTextboxNumber = Atom.find(
            TextboxNumberAtom,
            "nui-visual-test-textbox-number-min-max"
        );
        disabledTextboxNumber = Atom.find(
            TextboxNumberAtom,
            "nui-visual-test-textbox-number-disabled"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await disabledTextboxNumber.hover();
        await camera.say.cheese("Default");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await customTextboxNumber.acceptText("");
        await basicTextboxNumber.hover();
        await camera.say.cheese(
            "Basic TextboxNumber is hover and Custom TextboxNumber is focused"
        );

        await customTextboxNumber.clearText();
        await customTextboxNumber.acceptText("-3");
        await basicTextboxNumber.upButton.hover();
        await camera.say.cheese(
            "Validation error in Custom TextboxNumber and UpButton in Basic TextboxNumber is hovered"
        );

        await camera.turn.off();
    }, 100000);
});
