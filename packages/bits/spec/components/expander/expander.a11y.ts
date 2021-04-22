import { browser } from "protractor";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ExpanderAtom } from "../public_api";

const AxeBuilder = require("@axe-core/webdriverjs");

describe("a11y: expander", () => {
    let basicExpander: ExpanderAtom;
    let lineLessExpander: ExpanderAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("expander/expander-visual-test");
        basicExpander = Atom.find(ExpanderAtom, "nui-visual-test-expander-basic");
        lineLessExpander = Atom.find(ExpanderAtom, "nui-visual-test-expander-without-border");
        await basicExpander.toggle();
        await lineLessExpander.toggle();
    });

    it("should check a11y of expander", async () => {
        const accessibilityScanResults = await new AxeBuilder(browser.driver)
        .include(`.${ExpanderAtom.CSS_CLASS}`)
        .disableRules(["color-contrast", "aria-progressbar-name", "aria-required-children", "aria-dialog-name"])
        .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
