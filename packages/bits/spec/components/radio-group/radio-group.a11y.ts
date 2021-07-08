import { browser } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { RadioGroupAtom } from "../public_api";

describe("a11y: radio group", () => {
    let rulesToDisable: string[] = [
        "nested-interactive",
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("radio-group/radio-group-visual-test");
    });

    it("should check a11y of radio group", async () => {
        await assertA11y(browser, RadioGroupAtom.CSS_CLASS, rulesToDisable);
    });
});
