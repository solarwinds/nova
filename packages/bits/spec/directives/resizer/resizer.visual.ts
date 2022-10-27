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
import { ResizerAtom } from "../resizer/resizer.atom";

const name: string = "Resizer";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let resizerNested1: ResizerAtom;
    let resizerNested2: ResizerAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("resizer/resizer-visual-test");
        resizerNested1 = Atom.find(
            ResizerAtom,
            "nui-visual-test-resize-nested-1"
        );
        resizerNested2 = Atom.find(
            ResizerAtom,
            "nui-visual-test-resize-nested-2"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await resizerNested1.hover();
        await camera.say.cheese("Hovered resizer");

        await browser
            .actions()
            .mouseDown(resizerNested2.getElement())
            .perform();
        await camera.say.cheese("Resizer on MouseDown");

        Helpers.switchDarkTheme("on");
        await resizerNested1.hover();
        await browser
            .actions()
            .mouseDown(resizerNested2.getElement())
            .perform();
        await camera.say.cheese("Dark theme");

        await camera.turn.off();
    }, 200000);
});
