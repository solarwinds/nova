import { browser } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { CheckboxAtom } from "../public_api";

describe("a11y: checkbox", () => {
    // disabling the rule until NUI-6015 is addressed
    let rulesToDisable: string[] = [
        "aria-allowed-role",
    ];

    beforeAll(async () => {
        await browser.waitForAngularEnabled(false);
        await Helpers.prepareBrowser("checkbox/checkbox-visual-test");
    });

    it("should verify a11y of checkbox", async () => {
        await assertA11y(browser, CheckboxAtom.CSS_CLASS, rulesToDisable);
    });
});
