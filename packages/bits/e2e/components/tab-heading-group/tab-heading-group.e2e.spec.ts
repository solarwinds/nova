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

import { TabHeadingGroupAtom } from "./tab-heading-group.atom";
import { TabHeadingAtom } from "./tab-heading.atom";
import { Atom } from "../../atom";
import { Animations, Helpers, expect, test } from "../../setup";

test.describe("USERCONTROL tab heading group", () => {
    let tabGroupHorizontal: TabHeadingGroupAtom;
    let tabGroupResponsive: TabHeadingGroupAtom;

    const tabContent = [
        "Tab with really long content",
        "Tab 2",
        "Tab 3",
        "Tab 4",
    ];

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("tabgroup/tabgroup-test", page);
        await Helpers.disableCSSAnimations(Animations.ALL);
        tabGroupHorizontal = Atom.findIn<TabHeadingGroupAtom>(
            TabHeadingGroupAtom,
            page.locator("#nui-demo-visual-tabgroup-horizontal")
        );
        tabGroupResponsive = Atom.findIn<TabHeadingGroupAtom>(
            TabHeadingGroupAtom,
            page.locator("#nui-demo-visual-tabgroup-responsive")
        );
    });

    const getFirstLast = async (
        group: TabHeadingGroupAtom
    ): Promise<[TabHeadingAtom, TabHeadingAtom]> =>
        Promise.all([group.getFirstTab(), group.getLastTab()]);

    test("should tab content be visible", async () => {
        const tabs = await tabGroupHorizontal.getTabs();

        for (let i = 0; i < tabs.length; i++) {
            await expect(tabs[i].getLocator()).toHaveText(
                tabContent[i]
            );
        }
    });

    test("should switch between tabs", async () => {
        const [firstTab, lastTab] = await getFirstLast(tabGroupHorizontal);
        await lastTab.click();
        await firstTab.toNotBeActive();
        await lastTab.toBeActive();
    });

    test("should not allow disabled tabs to get selected", async () => {
        const disabledTab = await tabGroupHorizontal.getTabByText("Tab 3");
        await disabledTab.click();
        await disabledTab.toNotBeActive();
    });

    test("should responsive tab group have navigation buttons", async () => {
        expect(await tabGroupResponsive.caretsPresent()).toBeTruthy();
        expect(await tabGroupHorizontal.caretsPresent()).toBeFalsy();
    });

    test("should navigate through responsive tabs", async () => {
        const [firstTab, lastTab] = await getFirstLast(tabGroupResponsive);
        await firstTab.toBeVisible();
        await tabGroupResponsive.clickCaretRight(10);
        // await firstTab.toBeHidden();
        await expect(firstTab.getLocator()).not.toBeInViewport();

        await lastTab.toBeVisible();
    });

    test("should the last item in responsive tabs be clickable", async () => {
        await tabGroupResponsive.clickCaretRight(10);
        const lastTab = await tabGroupResponsive.getLastTab();
        await lastTab.click();
        await lastTab.toBeActive();
    });
});
