import { BreadcrumbAtom } from "./breadcrumb.atom";
import { Atom } from "../../atom";
import { Helpers, test } from "../../setup";

test.describe("a11y: breadcrumb", () => {
    let showSecondViewButton: Atom;
    let showThirdViewButton: Atom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("breadcrumb/breadcrumb-visual-test", page);
        showSecondViewButton = Atom.find(
            Atom,
            "nui-demo-breadcrumb-show-second-view"
        );
        showThirdViewButton = Atom.find(
            Atom,
            "nui-demo-breadcrumb-show-third-view"
        );

        await showSecondViewButton.getLocator().click();
        await showThirdViewButton.getLocator().click();
    });

    test("should check a11y of breadcrumb", async ({ runA11yScan }) => {
        await runA11yScan(BreadcrumbAtom);
    });
});
