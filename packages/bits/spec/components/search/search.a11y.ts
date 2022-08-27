import { browser } from "protractor";

import { assertA11y, Helpers } from "../../helpers";
import { SearchAtom } from "../public_api";

describe("a11y: search", () => {
    const rulesToDisable: string[] = [
        "landmark-unique", // we don't care about it on test pages
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("search/search-visual-test");
    });

    it("should check a11y of search", async () => {
        await assertA11y(browser, SearchAtom.CSS_CLASS, rulesToDisable);
    });
});
