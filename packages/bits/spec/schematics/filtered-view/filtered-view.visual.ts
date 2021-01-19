import { browser, by, element } from "protractor";

import { Atom, CheckboxGroupAtom } from "../..";
import { Animations, Helpers } from "../../helpers";

// Enable after NUI-5702 is fixed
xdescribe("Visual tests: Filtered View", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let checkboxJustified: CheckboxGroupAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.disableCSSAnimations(Animations.ALL);
        checkboxJustified = Atom.findIn(CheckboxGroupAtom, element(by.className("nui-checkbox-group")));
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await Helpers.prepareBrowser(`schematics/filtered-view/list`);
        await filterByFirstOption();
        await eyes.open(browser, "NUI", "Filtered View");
        await eyes.checkWindow("Filtered View List");

        await Helpers.prepareBrowser(`schematics/filtered-view/list-pagination`);
        await filterByFirstOption();
        await eyes.checkWindow("Filtered View List with Pagination");

        await Helpers.prepareBrowser(`schematics/filtered-view/list-virtual-scroll`);
        await filterByFirstOption();
        await eyes.checkWindow("Filtered View List with Virtual Scroll");

        await Helpers.prepareBrowser(`schematics/filtered-view/table`);
        await filterByFirstOption();
        await eyes.checkWindow("Filtered View Table");

        await Helpers.prepareBrowser(`schematics/filtered-view/table-pagination`);
        await filterByFirstOption();
        await eyes.checkWindow("Filtered View Table with Pagination");

        await Helpers.prepareBrowser(`schematics/filtered-view/table-pagination-selection`);
        await filterByFirstOption();
        await eyes.checkWindow("Filtered View Table with Pagination and Selection");

        await Helpers.prepareBrowser(`schematics/filtered-view/table-virtual-scroll`);
        await filterByFirstOption();
        await eyes.checkWindow("Filtered View Table with Virtual Scroll");

        await Helpers.prepareBrowser(`schematics/filtered-view/table-virtual-scroll-selection`);
        await filterByFirstOption();
        await eyes.checkWindow("Filtered View Table with Virtual Scroll and Selection");

        await Helpers.prepareBrowser(`schematics/filtered-view/table-virtual-scroll-custom`);
        await filterByFirstOption();
        await eyes.checkWindow("Filtered View Table with Virtual Scroll with Custom Strategy");

        Helpers.switchDarkTheme("on");
        await eyes.checkWindow("Dark theme");
        Helpers.switchDarkTheme("off");

        await eyes.close();
    }, 200000);

    async function filterByFirstOption(): Promise<void> {
        return checkboxJustified.getFirst().setChecked(true);
    }

});
