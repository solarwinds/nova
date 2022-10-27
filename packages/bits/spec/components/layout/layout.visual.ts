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
import { LayoutSheetGroupAtom } from "./layout-sheet-group.atom";

const name: string = "Layout";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let separatedSheets: LayoutSheetGroupAtom;
    let joinedSheets: LayoutSheetGroupAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("layout/layout-visual-test");
        separatedSheets = Atom.find(
            LayoutSheetGroupAtom,
            "nui-visual-test-layout-separated-sheet-group"
        );
        joinedSheets = Atom.find(
            LayoutSheetGroupAtom,
            "nui-visual-test-layout-joined-sheet-group"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        camera.lens.configure()?.setStitchMode("CSS");

        await camera.say.cheese(`Default`);

        await separatedSheets.hover(
            separatedSheets.getVerticalResizerByIndex(0)
        );
        await camera.say.cheese(`Hovered HorizontalResizer`);

        await separatedSheets.mouseDownVerticalResizerByIndex(0);
        await camera.say.cheese(`HorizontalResizer on MouseDown`);

        await separatedSheets.mouseUp();
        await joinedSheets.hover(joinedSheets.getHorizontalResizerByIndex(1));
        await camera.say.cheese(`Hovered VerticalResizer`);

        await joinedSheets.mouseDownHorizontalResizerByIndex(1);
        await camera.say.cheese(`VerticalResizer on MouseDown`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 200000);
});
