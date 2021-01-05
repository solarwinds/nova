import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";

import { ChipsAtom } from "./chips.atom";

describe("Visual tests: Chips", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let chipsBasic: ChipsAtom;
    let chipsVertGroup: ChipsAtom;
    let chipsOverflow: ChipsAtom;

    beforeEach( async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("chips/chips-visual-test");

        chipsBasic = Atom.find(ChipsAtom, "nui-demo-chips-flat-horizontal-visual");
        chipsVertGroup = Atom.find(ChipsAtom, "nui-demo-chips-grouped-vertical-visual");
        chipsOverflow = Atom.find(ChipsAtom, "nui-demo-chips-overflow");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Chips");
        await eyes.checkWindow("Default");

        const chipselement = chipsBasic.getChipElement(2);
        await chipsBasic.hover(chipselement);
        await eyes.checkWindow("Hover effect");

        await chipsBasic.removeItem(2);
        await chipsBasic.removeItem(3);
        await chipsVertGroup.clearAll();
        await eyes.checkWindow("Removed 2 chips and 'Clear All' vertical group");

        await chipsOverflow.getChipsOverflowElement().click();
        await eyes.checkWindow("Open popup with overflow chips");

        await Helpers.switchDarkTheme("on");
        await eyes.checkWindow("Dark theme");

        await eyes.close();
    }, 100000);
});
