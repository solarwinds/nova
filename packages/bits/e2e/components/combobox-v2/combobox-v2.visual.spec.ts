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
import { Animations, Helpers, test } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";
import { ComboboxV2Atom } from "./combobox-v2.atom";

const name = "Combobox V2";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let comboboxBasic: ComboboxV2Atom;
    let comboboxError: ComboboxV2Atom;
    let comboboxForm: ComboboxV2Atom;
    let comboboxSingle: ComboboxV2Atom;
    let comboboxMulti: ComboboxV2Atom;
    let comboboxCustomControl: ComboboxV2Atom;
    let comboboxValueRemoval: ComboboxV2Atom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("combobox-v2/test", page);
        await Helpers.disableCSSAnimations(Animations.ALL);

        comboboxBasic = Atom.find<ComboboxV2Atom>(ComboboxV2Atom, "basic");
        comboboxError = Atom.find<ComboboxV2Atom>(ComboboxV2Atom, "error");
        comboboxForm = Atom.find<ComboboxV2Atom>(ComboboxV2Atom, "form");
        comboboxSingle = Atom.find<ComboboxV2Atom>(ComboboxV2Atom, "single");
        comboboxMulti = Atom.find<ComboboxV2Atom>(ComboboxV2Atom, "multi");
        comboboxCustomControl = Atom.find<ComboboxV2Atom>(
            ComboboxV2Atom,
            "custom-control"
        );
        comboboxValueRemoval = Atom.find<ComboboxV2Atom>(
            ComboboxV2Atom,
            "removal"
        );

        camera = new Camera().loadFilm(page, name);
    });

    test(`${name} visual test`, async () => {
        await camera.turn.on();

        // State 1
        await (await comboboxError.getFirstOption()).click();
        await comboboxError.removeAll();
        await (await comboboxForm.getLastOption()).click();
        await comboboxForm.removeAll();
        await Helpers.pressKey("Tab");
        await ComboboxV2Atom.type("Item 3");
        await (await comboboxBasic.getOption(33)).hover();
        await camera.say.cheese("State 1");

        // State 2
        await Helpers.switchDarkTheme("on");
        await (await comboboxBasic.getOption(33)).click();
        await (await comboboxError.getFirstOption()).click();
        await (await comboboxForm.getLastOption()).click();
        await Helpers.page.locator("#trigger-disabled").click();
        await comboboxMulti.selectAll();
        await comboboxSingle.type("qwerty");
        await camera.say.cheese("State 2");

        // State 3
        await Helpers.switchDarkTheme("off");
        await comboboxSingle.type("qwerty");
        await comboboxSingle.createOption.click();
        await comboboxMulti.type("qwerty");
        await comboboxMulti.createOption.click();
        await comboboxSingle.click();
        await Helpers.pressKey("ArrowUp");
        await Helpers.pressKey("ArrowDown");
        await (await comboboxSingle.getLastOption()).hover();
        await camera.say.cheese("State 3");

        // State 4
        await Helpers.pressKey("Tab", 2);
        await comboboxValueRemoval.hover();
        await camera.say.cheese("State 4");

        // State 5
        await Helpers.page.locator(".focus-drop").click({force: true});
        await Helpers.page.locator("#toggle").click();
        await comboboxCustomControl.selectFirst(24);
        await comboboxCustomControl.removeChips(1);
        await camera.say.cheese("State 5");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");

        await camera.turn.off();
    });
});
