import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { PanelAtom } from "../panel/panel.atom";

describe("Visual tests: Panel", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let closablePanel: PanelAtom;
    let collapsiblePanel: PanelAtom;
    let customStylesPanel: PanelAtom;
    let hoverablePanel: PanelAtom;
    let topOrientedPanel: PanelAtom;
    let nestedPanelOuter: PanelAtom;
    let resizablePanel: PanelAtom;
    let expanders: {[key: string]: ElementFinder};

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
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
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Panel");

        // First we expand all expanders to check the default state of all panel cases
        for (const key of Object.keys(expanders)) { await expanders[key].click(); }
        await eyes.checkWindow("Basic view with hover on top orienter arrow button");

        // Then we close fist four expanders to hide examples we don't need for the test
        // This is done to reduce the amount of information on the screenshot and therefore
        // reduce it's size.
        await expanders.detailsBasicPanel.click();
        await expanders.detailsCustomSizes.click();
        await expanders.detailsHoverable.click();
        await expanders.detailsClosable.click();

        // Toggling outer panel, because its style previously overwritten styles of inner panel
        await nestedPanelOuter.toggleExpanded();
        await collapsiblePanel.toggleExpanded();
        await customStylesPanel.toggleExpanded();
        await resizablePanel.toggleExpanded();
        await topOrientedPanel.toggleExpanded();
        await resizablePanel.getToggleIcon().hover();
        await eyes.checkWindow("Expandable panes can be collapsed");

        // This closes last 4 examples that are already tested and expand ones closed in previous test
        for (const key of Object.keys(expanders)) { await expanders[key].click(); }

        await closablePanel.closeSidePane();
        await hoverablePanel.hoverOnSidePane();
        await eyes.checkWindow("Closable paned can be closed. Hoverable panel can be hovered");

        await eyes.close();
    }, 200000);
});
