import { browser } from "protractor";
import { ISize } from "selenium-webdriver";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";

import { ToolbarAtom } from "./toolbar.atom";

describe("Visual tests: Toolbar", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let originalSize: ISize;
    let toolbarBasic: ToolbarAtom;
    let toolbarSelected: ToolbarAtom;
    let toolbarNoMenuSelected: ToolbarAtom;

    const id = {
        toolbarBasic: "nui-toolbar-test",
        toolbarWithEmbeddedContent: "nui-toolbar-test-embedded",
        toolbarSelected: "nui-toolbar-test-selected",
        toolbarNoMenuWithSearch: "nui-toolbar-no-menu-with-search",
        toolbarNoMenuSelectedWithSearch: "nui-toolbar-with-selection-no-menu-with-search",
        toolbarNoMenu: "nui-toolbar-no-menu",
        toolbarNoMenuSelected: "nui-toolbar-with-selection-no-menu",
    };

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("toolbar/toolbar-visual-test");
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        originalSize = await browser.manage().window().getSize();

        toolbarBasic = Atom.find(ToolbarAtom, id.toolbarBasic);
        toolbarSelected = Atom.find(ToolbarAtom, id.toolbarSelected);
        toolbarNoMenuSelected = Atom.find(ToolbarAtom, id.toolbarNoMenuSelected);
    });

    afterAll(async () => {
        // Restoring the initial window size
        await browser.manage().window().setSize(originalSize.width, originalSize.height);
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Toolbar");
        await eyes.checkWindow("Default");

        await browser.manage().window().setSize(1024, originalSize.height);
        await eyes.checkWindow("With screen width 1024");

        await toolbarBasic.getToolbarMenu().toggleMenu();
        await eyes.checkWindow("Toggle menu in toolbar With screen width 1024");
        await toolbarBasic.getToolbarMenu().toggleMenu();

        await browser.manage().window().setSize(800, originalSize.height);
        await eyes.checkWindow("With screen width 800");

        await toolbarSelected.getToolbarMenu().toggleMenu();
        await eyes.checkWindow("Toggle menu in selected toolbar With screen width 800");
        await toolbarSelected.getToolbarMenu().toggleMenu();

        await browser.manage().window().setSize(originalSize.width, originalSize.height);

        await Helpers.setCustomWidth("200px", id.toolbarBasic);
        await Helpers.setCustomWidth("350px", id.toolbarWithEmbeddedContent);
        await Helpers.setCustomWidth("450px", id.toolbarSelected);
        await Helpers.setCustomWidth("360px", id.toolbarNoMenuWithSearch);
        await Helpers.setCustomWidth("450px", id.toolbarNoMenuSelectedWithSearch);
        await Helpers.setCustomWidth("200px", id.toolbarNoMenu);
        await Helpers.setCustomWidth("200px", id.toolbarNoMenuSelected);
        await eyes.checkWindow("Super-condenced toolbar");

        await toolbarNoMenuSelected.getToolbarMenu().toggleMenu();
        await eyes.checkWindow("Menu toggled on selected Super-condenced toolbar");
        await toolbarNoMenuSelected.getToolbarMenu().toggleMenu();

        await eyes.close();

        /**
         * The jasmine timeout interval is that big because the test is quite large. Not only eyes.checkWindow()
         * takes a screenshot and sends it to Applitools server, but also retries the screesnhot take if needed,
         * does the comparison and returns a result.
         */
    }, 200000);
});
