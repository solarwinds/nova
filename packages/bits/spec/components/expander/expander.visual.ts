import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ExpanderAtom } from "../expander/expander.atom";
import { MenuAtom } from "../menu/menu.atom";

describe("Visual tests: Expander", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let basicExpander: ExpanderAtom;
    let lineLessExpander: ExpanderAtom;
    let customHeaderExpander: ExpanderAtom;
    let stakedExpander: ExpanderAtom;
    let menuEmbedded: MenuAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("expander/expander-visual-test");
        basicExpander = Atom.find(ExpanderAtom, "nui-visual-test-expander-basic");
        lineLessExpander = Atom.find(ExpanderAtom, "nui-visual-test-expander-without-border");
        customHeaderExpander = Atom.find(ExpanderAtom, "nui-visual-test-expander-custom-header");
        stakedExpander = Atom.find(ExpanderAtom, "nui-visual-test-staked-expander-1");
        menuEmbedded = Atom.find(MenuAtom, "nui-demo-expander-header-menu");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Expander");
        await eyes.checkWindow("Default");

        await basicExpander.toggle();
        await lineLessExpander.getExpanderToggleIcon().hover();
        await eyes.checkWindow("BasicExpander is toggled and Expander without expand line is hovered");

        await basicExpander.toggle();
        await lineLessExpander.toggle();
        await customHeaderExpander.hover();
        await eyes.checkWindow("Expander without expand line is toggled and Expander with custom header is hovered");

        await lineLessExpander.toggle();
        await stakedExpander.toggle();
        await menuEmbedded.hover();
        await eyes.checkWindow("Staked Expander is toggled and menu in Expander with custom header is hovered");

        await eyes.close();
    }, 100000);
});
