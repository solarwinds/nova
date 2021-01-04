import { browser, by, element, ExpectedConditions } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";

import { TabHeadingGroupAtom } from "./tab-heading-group.atom";
import { TabHeadingAtom } from "./tab-heading.atom";

describe("Visual tests: Tab Heading Group", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let tabGroupHorizontal: TabHeadingGroupAtom;
    let tabGroupWithContent: TabHeadingGroupAtom;
    let tabGroupWithIcons: TabHeadingGroupAtom;
    let tabGroupResponsive: TabHeadingGroupAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("tabgroup/tabgroup-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        tabGroupHorizontal = Atom.findIn(TabHeadingGroupAtom, element(by.id("nui-demo-visual-tabgroup-horizontal")));
        tabGroupWithContent = Atom.findIn(TabHeadingGroupAtom, element(by.id("nui-demo-visual-tabgroup-with-content")));
        tabGroupWithIcons = Atom.findIn(TabHeadingGroupAtom, element(by.id("nui-demo-visual-tabgroup-horizontal-icons")));
        tabGroupResponsive = Atom.findIn(TabHeadingGroupAtom, element(by.id("nui-demo-visual-tabgroup-responsive")));

    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Tab Heading Group");
        await (await tabGroupHorizontal.getFirstTab()).hover();
        await eyes.checkWindow("Default");

        await tabGroupWithContent.getTabs().then(async (tab: TabHeadingAtom[]) => await tab[1].click());
        await tabGroupWithIcons.getLastTab().then(async (tab: TabHeadingAtom) => await tab.click());
        await tabGroupWithIcons.getFirstTab().then(async (tab: TabHeadingAtom) => await tab.hover());
        await eyes.checkWindow("Hover on inactive tab + switching active tab");

        await tabGroupResponsive.clickCaretRight(15);
        /** Waiting for the last tab to appear so we can click it */
        await browser.wait(ExpectedConditions.visibilityOf(await tabGroupResponsive.getLastTab().then((tab) => tab.getElement())));
        await (await tabGroupResponsive.getLastTab()).click();
        await (await tabGroupResponsive.getLastTab()).hover();
        await eyes.checkWindow("Moving through tabs using caret right");

        await Helpers.switchDarkTheme("on");
        await eyes.checkWindow("Dark theme");

        await eyes.close();
    }, 150000);
});
