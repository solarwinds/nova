import { browser } from "protractor";

import { assertA11y, Helpers } from "../../helpers";
import { CdkDropListAtom, CdkDraggableItemAtom } from "../public_api";

describe("a11y: drag-and-drop", () => {
    const rulesToDisable: string[] = ["color-contrast"];

    beforeAll(async () => {
        await Helpers.prepareBrowser(
            "external-libraries/drag-and-drop/dropzone-visual"
        );
    });

    it("should check a11y of draggable item", async () => {
        await assertA11y(
            browser,
            CdkDraggableItemAtom.CSS_CLASS,
            rulesToDisable
        );
    });

    it("should check a11y of drop list", async () => {
        await assertA11y(browser, CdkDropListAtom.CSS_CLASS, rulesToDisable);
    });
});
