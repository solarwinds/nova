import { browser } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { MessageAtom } from "../public_api";

describe("a11y: message", () => {
    let rulesToDisable: string[] = [
        "color-contrast",
        "duplicate-id",
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("message/message-visual-test");
    });

    it("should check a11y of message", async () => {
        await assertA11y(browser, MessageAtom.CSS_CLASS, rulesToDisable);
    });
});
