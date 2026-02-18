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
import { Animations, Helpers, test } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";
import { TabHeadingAtom } from "./tab-heading.atom";
import { TabHeadingGroupAtom } from "./tab-heading-group.atom";

const name: string = "Tab Heading Group";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let tabGroupHorizontal: TabHeadingGroupAtom;
    let tabGroupWithContent: TabHeadingGroupAtom;
    let tabGroupWithIcons: TabHeadingGroupAtom;
    let tabGroupResponsive: TabHeadingGroupAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("tabgroup/tabgroup-test", page);
        await Helpers.disableCSSAnimations(Animations.ALL);

        tabGroupHorizontal = Atom.findIn<TabHeadingGroupAtom>(
            TabHeadingGroupAtom,
            page.locator("#nui-demo-visual-tabgroup-horizontal")
        );
        tabGroupWithContent = Atom.findIn<TabHeadingGroupAtom>(
            TabHeadingGroupAtom,
            page.locator("#nui-demo-visual-tabgroup-with-content")
        );
        tabGroupWithIcons = Atom.findIn<TabHeadingGroupAtom>(
            TabHeadingGroupAtom,
            page.locator("#nui-demo-visual-tabgroup-horizontal-icons")
        );
        tabGroupResponsive = Atom.findIn<TabHeadingGroupAtom>(
            TabHeadingGroupAtom,
            page.locator("#nui-demo-visual-tabgroup-responsive")
        );

        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async () => {
        await camera.turn.on();

        await (await tabGroupHorizontal.getFirstTab()).hover();
        await camera.say.cheese("Default with hover");

        const contentTabs = await tabGroupWithContent.getTabs();
        await contentTabs[1].click();

        const lastIconTab = await tabGroupWithIcons.getLastTab();
        await lastIconTab.click();
        const firstIconTab = await tabGroupWithIcons.getFirstTab();
        await firstIconTab.hover();
        await camera.say.cheese(
            "Hover on inactive tab + switching active tab"
        );

        await tabGroupResponsive.clickCaretRight(15);
        const lastResponsiveTab = await tabGroupResponsive.getLastTab();
        await lastResponsiveTab.getLocator().waitFor({ state: "visible" });
        await lastResponsiveTab.click();
        await lastResponsiveTab.hover();
        await camera.say.cheese("Moving through tabs using caret right");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);
        await Helpers.switchDarkTheme("off");

        await camera.turn.off();
    });
});
