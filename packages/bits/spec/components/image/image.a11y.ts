import { browser } from "protractor";

import { assertA11y, Helpers } from "../../helpers";
import { ImageAtom } from "../public_api";

describe("a11y: image", () => {
    const rulesToDisable: string[] = [
        "duplicate-id", // has nothing to do with the images
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("image/image-visual-test");
    });

    it("should check a11y of images", async () => {
        await assertA11y(browser, ImageAtom.CSS_CLASS, rulesToDisable);
    });
});
