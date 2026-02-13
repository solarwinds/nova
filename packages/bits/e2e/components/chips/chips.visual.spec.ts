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

import { ChipsAtom } from "./chips.atom";
import { Atom } from "../../atom";
import { test, Helpers, Animations } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Chips";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let chipsBasic: ChipsAtom;
    let chipsVertGroup: ChipsAtom;
    let chipsOverflow: ChipsAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("chips/chips-visual-test", page);
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        chipsBasic = Atom.find<ChipsAtom>(ChipsAtom, "nui-demo-chips-flat-horizontal-visual");
        chipsVertGroup = Atom.find<ChipsAtom>(ChipsAtom, "nui-demo-chips-grouped-vertical-visual");
        chipsOverflow = Atom.find<ChipsAtom>(ChipsAtom, "nui-demo-chips-overflow");

        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async () => {
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

        await chipsOverflow.getChipsOverflow.click();
        await camera.say.cheese(`Open popup with overflow chips`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);
        await Helpers.switchDarkTheme("off");

        await camera.turn.off();
    });
});
