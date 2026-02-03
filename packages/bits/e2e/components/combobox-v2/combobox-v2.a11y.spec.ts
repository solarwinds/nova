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
import { Helpers, test } from "../../setup";
import { ComboboxV2Atom } from "./combobox-v2.atom";

test.describe("a11y: combobox-v2", () => {
    const rulesToDisable: string[] = [
        "aria-required-children",
        "aria-required-attr",
    ];

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("combobox-v2/test", page);
    });

    test("should verify a11y of combobox-v2", async ({ runA11yScan, page }) => {
        const comboboxBasic = Atom.find<ComboboxV2Atom>(ComboboxV2Atom, "basic");
        const comboboxError = Atom.find<ComboboxV2Atom>(ComboboxV2Atom, "error");
        const comboboxForm = Atom.find<ComboboxV2Atom>(ComboboxV2Atom, "form");
        const comboboxSingle = Atom.find<ComboboxV2Atom>(ComboboxV2Atom, "single");
        const comboboxMulti = Atom.find<ComboboxV2Atom>(ComboboxV2Atom, "multi");
        const comboboxCustomControl = Atom.find<ComboboxV2Atom>(
            ComboboxV2Atom,
            "custom-control"
        );
        const comboboxValueRemoval = Atom.find<ComboboxV2Atom>(
            ComboboxV2Atom,
            "removal"
        );

        const disableButton = page.locator("#trigger-disabled");
        const toggleButton = page.locator("#toggle");
        const focusdrop = page.locator(".focus-drop");

        await runA11yScan(ComboboxV2Atom, rulesToDisable);

        await (await comboboxError.getFirstOption()).click();
        await comboboxError.removeAll();
        await (await comboboxForm.getLastOption()).click();
        await comboboxForm.removeAll();

        await Helpers.pressKey("Tab");
        await ComboboxV2Atom.type("Item 3");
        await (await comboboxBasic.getOption(33)).hover();
        await runA11yScan(ComboboxV2Atom, rulesToDisable);

        await Helpers.switchDarkTheme("on");
        await (await comboboxBasic.getOption(33)).click();
        await (await comboboxError.getFirstOption()).click();
        await (await comboboxForm.getLastOption()).click();
        await disableButton.click();
        await comboboxMulti.selectAll();
        await comboboxSingle.type("qwerty");
        await runA11yScan(ComboboxV2Atom, rulesToDisable);

        await Helpers.switchDarkTheme("off");
        await comboboxSingle.type("qwerty");
        await comboboxSingle.createOption.click();
        await comboboxMulti.type("qwerty");
        await comboboxMulti.createOption.click();

        await comboboxSingle.click();
        await Helpers.pressKey("ArrowUp");
        await Helpers.pressKey("ArrowDown");
        await (await comboboxSingle.getLastOption()).hover();
        await runA11yScan(ComboboxV2Atom, rulesToDisable);

        await Helpers.pressKey("Tab");
        await comboboxValueRemoval.hover();
        await runA11yScan(ComboboxV2Atom, rulesToDisable);

        await focusdrop.click();
        await toggleButton.click();
        await comboboxCustomControl.selectFirst(24);
        await comboboxCustomControl.removeChips(1);
        await runA11yScan(ComboboxV2Atom, rulesToDisable);
    });
});
