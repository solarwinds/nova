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

import { browser, by, element } from "protractor";

import { Atom } from "../atom";
import { CheckboxGroupAtom } from "../components/checkbox-group/checkbox-group.atom";
import { Animations, Helpers } from "../helpers";

// Enable after NUI-5702 is fixed
xdescribe("Visual Tests: Filtered View Schematics", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let checkboxJustified: CheckboxGroupAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.disableCSSAnimations(Animations.ALL);
        checkboxJustified = Atom.findIn(
            CheckboxGroupAtom,
            element(by.className("nui-checkbox-group"))
        );
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await Helpers.prepareBrowser(`schematics/filtered-view/list`);
        await filterByFirstOption();
        await eyes.open(browser, "NUI", "Filtered View");
        await eyes.checkWindow("Filtered View List");

        await Helpers.prepareBrowser(
            `schematics/filtered-view/list-pagination`
        );
        await filterByFirstOption();
        await eyes.checkWindow("Filtered View List with Pagination");

        await Helpers.prepareBrowser(
            `schematics/filtered-view/list-virtual-scroll`
        );
        await filterByFirstOption();
        await eyes.checkWindow("Filtered View List with Virtual Scroll");

        await Helpers.prepareBrowser(`schematics/filtered-view/table`);
        await filterByFirstOption();
        await eyes.checkWindow("Filtered View Table");

        await Helpers.prepareBrowser(
            `schematics/filtered-view/table-pagination`
        );
        await filterByFirstOption();
        await eyes.checkWindow("Filtered View Table with Pagination");

        await Helpers.prepareBrowser(
            `schematics/filtered-view/table-pagination-selection`
        );
        await filterByFirstOption();
        await eyes.checkWindow(
            "Filtered View Table with Pagination and Selection"
        );

        await Helpers.prepareBrowser(
            `schematics/filtered-view/table-virtual-scroll`
        );
        await filterByFirstOption();
        await eyes.checkWindow("Filtered View Table with Virtual Scroll");

        await Helpers.prepareBrowser(
            `schematics/filtered-view/table-virtual-scroll-selection`
        );
        await filterByFirstOption();
        await eyes.checkWindow(
            "Filtered View Table with Virtual Scroll and Selection"
        );

        await Helpers.prepareBrowser(
            `schematics/filtered-view/table-virtual-scroll-custom`
        );
        await filterByFirstOption();
        await eyes.checkWindow(
            "Filtered View Table with Virtual Scroll with Custom Strategy"
        );

        Helpers.switchDarkTheme("on");
        await eyes.checkWindow("Dark theme");
        Helpers.switchDarkTheme("off");

        await eyes.close();
    }, 200000);

    const filterByFirstOption = async (): Promise<void> =>
        checkboxJustified.getFirst().setChecked(true);
});
