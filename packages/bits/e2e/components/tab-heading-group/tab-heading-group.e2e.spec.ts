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
            await expect(tabs[i].getLocator()).toHaveText(tabContent[i]);
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
        await tabGroupResponsive.toHaveCarets();
        await tabGroupHorizontal.toNotHaveCarets();
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

    test("should activate a focused tab with Enter and Space", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("tabgroup", page);

        const tabs = page.locator(
            "nui-tab-heading-group-dynamic-example [role='tab']"
        );

        await tabs.nth(1).focus();
        await page.keyboard.press("Enter");
        await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

        await tabs.nth(0).focus();
        await page.keyboard.press("Space");
        await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    });

    test("should relate each routed tab to the current panel", async ({
        page,
    }) => {
        const routes = ["tab-settings", "tab-statistics", "tab-about"];

        for (const route of routes) {
            await Helpers.prepareBrowser(`tabgroup/${route}`, page);

            const routerExample = page.locator(
                "nui-tab-heading-group-with-router-example"
            );
            const activeTab = routerExample.locator(
                "[role='tab'][aria-selected='true']"
            );
            const panel = routerExample.locator("[role='tabpanel']");

            await expect(activeTab).toHaveAttribute("id", `tab-${route}`);
            await expect(activeTab).toHaveAttribute(
                "aria-controls",
                `panel-${route}`
            );
            await expect(panel).toHaveCount(1);
            await expect(panel).toHaveAttribute("id", `panel-${route}`);
            await expect(panel).toHaveAttribute(
                "aria-labelledby",
                `tab-${route}`
            );
            await expect(
                routerExample.locator(
                    "[role='tab'][aria-selected='false'][aria-controls]"
                )
            ).toHaveCount(0);
        }
    });

    test("should update the routed panel relationship when switching tabs", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("tabgroup/tab-settings", page);

        const routerExample = page.locator(
            "nui-tab-heading-group-with-router-example"
        );
        const statisticsTab = routerExample.locator("[role='tab']").nth(1);
        await statisticsTab.focus();
        await page.keyboard.press("Enter");

        await expect(page).toHaveURL(/\/#\/tabgroup\/tab-statistics$/);

        const activeTab = routerExample.locator(
            "[role='tab'][aria-selected='true']"
        );
        const panel = routerExample.locator("[role='tabpanel']");

        await expect(activeTab).toHaveAttribute("id", "tab-tab-statistics");
        await expect(activeTab).toHaveAttribute(
            "aria-controls",
            "panel-tab-statistics"
        );
        await expect(panel).toHaveAttribute("id", "panel-tab-statistics");
        await expect(panel).toHaveAttribute(
            "aria-labelledby",
            "tab-tab-statistics"
        );
        await expect(
            routerExample.locator(
                "[role='tab'][aria-selected='false'][aria-controls]"
            )
        ).toHaveCount(0);
        await expect(
            routerExample.locator("nui-tab-heading[tabindex='-1']")
        ).toHaveCount(3);
        await expect(
            routerExample.locator("[role='tab'][tabindex='0']")
        ).toHaveCount(3);
    });
});
