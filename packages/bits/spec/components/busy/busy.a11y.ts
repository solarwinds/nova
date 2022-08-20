import { browser, by, element, ElementFinder } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { BusyAtom } from "../public_api";

describe("a11y: busy", () => {
    let switchBusyState: ElementFinder;
    let rulesToDisable: string[] = [
        "color-contrast",
        "aria-progressbar-name",
        "duplicate-id",
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("busy/busy-visual-test");
        switchBusyState = element(by.id("nui-busy-test-button"));
    });

    it("should check a11y of busy - on", async () => {
        await assertA11y(browser, BusyAtom.CSS_CLASS, rulesToDisable);
    });

    it("should check a11y of busy - off", async () => {
        await switchBusyState.click();
        await assertA11y(browser, BusyAtom.CSS_CLASS, rulesToDisable);
    });
});
