import { browser, by, element, ElementFinder } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { BreadcrumbAtom } from "../public_api";

describe("a11y: breadcrumb", () => {
    let showSecondViewButton: ElementFinder;
    let showThirdViewButton: ElementFinder;

    beforeAll(async () => {
        showSecondViewButton = element(
            by.id("nui-demo-breadcrumb-show-second-view")
        );
        showThirdViewButton = element(
            by.id("nui-demo-breadcrumb-show-third-view")
        );
        await Helpers.prepareBrowser("breadcrumb/breadcrumb-visual-test");

        await showSecondViewButton.click();
        await showThirdViewButton.click();
    });

    it("should check a11y of breadcrumb", async () => {
        await assertA11y(browser, BreadcrumbAtom.CSS_CLASS);
    });
});
