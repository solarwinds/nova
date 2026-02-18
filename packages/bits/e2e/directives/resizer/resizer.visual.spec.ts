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
import { Helpers, test, Animations } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";
import { ResizerAtom } from "./resizer.atom";

const name: string = "Resizer";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let resizerNested1: ResizerAtom;
    let resizerNested2: ResizerAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("resizer/resizer-visual-test", page);
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        resizerNested1 = Atom.find<ResizerAtom>(
            ResizerAtom,
            "nui-visual-test-resize-nested-1"
        );
        resizerNested2 = Atom.find<ResizerAtom>(
            ResizerAtom,
            "nui-visual-test-resize-nested-2"
        );

        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async () => {
        await camera.turn.on();

        await resizerNested1.hover();
        await camera.say.cheese("Hovered resizer");

        // Equivalent of Protractor actions().mouseDown(resizerNested2.getElement())
        await resizerNested2.hover();
        await resizerNested2.getLocator().click({ force: true });
        await camera.say.cheese("Resizer on MouseDown");

        await Helpers.switchDarkTheme("on");
        await resizerNested1.hover();
        await resizerNested2.hover();
        await resizerNested2.getLocator().click({ force: true });
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await camera.turn.off();
    });
});
