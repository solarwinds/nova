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
import { ChipsAtom } from "./chips.atom";

const name: string = "Chips";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let chipsBasic: ChipsAtom;
    let chipsVertGroup: ChipsAtom;
    let chipsOverflow: ChipsAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("chips/chips-visual-test");

        chipsBasic = Atom.find(
            ChipsAtom,
            "nui-demo-chips-flat-horizontal-visual"
        );
        chipsVertGroup = Atom.find(
            ChipsAtom,
            "nui-demo-chips-grouped-vertical-visual"
        );
        chipsOverflow = Atom.find(ChipsAtom, "nui-demo-chips-overflow");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        const chipselement = chipsBasic.getChipElement(2);
        await chipsBasic.hover(chipselement);
        await camera.say.cheese(`Hover effect`);

        await chipsBasic.removeItem(2);
        await chipsBasic.removeItem(3);
        await chipsVertGroup.clearAll();
        await camera.say.cheese(
            `Removed 2 chips and 'Clear All' vertical group`
        );

        await chipsOverflow.getChipsOverflowElement().click();
        await camera.say.cheese(`Open popup with overflow chips`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
