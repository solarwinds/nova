import { PopupAtom } from "./popup.atom";
import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";

test.describe("legacy research popup", () => {
    test("opens and closes independently of the modern popup examples", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("popup/popup-legacy-test", page);
        const toggle = page.getByRole("button", {
            name: "Open legacy research popup",
            exact: true,
        });
        const content = page.getByText("Legacy popup details", { exact: true });
        const area = page.locator(
            "body > nui-popup-container .nui-popup__area"
        );

        await expect(page.locator("nui-popup")).toHaveCount(0);
        await expect(content).toBeHidden();
        await toggle.click();
        await expect(area).toBeVisible();
        await expect(content).toBeVisible();
        await toggle.click();
        await expect(content).toBeHidden();
        await expect(
            page.locator("body > nui-popup-container .nui-popup--opened")
        ).toHaveCount(0);
    });
});

test.describe("USERCONTROL Popup", () => {
    let popupSimple: PopupAtom;
    let popupCustomWidth: PopupAtom;
    let popupIsOpened: PopupAtom;
    let popupAppendToBody: PopupAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("popup/popup-test", page);
        popupSimple = Atom.find<PopupAtom>(PopupAtom, "nui-demo-popup-simple");
        popupCustomWidth = Atom.find<PopupAtom>(
            PopupAtom,
            "nui-demo-popup-custom-width"
        );
        popupIsOpened = Atom.find<PopupAtom>(
            PopupAtom,
            "nui-demo-popup-isOpen-true"
        );
        popupAppendToBody = Atom.find<PopupAtom>(
            PopupAtom,
            "nui-demo-popup-append-to-body"
        );
        popupAppendToBody.detachedPopupContextClass = "additional-host-class";
    });

    test("should respect the isOpen Input", async () => {
        await popupIsOpened.isOpened();
    });

    test("should be opened/closed on click event", async () => {
        await popupSimple.getPopupToggle.click();
        await popupSimple.isOpened();

        await popupSimple.getPopupToggle.click();
        await popupSimple.isNotOpened();
    });

    test("should be closed when other popup is opened", async () => {
        await popupSimple.open();
        await popupCustomWidth.open();

        await popupSimple.isNotOpened();
        await popupCustomWidth.isOpened();
    });

    test("should be closed if click outside the popup", async () => {
        await popupSimple.open();
        await Helpers.clickOnEmptySpace();
        await popupSimple.isNotOpened();
    });

    test("should attach container to body", async () => {
        await popupAppendToBody.open(true);
        await popupAppendToBody.isOpenedAppendToBody();
    });

    test("should detach container from body when closed", async () => {
        await popupAppendToBody.open(true);
        await popupAppendToBody.isOpenedAppendToBody();
        await Helpers.clickOnEmptySpace();
        await popupAppendToBody.isNotOpenedAppendToBody();
    });

    test("should respect context class", async () => {
        await popupAppendToBody.open(true);
        await expect(popupAppendToBody.getPopupBoxDetached).toContainClass(
            "nui-overlay"
        );
        await expect(popupAppendToBody.getPopupBoxDetached).toContainClass(
            "additional-host-class"
        );
    });

    test("should remove the appended to body popup container on close", async () => {
        await popupAppendToBody.open(true);

        await popupAppendToBody.getPopupToggle.click();
        await popupAppendToBody.isNotOpenedAppendToBody();
    });

    test("should accept custom width", async () => {
        await popupCustomWidth.getPopupToggle.click();

        await expect(popupCustomWidth.getPopupBox).toHaveCSS("width", "200px");
    });
});
