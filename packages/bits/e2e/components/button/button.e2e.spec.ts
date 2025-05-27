import { ButtonAtom } from "./button.atom";
import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";

let primaryCompactBtn: ButtonAtom;
let defaultLargeBtn: ButtonAtom;
let actionCompactBtn: ButtonAtom;
let defaultBtnWithIcon: ButtonAtom;
let primaryLargePlusIconDisabledBtn: ButtonAtom;
let primaryLargePlusIconBtn: ButtonAtom;
let primaryLargePlusIconBusyBtn: ButtonAtom;
let upBtn: ButtonAtom;
let unlimitedWidthBtn: ButtonAtom;

test.describe("USERCONTROL Button >", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("button/button-test", page);
        primaryCompactBtn = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-primary-compact-btn",
            true
        );
        defaultLargeBtn = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-default-large-btn",
            true
        );
        actionCompactBtn = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-action-compact-btn",
            true
        );
        defaultBtnWithIcon = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-btn-with-icon",
            true
        );
        primaryLargePlusIconDisabledBtn = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-primary-large-plus-icon-disabled-btn",
            true
        );
        primaryLargePlusIconBtn = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-primary-large-plus-icon-btn",
            true
        );
        primaryLargePlusIconBusyBtn = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-primary-large-plus-icon-busy-btn",
            true
        );
        upBtn = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-up-btn", true);
        unlimitedWidthBtn = Atom.find<ButtonAtom>(
            ButtonAtom,
            "nui-demo-long-text-btn"
        );
    });

    test("should always have .nui-button class", async () => {
        await primaryCompactBtn.toContainClass("nui-button");
        await defaultLargeBtn.toContainClass("nui-button");
    });

    test("should always have .btn class", async () => {
        await primaryCompactBtn.toContainClass("btn");
        await defaultLargeBtn.toContainClass("btn");
    });

    test("should have type class based on 'size' attribute", async () => {
        await primaryCompactBtn.toContainClass("btn-xs");
        await defaultLargeBtn.toContainClass("btn-lg");
    });

    test("should have type class based on 'displayStyle' attribute", async () => {
        await primaryCompactBtn.toContainClass("btn-primary");
        await defaultLargeBtn.toContainClass("btn-default");
        await actionCompactBtn.toContainClass("btn-action");
    });

    test("should have 'btn-default' css class if 'displayStyle' prop is not defined", async () => {
        await defaultBtnWithIcon.toContainClass("btn-default");
    });

    test("should not override user classes in host element with its own classes", async () => {
        await defaultLargeBtn.toContainClass("testClass");
    });

    test("should be disabled with 'disabled' DOM property", async () => {
        await primaryLargePlusIconDisabledBtn.toBeDisabled();
    });

    test("should show icon with \"icon\" prop", async () => {
        await primaryLargePlusIconBtn.isIconShown();
        await primaryLargePlusIconDisabledBtn.isIconShown();
    });

    test("should be busy showed depending on 'isBusy' prop", async () => {
        await primaryLargePlusIconBusyBtn.isBusy();
        await primaryLargePlusIconBtn.isNotBusy();
    });

    test("should accept mouse and keyboard events", async () => {
        const resultSpan = Helpers.page.locator("#nui-demo-click-results");
        const text = await resultSpan.textContent();
        const count: number = parseInt(text ?? "", 10);
        await upBtn.click();
        await upBtn.getLocator().press("Enter");
        await expect(resultSpan).toHaveText(String(count + 2));
    });

    test("should have left/right icon css class depending on \"iconRight\" prop", async () => {
        await defaultLargeBtn.toContainClass("icon-left");
        await defaultLargeBtn.toNotContainClass("icon-right");

        await primaryLargePlusIconBtn.toContainClass("icon-right");
        await primaryLargePlusIconBtn.toNotContainClass("icon-left");
    });

    test("should have .is-empty class if host's innerHTML is empty", async () => {
        await upBtn.toContainClass("is-empty");
    });

    test("should not have .is-empty class if host's innerHTML is not empty", async () => {
        await primaryCompactBtn.toNotContainClass("is-empty");
    });

    test("should fire event twice when clicking twice", async () => {
        const resultSpan = Helpers.page.locator("#nui-demo-click-results");
        const text = await resultSpan.textContent();
        const count: number = parseInt(text ?? "", 10);
        await upBtn.click();
        await upBtn.click();
        await expect(resultSpan).toHaveText(String(count + 2));
    });

    test("should remove width restriction with .unlimited-width class by click", async () => {
        await unlimitedWidthBtn.toBeVisible();
        await unlimitedWidthBtn.toContainClass("unlimited-width");
        await unlimitedWidthBtn.click();
        await unlimitedWidthBtn.toNotContainClass("unlimited-width");
        await unlimitedWidthBtn.click();
        await unlimitedWidthBtn.toContainClass("unlimited-width");
    });
});
