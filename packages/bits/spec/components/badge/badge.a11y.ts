import { browser } from "protractor";

import { Helpers } from "../../helpers";

const AxeBuilder = require("@axe-core/webdriverjs");

describe("a11y: badge", () => {

    beforeAll(async () => {
        await Helpers.prepareBrowser("common/badge/badge-visual-test");
    });

    it("should check a11y of badge", async () => {
        const accessibilityScanResults = await new AxeBuilder(browser.driver).analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});