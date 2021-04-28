import { browser } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { DividerAtom } from "../public_api";

describe("a11y: divider", () => {

    beforeAll(async () => {
        await Helpers.prepareBrowser("divider");
    });

    it("should check a11y of divider", async () => {
        await assertA11y(browser, DividerAtom.CSS_CLASS);
    });
});
