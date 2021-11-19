import { browser } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { SorterAtom } from "../public_api";

describe("a11y: sorter", () => {
    const rulesToDisable: string[] = [];

    beforeAll(async () => {
        await Helpers.prepareBrowser("sorter/visual-test");
    });

    it("should check a11y of sorter", async () => {
        await assertA11y(browser, SorterAtom.CSS_CLASS, rulesToDisable);
    });
});
