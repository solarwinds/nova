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

import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { MenuAtom } from "../menu/menu.atom";
import { ExpanderAtom } from "./expander.atom";

describe("USERCONTROL expander", () => {
    const basicExpander: ExpanderAtom = Atom.find(
        ExpanderAtom,
        "nui-demo-expander-basic"
    );
    const headerTextAndIconExpander: ExpanderAtom = Atom.find(
        ExpanderAtom,
        "nui-demo-expander-text-and-icon"
    );
    const headerCustomContent: ExpanderAtom = Atom.find(
        ExpanderAtom,
        "nui-demo-expander-custom-header"
    );
    const initiallyExpandedExpander: ExpanderAtom = Atom.find(
        ExpanderAtom,
        "nui-demo-expander-initially-expanded"
    );
    const openChangeExpander: ExpanderAtom = Atom.find(
        ExpanderAtom,
        "nui-demo-expander-open-change"
    );

    beforeAll(async () => {
        await Helpers.prepareBrowser("expander/expander-test");
    });

    it("should have correct icons when expanded and collapse", async () => {
        expect(
            await initiallyExpandedExpander.getExpanderToggleIcon().getName()
        ).toEqual("triangle-down");
        await initiallyExpandedExpander.toggle();
        expect(
            await initiallyExpandedExpander.getExpanderToggleIcon().getName()
        ).toEqual("triangle-right");
        await initiallyExpandedExpander.toggle();
    });

    it("should toggle expanded/collapsed", async () => {
        expect(await basicExpander.isExpanded()).toBe(
            false,
            "'basic' expander is expanded before toggle"
        );
        await basicExpander.toggle();
        expect(await basicExpander.isExpanded()).toBe(
            true,
            "'basic' expander is NOT expanded on toggle"
        );
        expect(await headerTextAndIconExpander.isExpanded()).toBe(
            false,
            "'header text and icon' expander is expanded before toggle"
        );
        await headerTextAndIconExpander.toggle();
        expect(await headerTextAndIconExpander.isExpanded()).toBe(
            true,
            "'header text and icon' expander is NOT expanded on toggle"
        );
        await basicExpander.toggle();
        await headerTextAndIconExpander.toggle();
    });

    it("should remove the content from DOM when collapsed", async () => {
        await initiallyExpandedExpander.toggle();
        await browser.wait(
            async () => await initiallyExpandedExpander.isCollapsed(),
            1000
        );
        expect(await initiallyExpandedExpander.isExpanded()).toBe(false);
        expect(
            await initiallyExpandedExpander.isContentAttachedToDOM("p")
        ).toBe(false);
        await initiallyExpandedExpander.toggle();
    });

    it("should change button text when it's dynamically changed by openChange", async () => {
        const dynamicButton = browser.element(
            by.className("nui-demo-expander-open-change-button")
        );
        expect(await openChangeExpander.isCollapsed()).toBe(true);
        expect(await dynamicButton.getText()).toEqual("Open");
        await openChangeExpander.toggle();
        expect(await openChangeExpander.isCollapsed()).toBe(false);
        expect(await dynamicButton.getText()).toEqual("Close");
        await openChangeExpander.toggle();
    });

    it("menu items should be clickable", async () => {
        const menu = Atom.find(MenuAtom, "nui-demo-expander-header-menu");
        await menu.toggleMenu();
        await menu.getMenuItemByIndex(1).clickItem();
        const alertText = await (await browser.switchTo().alert()).getText();
        await (await browser.switchTo().alert()).accept();
        expect(alertText).toEqual("hello");
        await menu.toggleMenu();
    });

    it("should not expand an expander when menu is clicked", async () => {
        const menu = Atom.find(MenuAtom, "nui-demo-expander-header-menu");
        await menu.toggleMenu();
        expect(await headerCustomContent.isCollapsed()).toBeTruthy();
        await menu.toggleMenu();
    });
});
