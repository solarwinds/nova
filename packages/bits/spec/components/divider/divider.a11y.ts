import { browser } from "protractor";

import { Helpers } from "../../helpers";
import {
    DividerAtom
} from "../public_api";
const AxeBuilder = require("@axe-core/webdriverjs");

describe("a11y: divider", () => {

    beforeAll(async () => {
        await Helpers.prepareBrowser("divider");
    });

    it("should check a11y of divider", async () => {
        const accessibilityScanResults = await new AxeBuilder(browser.driver).include(`.${DividerAtom.CSS_CLASS}`).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});