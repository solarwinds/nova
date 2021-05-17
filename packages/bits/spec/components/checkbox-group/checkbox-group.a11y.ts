import { browser } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { CheckboxGroupAtom } from "../public_api";

describe("a11y: checkbox-group", () => {
    // disabling the rule until NUI-6015 is addressed
    let rulesToDisable: string[] = [
        "aria-allowed-role",
        "aria-toggle-field-name",
    ];

    beforeAll(async () => {
        await browser.waitForAngularEnabled(false);
        await Helpers.prepareBrowser("checkbox-group/checkbox-group-visual-test");
    });

    it("should verify a11y of checkbox group", async () => {
        await assertA11y(browser, CheckboxGroupAtom.CSS_CLASS, rulesToDisable);
    });
});
