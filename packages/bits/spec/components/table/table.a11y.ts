import { browser } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { TableAtom } from "../public_api";

describe("a11y: table", () => {
    let rulesToDisable: string[] = [
        "duplicate-id", // we don't care for the testing pages
        "aria-allowed-role", // NUI-6015
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("table/visual-test");
    });

    it("should check a11y of table", async () => {
        await assertA11y(browser, TableAtom.CSS_CLASS, rulesToDisable);
    });
});
