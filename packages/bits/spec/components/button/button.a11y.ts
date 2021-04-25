import { browser } from "protractor";
import { Helpers } from "../../helpers";
import { ButtonAtom } from "../public_api";

const AxeBuilder = require("@axe-core/webdriverjs");

describe("a11y: button", () => {
    let rulesToDisable: string[] = [
        "duplicate-id-active",
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("button/button-visual-test");
    });

    it("should verify a11y of button", async () => {
        const accessibilityScanResults =
            await new AxeBuilder(browser.driver)
                .include(`.${ButtonAtom.CSS_CLASS}`)
                .disableRules(rulesToDisable)
                .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
