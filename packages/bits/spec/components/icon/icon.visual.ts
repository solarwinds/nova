import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { IconAtom } from "../icon/icon.atom";

describe("Visual tests: Icon", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any,
        // TODO Will fix in NUI-4891
        regionSize: any,
        iconBasic: IconAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("icon/icon-visual-test");

        regionSize = {left: 0, top: 0, width: 230, height: 150};
        iconBasic = Atom.find(IconAtom, "nui-icon-test-basic-usage");
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Icon");
        await eyes.checkWindow("All icons");
        await iconBasic.hover();
        /**
         * "Any" is used here because of a mistake in typings delivered by Applitools (checkRegion() method parameters
         * are declared in different and incorrect order).
         */
        await eyes.checkRegion(regionSize, "Icon is hovered" as any);
        await eyes.close();
    }, 100000);
});
