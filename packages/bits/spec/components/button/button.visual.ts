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
import { ButtonAtom } from "./button.atom";

const name: string = "Button";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera,
        basicButton: ButtonAtom,
        primaryButton: ButtonAtom,
        actionButton: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("button/button-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        basicButton = Atom.find(ButtonAtom, "basic-button");
        primaryButton = Atom.find(ButtonAtom, "primary-button");
        actionButton = Atom.find(ButtonAtom, "action-button");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await basicButton.hover();
        await camera.say.cheese(`Hover on basic button`);

        await basicButton.mouseDown();
        await camera.say.cheese(`After basic button mouse down`);
        await basicButton.mouseUp();

        await primaryButton.hover();
        await camera.say.cheese(`Hover on primary button`);

        await primaryButton.mouseDown();
        await camera.say.cheese(`After primary button mouse down`);
        await primaryButton.mouseUp();

        await actionButton.hover();
        await camera.say.cheese(`Hover on action button`);

        await actionButton.mouseDown();
        await camera.say.cheese(`After action button mouse down`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");

        await camera.turn.off();
    }, 200000);
});
