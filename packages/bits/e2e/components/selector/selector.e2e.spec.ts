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

import { Locator } from "@playwright/test";

import { SelectorAtom, SelectionType } from "./selector.atom";
import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";

test.describe("USERCONTROL Selector", () => {
    const demoElementId = "nui-demo-selector";

    let subject: SelectorAtom;
    let selectionElement: Locator;
    let indeterminateElement: Locator;

    const isIndeterminate = async (): Promise<boolean> =>
        (await indeterminateElement.textContent()) === "indeterminate";

    const makeIndeterminate = async (): Promise<void> =>
        Helpers.page.locator("#nui-demo-make-indeterminate").click();

    const makeAppendedToBody = async (): Promise<void> =>
        Helpers.page.locator("#nui-demo-make-appended-to-body").click();

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("selector", page);
    });

    test.beforeEach(() => {
        subject = Atom.find<SelectorAtom>(SelectorAtom, demoElementId);
        selectionElement = Helpers.page.locator("#nui-demo-selection-type");
        indeterminateElement = Helpers.page.locator("#nui-demo-indeterminate");
    });

    test("should get appropriate 'SelectionType' state by clicking repeat item", async () => {
        await subject.select(SelectionType.All);
        await expect(selectionElement).toContainText(SelectionType.All);

        await subject.select(SelectionType.None);
        await expect(selectionElement).toContainText(SelectionType.None);

        await subject.select(SelectionType.All);
        await subject.select(SelectionType.AllPages);
        await expect(selectionElement).toContainText(SelectionType.AllPages);
    });

    test("should get 'SelectionType' (All, None) by changing checkbox state", async () => {
        const selectorCheckbox = subject.getCheckbox;

        await selectorCheckbox.toggle();
        await expect(selectionElement).toContainText(SelectionType.All);

        await selectorCheckbox.toggle();
        await expect(selectionElement).toContainText(SelectionType.UnselectAll);
    });

    test("should set 'Indeterminate'", async () => {
        await subject.select(SelectionType.AllPages);
        expect(await isIndeterminate()).toBe(false);

        await makeIndeterminate();
        expect(await isIndeterminate()).toBe(true);
    });

    test("should get 'SelectionType' (All, None) by clicking on selector button", async () => {
        const selectorButton = subject.getSelectorButton;

        await selectorButton.click();
        await expect(selectionElement).toContainText(SelectionType.All);

        await selectorButton.click();
        await expect(selectionElement).toContainText(SelectionType.UnselectAll);
    });

    test("skips the decorative checkbox in keyboard navigation", async ({
        page,
    }) => {
        const selector = page.locator("#nui-demo-selector");
        const button = selector.locator(".nui-selector__checkbox-button");
        const toggle = selector.locator(".nui-selector__toggle");
        const input = selector.locator("input[type=checkbox]");

        await expect(input).toHaveAttribute("tabindex", "-1");
        await button.focus();
        await page.keyboard.press("Tab");
        await expect(toggle).toBeFocused();
        await page.keyboard.press("Shift+Tab");
        await expect(button).toBeFocused();
        await page.keyboard.press("Space");
        await expect(selectionElement).toContainText(SelectionType.All);
    });

    test.describe("appended to body >", () => {
        test("should get appropriate 'SelectionType' state by clicking repeat item", async () => {
            await makeAppendedToBody();
            await subject.selectAppendedToBodyItem(SelectionType.All);
            await expect(selectionElement).toHaveText(SelectionType.All);

            await subject.selectAppendedToBodyItem(SelectionType.None);
            await expect(selectionElement).toHaveText(SelectionType.None);

            await subject.selectAppendedToBodyItem(SelectionType.AllPages);
            await expect(selectionElement).toHaveText(SelectionType.AllPages);
        });
    });
});
