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

import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { SorterAtom } from "./sorter.atom";

const name: string = "Sorter";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera, sorter: SorterAtom, sorterLegacyStringInput: SorterAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("sorter/visual-test");

        sorter = SorterAtom.find(SorterAtom, "nui-demo-sorter");
        sorterLegacyStringInput = SorterAtom.find(
            SorterAtom,
            "nui-demo-sorter-legacy-string-input"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await sorter.getSorterButton().click();
        await camera.say.cheese(`Sorting direction changed`);

        await Helpers.switchDarkTheme("on");
        await sorter.click();
        await camera.say.cheese(`Sorter opened with dark theme`);

        await Helpers.switchDarkTheme("off");
        await sorter.getItemByIndex(0).click();
        await sorter.click();
        await sorter.hover(sorter.getItemByIndex(2));
        await camera.say.cheese(`Sorter: first item selected`);

        await sorter.getItemByIndex(2).click();
        await sorter.click();
        await sorter.hover(sorter.getItemByIndex(0));
        await camera.say.cheese("Sorter: last item selected");

        await sorterLegacyStringInput.getSorterButton().click();
        await camera.say.cheese(
            "Legacy string input sorting direction changed"
        );

        await sorterLegacyStringInput.click();
        await camera.say.cheese("Legacy string input sorter opened");

        await sorterLegacyStringInput.getItemByIndex(0).click();
        await sorterLegacyStringInput.click();
        await sorterLegacyStringInput.hover(
            sorterLegacyStringInput.getItemByIndex(2)
        );
        await camera.say.cheese(
            "Legacy string input sorter: first item selected"
        );

        await sorterLegacyStringInput.getItemByIndex(2).click();
        await sorterLegacyStringInput.click();
        await sorterLegacyStringInput.hover(
            sorterLegacyStringInput.getItemByIndex(0)
        );
        await camera.say.cheese(
            "Legacy string input sorter: last item selected"
        );

        await camera.turn.off();
    }, 200000);
});
