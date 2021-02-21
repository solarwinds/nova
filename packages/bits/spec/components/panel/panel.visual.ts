import { percySnapshot } from "@percy/protractor";
import fs from "fs";
import { $, browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { PanelAtom } from "../panel/panel.atom";

fdescribe("Visual tests: Panel", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let closablePanel: PanelAtom;
    let collapsiblePanel: PanelAtom;
    let customStylesPanel: PanelAtom;
    let hoverablePanel: PanelAtom;
    let topOrientedPanel: PanelAtom;
    let nestedPanelOuter: PanelAtom;
    let resizablePanel: PanelAtom;
    let expanders: {[key: string]: ElementFinder};

    beforeEach(async (done) => {
        await Helpers.prepareBrowser("panel/panel-visual-test");

        collapsiblePanel = Atom.find(PanelAtom, "nui-visual-test-embedded-content-panel");
        closablePanel = Atom.find(PanelAtom, "nui-visual-test-hidden-panel");
        customStylesPanel = Atom.find(PanelAtom, "nui-visual-test-custom-styles-panel");
        hoverablePanel = Atom.find(PanelAtom, "nui-visual-test-hoverable-panel");
        topOrientedPanel = Atom.find(PanelAtom, "nui-visual-test-top-oriented-panel");
        nestedPanelOuter = Atom.find(PanelAtom, "nui-visual-test-nested-panel-outer");
        resizablePanel = Atom.find(PanelAtom, "nui-visual-test-resizable-panel");

        expanders = {
            detailsBasicPanel : element(by.id("nui-visual-basic-panel-details")),
            detailsCustomSizes : element(by.id("nui-visual-custom-size-panel-details")),
            detailsHoverable : element(by.id("nui-visual-hoverable-panel-details")),
            detailsClosable : element(by.id("nui-visual-closable-panel-details")),
            detailsWithEmbeddedContent : element(by.id("nui-visual-with-embedded-details")),
            detailsCustomStyles : element(by.id("nui-visual-custom-style-panel-details")),
            detailsResizable : element(by.id("nui-visual-resizable-details")),
            detailsTopOriented : element(by.id("nui-visual-top-oriented-panel-details")),
            detailsNested : element(by.id("nui-visual-nested-panel-details")),
        };

        done();
    });

    afterAll(async (done) => {
        done();
    }, 1000);

    it("Default look", async (done) => {
        for (const key of Object.keys(expanders)) { await expanders[key].click(); }
        const window: number = (await browser.manage().window().getSize()).height;
        // const window: number = await browser.executeScript("window.outerHeight");
        // const body: number = await browser.executeScript("document.body.scrollHeight");
        const body: number = (await $("body").getSize()).height;

        // console.log(">>> window", window);
        // console.log(">>> body", body);

        // First we expand all expanders to check the default state of all panel cases
        await browser.manage().window().setSize(1920, body);
        // console.log(">>> window 2", (await browser.manage().window().getSize()).height);
        await percySnapshot(`The panel full page`);

        // const png = await $("body").takeScreenshot(true);
        
        // fs.writeFileSync("./spec/panel.png", png, {encoding: "base64"});

        await browser.manage().window().setSize(1920, window);

        // await Helpers.switchDarkTheme("on");
        // await eyes.checkWindow("Dark theme");
        // await Helpers.switchDarkTheme("off");

        // // Then we close fist four expanders to hide examples we don't need for the test
        // // This is done to reduce the amount of information on the screenshot and therefore
        // // reduce it's size.
        // await expanders.detailsBasicPanel.click();
        // await expanders.detailsCustomSizes.click();
        // await expanders.detailsHoverable.click();
        // await expanders.detailsClosable.click();

        // // Toggling outer panel, because its style previously overwritten styles of inner panel
        // await nestedPanelOuter.toggleExpanded();
        // await collapsiblePanel.toggleExpanded();
        // await customStylesPanel.toggleExpanded();
        // await resizablePanel.toggleExpanded();
        // await topOrientedPanel.toggleExpanded();
        // await resizablePanel.getToggleIcon().hover();
        // await eyes.checkWindow("Expandable panes can be collapsed");

        // // This closes last 4 examples that are already tested and expand ones closed in previous test
        // for (const key of Object.keys(expanders)) { await expanders[key].click(); }

        // await closablePanel.closeSidePane();
        // await hoverablePanel.hoverOnSidePane();
        // await eyes.checkWindow("Closable paned can be closed. Hoverable panel can be hovered");

        done();
    }, 300000);
});
