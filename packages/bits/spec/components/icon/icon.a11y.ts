import { browser } from "protractor";
import { Helpers } from "../../helpers";
import { IconAtom } from "../public_api";

const AxeBuilder = require("@axe-core/webdriverjs");

describe("a11y: icon", () => {

    beforeAll(async () => {
        await Helpers.prepareBrowser("icon/icon-visual-test");
    });

    it("should check a11y of icon", async () => {
        const accessibilityScanResults = await new AxeBuilder(browser.driver).include(`.${IconAtom.CSS_CLASS}`).disableRules("duplicate-id").analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
