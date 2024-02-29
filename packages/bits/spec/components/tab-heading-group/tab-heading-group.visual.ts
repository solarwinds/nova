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

import { browser, by, element, ExpectedConditions } from "protractor";

import { TabHeadingGroupAtom } from "./tab-heading-group.atom";
import { TabHeadingAtom } from "./tab-heading.atom";
import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Tab Heading Group";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let tabGroupHorizontal: TabHeadingGroupAtom;
    let tabGroupWithContent: TabHeadingGroupAtom;
    let tabGroupWithIcons: TabHeadingGroupAtom;
    let tabGroupResponsive: TabHeadingGroupAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("tabgroup/tabgroup-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        tabGroupHorizontal = Atom.findIn(
            TabHeadingGroupAtom,
            element(by.id("nui-demo-visual-tabgroup-horizontal"))
        );
        tabGroupWithContent = Atom.findIn(
            TabHeadingGroupAtom,
            element(by.id("nui-demo-visual-tabgroup-with-content"))
        );
        tabGroupWithIcons = Atom.findIn(
            TabHeadingGroupAtom,
            element(by.id("nui-demo-visual-tabgroup-horizontal-icons"))
        );
        tabGroupResponsive = Atom.findIn(
            TabHeadingGroupAtom,
            element(by.id("nui-demo-visual-tabgroup-responsive"))
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await (await tabGroupHorizontal.getFirstTab()).hover();
        await camera.say.cheese("Default with hover");

        await tabGroupWithContent
            .getTabs()
            .then(async (tab: TabHeadingAtom[]) => await tab[1].click());
        await tabGroupWithIcons
            .getLastTab()
            .then(async (tab: TabHeadingAtom) => await tab.click());
        await tabGroupWithIcons
            .getFirstTab()
            .then(async (tab: TabHeadingAtom) => await tab.hover());
        await camera.say.cheese("Hover on inactive tab + switching active tab");

        await tabGroupResponsive.clickCaretRight(15);
        /** Waiting for the last tab to appear so we can click it */
        await browser.wait(
            ExpectedConditions.visibilityOf(
                await tabGroupResponsive
                    .getLastTab()
                    .then((tab) => tab.getElement())
            )
        );
        await (await tabGroupResponsive.getLastTab()).click();
        await (await tabGroupResponsive.getLastTab()).hover();
        await camera.say.cheese("Moving through tabs using caret right");

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 200000);
});
