import { browser } from "protractor";
import { Atom } from "../../atom";
import { assertA11y, Helpers } from "../../helpers";
import { ExpanderAtom } from "../public_api";

describe("a11y: expander", () => {
    let basicExpander: ExpanderAtom;
    let lineLessExpander: ExpanderAtom;
    let rulesToDisable: string[] = [
        "aria-required-children",
        "aria-dialog-name",
        "landmark-unique",
        "aria-command-name",
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("expander/expander-visual-test");
        basicExpander = Atom.find(ExpanderAtom, "nui-visual-test-expander-basic");
        lineLessExpander = Atom.find(ExpanderAtom, "nui-visual-test-expander-without-border");
    });

    it("should check a11y of expander", async () => {
        await basicExpander.toggle();
        await lineLessExpander.toggle();
        await assertA11y(browser, ExpanderAtom.CSS_CLASS, rulesToDisable);
    });
});
