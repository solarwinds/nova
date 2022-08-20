import { browser } from "protractor";
import { Atom } from "../../atom";
import { assertA11y, Helpers } from "../../helpers";
import { WizardAtom } from "../public_api";

describe("a11y: wizard", () => {
    let rulesToDisable: string[] = ["duplicate-id"];
    let basicWizard: WizardAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("wizard/wizard-visual-test");

        basicWizard = Atom.find(WizardAtom, "nui-demo-wizard");
    });

    it("should check a11y of wizard", async () => {
        await assertA11y(browser, WizardAtom.CSS_CLASS, rulesToDisable);
    });

    it("should check a11y of wizard", async () => {
        await basicWizard.next();
        await assertA11y(browser, WizardAtom.CSS_CLASS, rulesToDisable);
    });
});
