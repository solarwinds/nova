import { browser } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { ChipsAtom } from "../public_api";

describe("a11y: chips", () => {

    beforeAll(async () => {
        await Helpers.prepareBrowser("chips/chips-visual-test");
    });

    it("should verify a11y of chips", async () => {
        await assertA11y(browser, ChipsAtom.CSS_CLASS);
    });
});
