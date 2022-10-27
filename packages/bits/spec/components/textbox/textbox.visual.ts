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
import { TextboxAtom } from "../textbox/textbox.atom";

const name: string = "Textbox";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let basicTextbox: TextboxAtom;
    let placeholderTextbox: TextboxAtom;
    let readonlyTextbox: TextboxAtom;
    let requiredTextbox: TextboxAtom;
    let areaTextbox: TextboxAtom;
    let placeholderAreaTextbox: TextboxAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("textbox/textbox-visual-test");
        basicTextbox = Atom.find(TextboxAtom, "nui-visual-test-textbox-item");
        placeholderTextbox = Atom.find(
            TextboxAtom,
            "nui-visual-test-placeholder-textbox-item"
        );
        readonlyTextbox = Atom.find(
            TextboxAtom,
            "nui-visual-test-readonly-textbox-item"
        );
        requiredTextbox = Atom.find(
            TextboxAtom,
            "nui-visual-test-required-textbox-item"
        );
        areaTextbox = Atom.find(
            TextboxAtom,
            "nui-visual-test-area-textbox-item"
        );
        placeholderAreaTextbox = Atom.find(
            TextboxAtom,
            "nui-visual-test-placeholder-area-textbox-item"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await basicTextbox.input.click();
        await placeholderTextbox.hover();
        await camera.say.cheese(
            "Basic Textbox is focused and Textbox with placeholder is hovered"
        );

        await requiredTextbox.acceptText("a");
        await readonlyTextbox.hover();
        await camera.say.cheese(
            "'a' was entered in required Textbox and readonly Textbox is hovered"
        );

        await areaTextbox.input.click();
        await placeholderAreaTextbox.hover();
        await camera.say.cheese(
            "Area Textbox is focused and Area Textbox with placeholder is hovered"
        );

        await camera.turn.off();
    }, 100000);
});
