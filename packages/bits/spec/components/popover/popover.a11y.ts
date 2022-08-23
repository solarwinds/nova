import { browser, by, element } from "protractor";

import { assertA11y, Helpers } from "../../helpers";
import { PopoverAtom } from "../public_api";

describe("a11y: popover", () => {
    const rulesToDisable: string[] = [];
    const popoverModal: PopoverAtom = new PopoverAtom(
        element(by.id("nui-demo-popover-modal"))
    );
    const popoverBasic: PopoverAtom = new PopoverAtom(
        element(by.id("nui-demo-popover-basic"))
    );

    beforeAll(async () => {
        await Helpers.prepareBrowser("popover/popover-visual-test");
    });

    it("should check a11y of popover hover", async () => {
        await popoverBasic.openByHover();
        await assertA11y(browser, PopoverAtom.CSS_CLASS, rulesToDisable);
        await Helpers.clickOnEmptySpace();
    });

    it("should check a11y of popover modal", async () => {
        await popoverModal.open();
        await assertA11y(browser, PopoverAtom.CSS_CLASS, rulesToDisable);
    });
});
