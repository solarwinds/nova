import { browser} from "protractor";

import { Helpers } from "../../helpers";
import {
    ImageAtom
} from "../public_api";
const AxeBuilder = require("@axe-core/webdriverjs");

describe("a11y: image", () => {

    beforeAll(async () => {
        await Helpers.prepareBrowser("image/image-visual-test");
    });

    it("should check a11y of images", async () => {

        const accessibilityScanResults = await new AxeBuilder(browser.driver).include(`.${ImageAtom.CSS_CLASS}`).disableRules("duplicate-id").analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});