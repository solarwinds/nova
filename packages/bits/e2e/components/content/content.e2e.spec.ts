import { Atom } from "../../atom";
import { expect, Helpers, test } from "../../setup";
import { ButtonAtom } from "../button/button.atom";
import { ContentAtom } from "./content.atom";

test.describe("USERCONTROL content >", () => {
    let contentSmall: ContentAtom;
    let contentLarge: ContentAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("content", page);
        contentSmall = Atom.find<ContentAtom>(
            ContentAtom,
            "test-element-small"
        );
        contentLarge = Atom.find<ContentAtom>(
            ContentAtom,
            "test-element-large"
        );
    });

    test("should display passed content", async () => {
        const btnAtom = Atom.find<ButtonAtom>(ButtonAtom, "test-element");
        await expect(btnAtom.getLocator()).toHaveText("Click");
        await btnAtom.click();
        await expect(btnAtom.getLocator()).toHaveText("Clicked!");
    });

    test("should have scrollbar if its size is too small for content", async () => {
        await contentSmall.toHaveScrollbar();
    });

    test("should hide scrollbar if its size is enough space for content", async () => {
        await contentLarge.toNotHaveScrollbar();
    });
});
