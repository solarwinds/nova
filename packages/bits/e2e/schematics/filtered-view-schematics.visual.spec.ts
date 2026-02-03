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

import { Atom } from "../atom";
import { CheckboxGroupAtom } from "../components/checkbox-group/checkbox-group.atom";
import { test, Helpers, Animations, expect } from "../setup";
import { Camera } from "../virtual-camera/Camera";

const name = "Filtered View Schematics";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;

    test.beforeEach(async ({ page }) => {
        Helpers.setPage(page);
        await Helpers.disableCSSAnimations(Animations.ALL);
        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async ({ page }) => {
        await camera.turn.on();

        await Helpers.prepareBrowser(`schematics/filtered-view/list`, page);
        await filterByFirstOption();
        await camera.say.cheese("Filtered View List");

        await Helpers.prepareBrowser(
            `schematics/filtered-view/list-pagination`,
            page
        );
        await filterByFirstOption();
        await camera.say.cheese("Filtered View List with Pagination");

        await Helpers.prepareBrowser(
            `schematics/filtered-view/list-virtual-scroll`,
            page
        );
        await filterByFirstOption();
        await camera.say.cheese("Filtered View List with Virtual Scroll");

        await Helpers.prepareBrowser(`schematics/filtered-view/table`, page);
        await filterByFirstOption();
        await camera.say.cheese("Filtered View Table");

        await Helpers.prepareBrowser(
            `schematics/filtered-view/table-pagination`,
            page
        );
        await filterByFirstOption();
        await camera.say.cheese("Filtered View Table with Pagination");

        await Helpers.prepareBrowser(
            `schematics/filtered-view/table-pagination-selection`,
            page
        );
        await filterByFirstOption();
        await camera.say.cheese(
            "Filtered View Table with Pagination and Selection"
        );

        await Helpers.prepareBrowser(
            `schematics/filtered-view/table-virtual-scroll`,
            page
        );
        await filterByFirstOption();
        await camera.say.cheese("Filtered View Table with Virtual Scroll");

        await Helpers.prepareBrowser(
            `schematics/filtered-view/table-virtual-scroll-selection`,
            page
        );
        await filterByFirstOption();
        await camera.say.cheese(
            "Filtered View Table with Virtual Scroll and Selection"
        );

        await Helpers.prepareBrowser(
            `schematics/filtered-view/table-virtual-scroll-custom`,
            page
        );
        await filterByFirstOption();
        await camera.say.cheese(
            "Filtered View Table with Virtual Scroll with Custom Strategy"
        );

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await camera.turn.off();
    });

    const filterByFirstOption = async (): Promise<void> => {
        const checkboxJustified = Atom.findIn<CheckboxGroupAtom>(
            CheckboxGroupAtom,
            Helpers.page.locator(".filter-group")
        );
        await expect(checkboxJustified.getLocator()).toBeVisible();

        await checkboxJustified.getCheckboxByIndex(0).setChecked(true);
    };
});
