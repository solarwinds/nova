import { browser, by, element, ElementFinder } from "protractor";
import { Helpers } from "../../helpers";
import { BusyAtom } from "../public_api";

const AxeBuilder = require("@axe-core/webdriverjs");

describe("a11y: busy", () => {
    let switchBusyState: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("busy/busy-visual-test");
        switchBusyState = element(by.id("nui-busy-test-button"));
    });
    it("should check a11y of busy - on", async () => {
        const accessibilityScanResults = await new AxeBuilder(browser.driver).include(`.${BusyAtom.CSS_CLASS}`).disableRules("color-contrast").analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
    });

    it("should check a11y of busy - off", async () => {
        await switchBusyState.click();
        const accessibilityScanResults = await new AxeBuilder(browser.driver).include(`.${BusyAtom.CSS_CLASS}`).disableRules("color-contrast").analyze();
        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
