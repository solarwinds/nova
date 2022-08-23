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
