import { browser, by, element } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { MenuAtom } from "../public_api";

describe("a11y: menu", () => {
    let menuBasic: MenuAtom;
    let rulesToDisable: string[] = [
        "color-contrast", // NUI-6014
        "scrollable-region-focusable", // NUI-5935, NUI-6007
    ];

    beforeAll(async () => {
        await Helpers.prepareBrowser("menu/menu-visual-test");

        menuBasic = new MenuAtom(
            element(by.id("nui-demo-basic-menu-with-icon"))
        );
    });

    it("should check a11y of menu", async () => {
        await menuBasic.toggleMenu();
        await assertA11y(browser, MenuAtom.CSS_CLASS, rulesToDisable);
    });
});
