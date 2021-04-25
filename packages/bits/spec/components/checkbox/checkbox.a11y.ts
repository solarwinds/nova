import { browser } from "protractor";
import { Helpers } from "../../helpers";
import { CheckboxAtom } from "../public_api";

const AxeBuilder = require("@axe-core/webdriverjs");

describe("a11y: checkbox", () => {
    // disabling the rule until NUI-6015 is addressed
    let rulesToDisable: string[] = [
        "aria-allowed-role",
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("checkbox/checkbox-visual-test");
    });

    it("should verify a11y of checkbox", async () => {
        const accessibilityScanResults =
            await new AxeBuilder(browser.driver)
                .include(`.${CheckboxAtom.CSS_CLASS}`)
                .disableRules(rulesToDisable)
                .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
