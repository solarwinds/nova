import { browser } from "protractor";
import { Helpers } from "../../helpers";
import { CdkDropListAtom, CdkDraggableItemAtom } from "../public_api";

const AxeBuilder = require("@axe-core/webdriverjs");

describe("a11y: drag-and-drop", () => {

    beforeAll(async () => {
        await Helpers.prepareBrowser("external-libraries/drag-and-drop/dropzone-visual");
    });

    it("should check a11y of draggable item", async () => {
        const accessibilityScanResults = await new AxeBuilder(browser.driver).include(`.${CdkDraggableItemAtom.CSS_CLASS}`).disableRules("color-contrast").analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    it("should check a11y of drop list", async () => {
        const accessibilityScanResults = await new AxeBuilder(browser.driver).include(`.${CdkDropListAtom.CSS_CLASS}`).disableRules("color-contrast").analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
