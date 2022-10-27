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

import { by, element } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { TabHeadingGroupAtom } from "./tab-heading-group.atom";

describe("USERCONTROL tab heading group", () => {
    let tabGroupHorizontal: TabHeadingGroupAtom;
    let tabGroupResponsive: TabHeadingGroupAtom;
    const tabContent = [
        "Tab with really long content",
        "Tab 2",
        "Tab 3",
        "Tab 4",
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("tabgroup/tabgroup-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        tabGroupHorizontal = Atom.findIn(
            TabHeadingGroupAtom,
            element(by.id("nui-demo-visual-tabgroup-horizontal"))
        );
        tabGroupResponsive = Atom.findIn(
            TabHeadingGroupAtom,
            element(by.id("nui-demo-visual-tabgroup-responsive"))
        );
    });

    it("should tab content be visible", async () => {
        const tabs = await tabGroupHorizontal.getTabs();
        const amountOfTabs = await tabGroupHorizontal.getNumberOfTabs();

        for (let i = 0; i < amountOfTabs; i++) {
            expect(await tabs[i].getText()).toBe(tabContent[i].toUpperCase());
        }
    });

    it("should switch between tabs", async () => {
        await (await tabGroupHorizontal.getLastTab()).click();
        expect(await (await tabGroupHorizontal.getFirstTab()).isActive()).toBe(
            false
        );
        expect(await (await tabGroupHorizontal.getLastTab()).isActive()).toBe(
            true
        );
    });

    it("should not allow disabled tabs to get selected", async () => {
        const disabledTab = await tabGroupHorizontal.getTabByText("Tab 3");
        await disabledTab.click();
        expect(await disabledTab.isActive()).toBe(false);
    });

    it("should responsive tab group have navigation buttons", async () => {
        expect(await tabGroupResponsive.caretsPresent()).toBeTruthy();
        expect(await tabGroupHorizontal.caretsPresent()).toBeFalsy();
    });

    it("should navigate through responsive tabs", async () => {
        expect(
            await (await tabGroupResponsive.getFirstTab()).isDisplayed()
        ).toBe(true);
        await tabGroupResponsive.clickCaretRight(10);
        expect(
            await (await tabGroupResponsive.getFirstTab()).isDisplayed()
        ).toBe(false);
        expect(
            await (await tabGroupResponsive.getLastTab()).isDisplayed()
        ).toBe(true);
    });

    it("should the last item in responsive tabs be clickable", async () => {
        await tabGroupResponsive.clickCaretRight(10);
        await (await tabGroupResponsive.getLastTab()).click();
        expect(
            await tabGroupResponsive
                .getLastTab()
                .then(async (tab) => tab.isActive())
        ).toBe(true);
    });
});
