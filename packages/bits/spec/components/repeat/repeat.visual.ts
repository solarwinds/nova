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

import { browser, by, ElementFinder } from "protractor";

import { RepeatAtom } from "./repeat.atom";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Repeat";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let singleSelectList: RepeatAtom;
    let singleSelectListRequired: RepeatAtom;
    let reorderSelectList: RepeatAtom;
    let toggleDragging: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("repeat/repeat-visual-test");
        singleSelectList = Atom.find(RepeatAtom, "nui-demo-single-highlight");
        singleSelectListRequired = Atom.find(
            RepeatAtom,
            "nui-demo-single-required-selection"
        );
        reorderSelectList = Atom.find(RepeatAtom, "nui-demo-reorder-config");
        toggleDragging = browser.element(by.css(".nui-switch__bar"));
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await singleSelectList.hover();
        await camera.say.cheese(
            `Repeat in Required Single Selection Mode with Radio Buttons`
        );

        await singleSelectListRequired.hover();
        await camera.say.cheese(
            `Repeat in Single Selection Mode with Item Highlight`
        );

        await reorderSelectList.hover();
        await camera.say.cheese(`Item Drag/Drop Enabled`);

        await toggleDragging.click();
        await camera.say.cheese(`Item Drag/Drop Disabled`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
