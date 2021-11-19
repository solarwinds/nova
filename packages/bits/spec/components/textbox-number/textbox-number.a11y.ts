import { browser } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { TextboxNumberAtom } from "../public_api";

describe("a11y: textbox-number", () => {
    const rulesToDisable: string[] = [];

    beforeAll(async () => {
        await Helpers.prepareBrowser("textbox/textbox-number-visual-test");
    });

    it("should check a11y of textbox-number", async () => {
        await assertA11y(browser, TextboxNumberAtom.CSS_CLASS, rulesToDisable);
    });
});
