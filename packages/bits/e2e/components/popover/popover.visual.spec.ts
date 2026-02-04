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

import { test, Helpers, Animations } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";
import { PopoverAtom } from "./popover.atom";
import { CheckboxAtom } from "../checkbox/checkbox.atom";
// import { ComboboxV2Atom } from "../combobox-v2/combobox-v2.atom";
import { Atom } from "../../atom";

const name: string = "Popover";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let buttonPreventClosing: any;
    let placementCheckButtons: any;

    let popoverPreventClosing: PopoverAtom;
    let popoverBasic: PopoverAtom;
    let popoverNoRestrictions: PopoverAtom;
    let popoverNoPadding: PopoverAtom;
    let popoverBasicMultiline: PopoverAtom;
    let popoverModal: PopoverAtom;
    let checkboxInPopover: CheckboxAtom;
    // let comboboxV2InPopover: ComboboxV2Atom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("popover/popover-visual-test", page);
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        buttonPreventClosing = Helpers.page.locator("#nui-demo-button-prevent-onclick");
        placementCheckButtons = Helpers.page.locator(".placement-check-btn");

        popoverPreventClosing = Atom.findIn<PopoverAtom>(PopoverAtom, Helpers.page.locator("#nui-demo-popover-prevent-closing"));
        popoverBasic = Atom.findIn<PopoverAtom>(PopoverAtom, Helpers.page.locator("#nui-demo-popover-basic"));
        popoverNoRestrictions = Atom.findIn<PopoverAtom>(PopoverAtom, Helpers.page.locator("#nui-demo-popover-no-limits"));
        popoverNoPadding = Atom.findIn<PopoverAtom>(PopoverAtom, Helpers.page.locator("#nui-demo-popover-no-padding"));
        popoverBasicMultiline = Atom.findIn<PopoverAtom>(PopoverAtom, Helpers.page.locator("#nui-demo-popover-limited-and-multiline"));
        popoverModal = Atom.findIn<PopoverAtom>(PopoverAtom, Helpers.page.locator("#nui-demo-popover-modal"));
        checkboxInPopover = Atom.findIn<CheckboxAtom>(CheckboxAtom, Helpers.page.locator("#nui-demo-checkbox-in-popover"));
        // comboboxV2InPopover = Atom.findIn<ComboboxV2Atom>(ComboboxV2Atom, Helpers.page.locator("#nui-demo-combobox-v2-in-popover"));

        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async () => {
        await camera.turn.on();

        await popoverPreventClosing.togglePopover();
        const count = await placementCheckButtons.count();
        for (let i = 0; i < count; i++) {
            await placementCheckButtons.nth(i).click();
        }
        await buttonPreventClosing.hover();
        await checkboxInPopover.toggle();
        // await comboboxV2InPopover.click();
        // await (await comboboxV2InPopover.getFirstOption()).click();
        // await comboboxV2InPopover.click();
// todo uncomenmt after comboboxV2 is fixed
        await camera.say.cheese(`Popover placement and preventClose`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);
        await Helpers.switchDarkTheme("off");
        for (let i = 0; i < count; i++) {
            await placementCheckButtons.nth(i).click();
        }
        await popoverPreventClosing.togglePopover();

        await popoverBasic.openByHover();
        await camera.say.cheese(`Basic popover`);
        await buttonPreventClosing.hover();
        await popoverBasic.waitForClosed();

        await popoverNoPadding.openByHover();
        await camera.say.cheese(`Popover with title and custom (no) padding`);
        await buttonPreventClosing.hover();
        await popoverNoPadding.waitForClosed();

        await popoverNoRestrictions.openByHover();
        await camera.say.cheese(`Popover with no width restrictions`);
        await buttonPreventClosing.hover();
        await popoverNoRestrictions.waitForClosed();

        await popoverBasicMultiline.openByHover();
        await camera.say.cheese(`Basic multiline popover`);
        await buttonPreventClosing.hover();
        await popoverBasicMultiline.waitForClosed();

        await popoverModal.open();
        await camera.say.cheese(`Modal popover`);

        await camera.turn.off();
    });
});
