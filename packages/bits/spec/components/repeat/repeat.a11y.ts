import { browser } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { RepeatAtom } from "../public_api";

describe("a11y: repeat", () => {
    let rulesToDisable: string[] = [
        "color-contrast",
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("repeat/repeat-visual-test");
    });

    it("should check a11y of repeat", async () => {
        await assertA11y(browser, RepeatAtom.CSS_CLASS, rulesToDisable);
    });
});
