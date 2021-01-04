import { browser, by, element } from "protractor";

import { Helpers } from "../../helpers";

import { MenuAtom } from "./menu.atom";

describe("Visual tests: Menu", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let menuBasic: MenuAtom;
    let menuBasicFooter: MenuAtom;
    let menuBasicDesctructive: MenuAtom;
    let menuBasicFooterDestructive: MenuAtom;
    let menuIconOnlyDestructive: MenuAtom;
    let menuMultiSelection: MenuAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("menu/menu-visual-test");

        menuBasic = new MenuAtom(element(by.id("nui-demo-basic-menu-with-icon")));
        menuBasicDesctructive = new MenuAtom(element(by.id("nui-demo-destructive-menu-with-icon")));
        menuBasicFooter = new MenuAtom(element(by.id("nui-demo-basic-menu-with-icon-footer")));
        menuBasicFooterDestructive = new MenuAtom(element(by.id("nui-demo-destructive-menu-with-icon-footer")));
        menuIconOnlyDestructive = new MenuAtom(element(by.id("nui-demo-menu-variants_run")));
        menuMultiSelection = new MenuAtom(element(by.id("nui-demo-multi-selection-menu")));
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Menu");

        await eyes.checkWindow("Default");

        await menuBasic.mouseDownOnMenuButton();
        await eyes.checkWindow("Mouse down effect");

        await menuBasic.mouseUp();
        await menuBasic.getMenuItemByIndex(2).hover();
        await eyes.checkWindow("Basic menu aligned top-left toggled. Edge detection worked fine");

        await menuBasic.getMenuItemByIndex(-1).scrollTo();
        await eyes.checkWindow("Scroll to bottom to capture the destructive item and verify it's last");

        await menuBasicDesctructive.toggleMenu();
        await eyes.checkWindow("Basic destructive menu aligned top-right toggled. Edge detection worked fine");
        await menuBasicDesctructive.toggleMenu();

        await menuBasicFooter.toggleMenu();
        await eyes.checkWindow("Basic menu aligned bottom-left toggled. Edge detection worked fine");
        await menuBasicFooter.toggleMenu();

        await menuBasicFooterDestructive.toggleMenu();
        await eyes.checkWindow("Basic menu bottom-right toggled. Edge detection worked fine");
        await menuBasicFooterDestructive.toggleMenu();

        await menuIconOnlyDestructive.toggleMenu();
        await menuIconOnlyDestructive.getMenuItemByIndex(-1).scrollTo();
        await menuIconOnlyDestructive.getMenuItemByIndex(3).clickItem();
        await menuIconOnlyDestructive.getMenuItemByIndex(5).hover();
        await eyes.checkWindow("Menu with different types of menu items is toggled (destructive menu)");

        await Helpers.switchDarkTheme("on");
        await eyes.checkWindow("Dark theme test 1");
        await Helpers.switchDarkTheme("off");
        await menuIconOnlyDestructive.toggleMenu();

        await menuMultiSelection.toggleMenu();
        await menuMultiSelection.getMenuItemByIndex(-1).scrollTo();
        await menuMultiSelection.getMenuItemByIndex(3).clickItem();
        await menuMultiSelection.getMenuItemByIndex(4).clickItem();
        await menuMultiSelection.getMenuItemByIndex(5).hover();
        await eyes.checkWindow("Menu with multiseletion is toggled (two items are selected and one is hovered)");

        await Helpers.switchDarkTheme("on");
        await eyes.checkWindow("Dark theme");

        await eyes.close();
    }, 200000);
});
