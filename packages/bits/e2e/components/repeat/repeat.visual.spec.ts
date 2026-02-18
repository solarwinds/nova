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

import { RepeatAtom } from "./repeat.atom";
import { Atom } from "../../atom";
import { test, Helpers } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";
import { SwitchAtom } from "../switch/switch.atom";

const name: string = "Repeat";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let singleSelectList: RepeatAtom;
    let singleSelectListRequired: RepeatAtom;
    let reorderSelectList: RepeatAtom;
    let dragToggle: SwitchAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("repeat/repeat-visual-test", page);
        singleSelectList = Atom.find<RepeatAtom>(
            RepeatAtom,
            "nui-demo-single-highlight"
        );
        singleSelectListRequired = Atom.find<RepeatAtom>(
            RepeatAtom,
            "nui-demo-single-required-selection"
        );
        reorderSelectList = Atom.find<RepeatAtom>(
            RepeatAtom,
            "nui-demo-reorder-config"
        );
        dragToggle = Atom.find<SwitchAtom>(
            SwitchAtom,
           "nui-demo-reorder-config"
        );
        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese("Default");

        await singleSelectList.hover();
        await camera.say.cheese(
            "Repeat in Required Single Selection Mode with Radio Buttons"
        );

        await singleSelectListRequired.hover();
        await camera.say.cheese(
            "Repeat in Single Selection Mode with Item Highlight"
        );

        await reorderSelectList.hover();
        await camera.say.cheese("Item Drag/Drop Enabled");

        await dragToggle.slider.first().click();
        await camera.say.cheese("Item Drag/Drop Disabled");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await camera.turn.off();
    });
});
