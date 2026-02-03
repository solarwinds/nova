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

import { ExpanderAtom } from "./expander.atom";
import { Atom } from "../../atom";
import { test, expect, Helpers } from "../../setup";
import { MenuAtom } from "../menu/menu.atom";

test.describe("USERCONTROL expander", () => {
    let basicExpander: ExpanderAtom;
    let headerTextAndIconExpander: ExpanderAtom;
    let headerCustomContent: ExpanderAtom;
    let initiallyExpandedExpander: ExpanderAtom;
    let openChangeExpander: ExpanderAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("expander/expander-test", page);
        basicExpander = Atom.find<ExpanderAtom>(
            ExpanderAtom,
            "nui-demo-expander-basic"
        );
        headerTextAndIconExpander = Atom.find<ExpanderAtom>(
            ExpanderAtom,
            "nui-demo-expander-text-and-icon"
        );
        headerCustomContent = Atom.find<ExpanderAtom>(
            ExpanderAtom,
            "nui-demo-expander-custom-header"
        );
        initiallyExpandedExpander = Atom.find<ExpanderAtom>(
            ExpanderAtom,
            "nui-demo-expander-initially-expanded"
        );
        openChangeExpander = Atom.find<ExpanderAtom>(
            ExpanderAtom,
            "nui-demo-expander-open-change"
        );
    });

    test("should have correct icons when expanded and collapsed", async () => {
        await expect(
            initiallyExpandedExpander.toggleIcon.getLocator()
        ).toHaveAttribute("icon", "triangle-down");
        await initiallyExpandedExpander.toggle();
        await expect(
            initiallyExpandedExpander.toggleIcon.getLocator()
        ).toHaveAttribute("icon", "triangle-right");
        await initiallyExpandedExpander.toggle();
    });

    test("should toggle expanded/collapsed", async () => {
        await basicExpander.toBeCollapsed();
        await basicExpander.toggle();
        await basicExpander.toBeExpanded();

        await headerTextAndIconExpander.toBeCollapsed();
        await headerTextAndIconExpander.toggle();
        await headerTextAndIconExpander.toBeExpanded();

        await basicExpander.toggle();
        await headerTextAndIconExpander.toggle();
    });

    test("should remove the content from DOM when collapsed", async () => {
        await initiallyExpandedExpander.toggle();
        await initiallyExpandedExpander.toBeCollapsed();
        await expect(
            initiallyExpandedExpander.getLocator().locator("p")
        ).toHaveCount(0);
        await initiallyExpandedExpander.toggle();
    });

    test("should change button text when it's dynamically changed by openChange", async ({ page }) => {
        const dynamicButton = page.locator(
            ".nui-demo-expander-open-change-button"
        );
        await openChangeExpander.toBeCollapsed();
        await expect(dynamicButton).toHaveText("Open");
        await openChangeExpander.toggle();
        await openChangeExpander.toBeExpanded();
        await expect(dynamicButton).toHaveText("Close");
        await openChangeExpander.toggle();
    });

    test("menu items should be clickable", async ({ page }) => {
        const menu = Atom.find<MenuAtom>(
            MenuAtom,
            "nui-demo-expander-header-menu",
            true
        );
        await menu.toggleMenu();
        await menu.getMenuItemByIndex(1).clickItem();

        page.on("dialog", async (dialog) => {
            expect(dialog.message()).toEqual("hello");
            await dialog.accept();
        });
    });

    test("should not expand an expander when menu is clicked", async () => {
        const menu = Atom.find<MenuAtom>(
            MenuAtom,
            "nui-demo-expander-header-menu",
            true
        );
        await menu.toggleMenu();
        await headerCustomContent.toBeCollapsed();
        await menu.toggleMenu();
    });
});
