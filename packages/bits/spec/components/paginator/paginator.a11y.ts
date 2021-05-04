import { browser } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { PaginatorAtom } from "../public_api";

describe("a11y: paginator", () => {
    let rulesToDisable: string[] = [];

    beforeAll(async () => {
        await Helpers.prepareBrowser("paginator/paginator-visual-test");
    });

    it("should check a11y of paginator", async () => {
        await assertA11y(browser, PaginatorAtom.CSS_CLASS, rulesToDisable);
    });
});
