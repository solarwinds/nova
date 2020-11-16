import { browser, by } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { MenuAtom } from "../menu/menu.atom";

import { ExpanderAtom } from "./expander.atom";

describe("USERCONTROL expander", () => {
    const basicExpander: ExpanderAtom = Atom.find(ExpanderAtom, "nui-demo-expander-basic");
    const headerTextExpander: ExpanderAtom = Atom.find(ExpanderAtom, "nui-demo-expander-header-text");
    const headerTextAndIconExpander: ExpanderAtom = Atom.find(ExpanderAtom, "nui-demo-expander-text-and-icon");
    const headerCustomContent: ExpanderAtom = Atom.find(ExpanderAtom, "nui-demo-expander-custom-header");
    const initiallyExpandedExpander: ExpanderAtom = Atom.find(ExpanderAtom, "nui-demo-expander-initially-expanded");
    const openChangeExpander: ExpanderAtom = Atom.find(ExpanderAtom, "nui-demo-expander-open-change");
    const withoutBorderExpander: ExpanderAtom = Atom.find(ExpanderAtom, "nui-demo-expander-without-border");

    beforeEach(async () => {
        await Helpers.prepareBrowser("expander");
    });

    it("should exist", () => {
        expect(basicExpander).toBeDefined();
        expect(headerTextAndIconExpander).toBeDefined();
        expect(headerCustomContent).toBeDefined();
    });

    it("should show both icon and text in when they are set", async () => {
        expect(await headerTextAndIconExpander.isHeaderIconPresent()).toBeTruthy();
        expect(await headerTextAndIconExpander.getHeadingText()).toEqual("Advanced Options");
    });

    it("should not show icon when it's not set", async () => {
        expect(await headerTextExpander.isHeaderIconPresent()).toBeFalsy();
        expect(await headerTextExpander.getHeadingText()).toEqual("Advanced Layout Settings");
    });

    it("should have correct icons when expanded and collapse", async () => {
        expect(await initiallyExpandedExpander.getExpanderToggleIcon().getName()).toEqual("triangle-down");
        await initiallyExpandedExpander.toggle();
        expect(await initiallyExpandedExpander.getExpanderToggleIcon().getName()).toEqual("triangle-right");
    });

    it("header should be rendered as button 30x30px if header has no title, no header content icon and no custom header", async () => {
        const headerElement = await basicExpander.getElement().element(by.className("nui-expander__header")).getWebElement();
        const expanderHeaderSize = await headerElement.getSize();
        expect(expanderHeaderSize.height).toEqual(30);
        expect(expanderHeaderSize.width).toEqual(30);
    });

    it("should toggle expanded/collapsed", async () => {
        expect(await basicExpander.isExpanded()).toBe(false, "'basic' expander is expanded before toggle");
        await basicExpander.toggle();
        expect(await basicExpander.isExpanded()).toBe(true, "'basic' expander is NOT expanded on toggle");
        expect(await headerTextAndIconExpander.isExpanded())
            .toBe(false, "'header text and icon' expander is expanded before toggle");
        await headerTextAndIconExpander.toggle();
        expect(await headerTextAndIconExpander.isExpanded())
            .toBe(true, "'header text and icon' expander is NOT expanded on toggle");
    });

    it("should display content when expanded", async () => {
        expect(await initiallyExpandedExpander.isExpanded()).toBe(true);
        expect(await initiallyExpandedExpander.isContentAttachedToDOM("p")).toBe(true);
        expect(await initiallyExpandedExpander.isContentDisplayed("p")).toBe(true);
    });

    it("should remove the content from DOM when collapsed", async () => {
        await initiallyExpandedExpander.toggle();
        await browser.wait(async () => await initiallyExpandedExpander.isCollapsed(), 1000);
        expect(await initiallyExpandedExpander.isExpanded()).toBe(false);
        expect(await initiallyExpandedExpander.isContentAttachedToDOM("p")).toBe(false);
    });

    it("should change button text when it's dynamically changed by openChange", async () => {
        const dynamicButton = browser.element(by.className("nui-demo-expander-open-change-button"));
        expect(await openChangeExpander.isCollapsed()).toBe(true);
        expect(await dynamicButton.getText()).toEqual("Open");
        await openChangeExpander.toggle();
        expect(await openChangeExpander.isCollapsed()).toBe(false);
        expect(await dynamicButton.getText()).toEqual("Close");
    });

    it("should not have dotted border left", async () => {
        const expanderBodyLeftBorderWidth = await withoutBorderExpander.getBodyLeftBorderWidth();
        expect(expanderBodyLeftBorderWidth).toEqual("0px");
    });

    it("menu items should be clickable", async () => {
        const menu = Atom.find(MenuAtom, "nui-demo-expander-header-menu");
        await menu.toggleMenu();
        await menu.getMenuItemByIndex(1).clickItem();
        const alertText = await (await browser.switchTo().alert()).getText();
        await (await browser.switchTo().alert()).accept();
        expect(alertText).toEqual("hello");
    });

    it("should not expand an expander when menu is clicked", async () => {
        const menu = Atom.find(MenuAtom, "nui-demo-expander-header-menu");
        await menu.toggleMenu();
        expect(await headerCustomContent.isCollapsed()).toBeTruthy();
    });

    it("should have line height of the header title equal to 18px", async () => {
        const headerHeight = await headerTextExpander.getHeaderHeight();
        expect(headerHeight).toEqual(18);
    });

    it("should have width of the custom header equal to 0 if custom header is not specified", async () => {
        const customHeaderWidth = await headerTextExpander.getCustomHeaderWidth();
        expect(customHeaderWidth).toEqual(0);
    });
});
