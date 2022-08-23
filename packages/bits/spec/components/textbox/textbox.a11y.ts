import { browser } from "protractor";

import { assertA11y, Helpers } from "../../helpers";
import { TextboxAtom } from "../public_api";

describe("a11y: textbox", () => {
    const rulesToDisable: string[] = [];

    beforeAll(async () => {
        await Helpers.prepareBrowser("textbox/textbox-visual-test");
    });

    it("should check a11y of textbox", async () => {
        await assertA11y(browser, TextboxAtom.CSS_CLASS, rulesToDisable);
    });
});
