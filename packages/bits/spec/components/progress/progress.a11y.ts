import { browser, by, element } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { ProgressAtom, ButtonAtom } from "../public_api";

describe("a11y: progress", () => {
    let rulesToDisable: string[] = [
        "nested-interactive",
    ];
    let startProgressBasic: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("progress/progress-visual-test");

        startProgressBasic = new ButtonAtom(element(by.id("nui-demo-start-basic-progress")));
    });

    it("should check a11y of progress", async () => {
        await startProgressBasic.click();
        await assertA11y(browser, ProgressAtom.CSS_CLASS, rulesToDisable);
    });
});
