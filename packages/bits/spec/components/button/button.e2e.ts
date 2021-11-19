import { Key } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ButtonAtom } from "../public_api";

describe("USERCONTROL Button", () => {
    let primaryCompactBtn: ButtonAtom;
    let primaryLargePlusIconBtn: ButtonAtom;
    let primaryLargePlusIconDisabledBtn: ButtonAtom;
    let primaryLargePlusIconBusyBtn: ButtonAtom;
    let defaultBtnWithIcon: ButtonAtom;
    let defaultLargeBtn: ButtonAtom;
    let actionCompactBtn: ButtonAtom;
    let upBtn: ButtonAtom;
    let unlimitedWidthBtn: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("button/button-test");
        primaryCompactBtn = Atom.find(ButtonAtom, "nui-demo-primary-compact-btn");
        primaryLargePlusIconBtn = Atom.find(ButtonAtom, "nui-demo-primary-large-plus-icon-btn");
        primaryLargePlusIconDisabledBtn = Atom.find(ButtonAtom, "nui-demo-primary-large-plus-icon-disabled-btn");
        primaryLargePlusIconBusyBtn = Atom.find(ButtonAtom, "nui-demo-primary-large-plus-icon-busy-btn");
        defaultBtnWithIcon = Atom.find(ButtonAtom, "nui-demo-btn-with-icon");
        defaultLargeBtn = Atom.find(ButtonAtom, "nui-default-large-btn");
        actionCompactBtn = Atom.find(ButtonAtom, "nui-demo-action-compact-btn");
        upBtn = Atom.find(ButtonAtom, "nui-demo-up-btn");
        unlimitedWidthBtn = Atom.find(ButtonAtom, "nui-demo-long-text-btn");
    });

    it("should always have .nui-button class", async () => {
        expect(await primaryCompactBtn.hasClass("nui-button")).toBe(true);
        expect(await defaultLargeBtn.hasClass("nui-button")).toBe(true);
    });

    it("should always have .btn class", async () => {
        expect(await primaryCompactBtn.hasClass("btn")).toBe(true);
        expect(await defaultLargeBtn.hasClass("btn")).toBe(true);
    });

    it("should have type class based on 'size' attribute", async () => {
        expect(await primaryCompactBtn.hasClass("btn-xs")).toBe(true, "nui-demo-primary-compact-btn");
        expect(await defaultLargeBtn.hasClass("btn-lg")).toBe(true, "nui-default-large-btn");
    });

    it("should have type class based on 'displayStyle' attribute", async () => {
        expect(await primaryCompactBtn.hasClass("btn-primary")).toBe(true, "nui-demo-primary-compact-btn");
        expect(await defaultLargeBtn.hasClass("btn-default")).toBe(true, "nui-default-large-btn");
        expect(await actionCompactBtn.hasClass("btn-action")).toBe(true, "nui-demo-action-compact-btn");
    });

    it("should have 'btn-default' css class if 'displayStyle' prop is not defined", async () => {
        expect(await defaultBtnWithIcon.hasClass("btn-default")).toBe(true, "nui-demo-btn-with-icon");
    });

    it("should not override user classes in host element with its own classes", async () => {
        expect(await defaultLargeBtn.hasClass("testClass")).toBe(true, ".testClass at nui-default-large-btn");
    });

    it("should be disabled with 'disabled' DOM property", async () => {
        expect(await primaryLargePlusIconDisabledBtn.isDisabled())
            .toBe(true, "nui-demo-primary-large-plus-icon-disabled-btn");
    });

    it("should show icon with 'icon' prop", async () => {
        expect(await primaryLargePlusIconBtn.isIconShown())
            .toBe(true, "nui-demo-primary-large-plus-icon-btn");
        expect(await primaryLargePlusIconDisabledBtn.isIconShown())
            .toBe(true, "nui-demo-primary-large-plus-icon-disabled-btn false");
    });

    it("should be busy showed depending on 'isBusy' prop", async () => {
        expect(await primaryLargePlusIconBusyBtn.isBusy()).toBe(true, "nui-demo-primary-large-plus-icon-busy-btn");
        expect(await primaryLargePlusIconBtn.isBusy()).toBe(false, "nui-demo-primary-large-plus-icon-busy-btn");
    });

    it("should accept mouse and keyboard events", async () => {
        const resultSpan = Helpers.getElementByCSS("#nui-demo-click-results");
        const text = await resultSpan.getText();
        const count: number = parseInt(text, 10);
        await upBtn.click();
        await upBtn.getElement().sendKeys(Key.ENTER);
        expect(await resultSpan.getText()).toBe(String(count + 2));
    });

    it("should have left/right icon css class depending on 'iconRight' prop", async () => {
        expect(await defaultLargeBtn.hasClass("icon-left")).toEqual(true, ".icon-left if false");
        expect(await defaultLargeBtn.hasClass("icon-right")).toEqual(false, ".icon-right if true");
        expect(await primaryLargePlusIconBtn.hasClass("icon-right")).toEqual(true, ".icon-left if false");
        expect(await primaryLargePlusIconBtn.hasClass("icon-left")).toEqual(false, ".icon-right if true");
    });

    it("should have .is-empty class if host's innerHTML is empty", async () => {
        expect(await upBtn.hasClass("is-empty")).toEqual(true);
    });

    it("should not have .is-empty class if host's innerHTML is not empty", async () => {
        expect(await primaryCompactBtn.hasClass("is-empty")).toEqual(false);
    });

    it("should fire event twice when clicking twice", async () => {
        const resultSpan = Helpers.getElementByCSS("#nui-demo-click-results");
        const text = await resultSpan.getText();
        const count: number = parseInt(text, 10);
        await upBtn.click();
        await upBtn.click();
        expect(await resultSpan.getText()).toBe(String(count + 2));
    });

    it("should remove width restriction with .unlimited-width class by click", async () => {
        expect(await unlimitedWidthBtn.isVisible()).toBe(true, "nui-demo-long-text-bt");
        await unlimitedWidthBtn.click();
        expect(await unlimitedWidthBtn.hasClass("unlimited-width")).toEqual(false);
        await unlimitedWidthBtn.click();
        expect(await unlimitedWidthBtn.hasClass("unlimited-width")).toEqual(true);
    });

    // TODO: Fix with NUI-2612. With control flow disabled, this test became flaky.
    // No root cause found so far. It fails quite rarely, approx. once per 10 runs.
    xit("should keep firing event when mousekey is held if 'isRepeat' is true", async () => {
        const isRepeatOn = Helpers.getElementByCSS("#is-repeat-on");
        await isRepeatOn.click();
        const resultSpan = Helpers.getElementByCSS("#nui-demo-click-results");
        const text = await resultSpan.getText();
        const count: number = parseInt(text, 10);
        await upBtn.mouseDownAndHold(1000);
        expect(await resultSpan.getText()).toBeGreaterThan(count + 3);
    });

    // TODO: Fix with NUI-2612. With control flow disabled, this test became flaky.
    // No root cause found so far. It fails quite rarely, approx. once per 10 runs.
    xit("should fire event once even when mousekey is held if 'isRepeat' is false", async () => {
        const isRepeatOff = Helpers.getElementByCSS("#is-repeat-off");
        await isRepeatOff.click();
        const resultSpan = Helpers.getElementByCSS("#nui-demo-click-results");
        const text = await resultSpan.getText();
        const count: number = parseInt(text, 10);
        await upBtn.mouseDownAndHold(700);
        expect(await resultSpan.getText()).toBe(String(count + 1));
    });
});
