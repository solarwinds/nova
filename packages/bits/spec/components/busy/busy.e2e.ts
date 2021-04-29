import {
    browser,
    by,
    element, Key,
} from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import {
    BusyAtom,
    ButtonAtom,
    SelectAtom,
    SpinnerAtom,
} from "../public_api";

describe("USERCONTROL Busy", () => {
    let busy: BusyAtom;
    let progressBusy: BusyAtom;
    let busyBtn: ButtonAtom;
    let spinner: SpinnerAtom;
    let select: SelectAtom;

    beforeAll(async () => {
        busyBtn = Atom.find(ButtonAtom, "nui-busy-test-button");
        busy = Atom.findIn(BusyAtom, element(by.id("nui-busy-test-basic")));
        progressBusy = Atom.findIn(BusyAtom, element(by.id("nui-busy-test-progress")));
        spinner = Atom.findIn(SpinnerAtom, element(by.id("nui-busy-test-custom")));
        select = Atom.findIn(SelectAtom, element(by.id("nui-busy-select-overlay")));
    });

    beforeEach(async () => {
        await Helpers.prepareBrowser("busy/busy-test");
    });

    it("should append container to the attached element", async () => {
        expect(await busy.isAppended()).toBe(true);
    });

    it("should not container be visible when inactive", async () => {
        expect(await busy.isDisplayed()).toBe(false);
    });

    describe("Busy with Progress", () => {
        it("container should be visible when active", async () => {
            await busyBtn.click();
            expect(await progressBusy.isDisplayed()).toBe(true);
        });
    });

    describe("Busy with Spinner", () => {
        beforeEach(async () => {
            await busyBtn.click();
        });

        afterEach(async () => {
            await busyBtn.click();
        });

        it("container should be visible when active", async () => {
            await spinner.waitForDisplayed();
            expect(await spinner.isDisplayed()).toBe(true);
        });

        it("any appended to body popup (select) should not be overlapped by busy", async () => {
            await select.toggleMenu();
            // since select is appended to body, this is the simplest way to get its content
            const selectedItem = browser.element(by.cssContainingText(".nui-select-popup-host .nui-menu-item", "Item 2"));
            await selectedItem.click();
            expect(await select.getCurrentValue()).toBe("Item 2");
        });

        it("should NOT allow tab navigation when component is busy", async () => {
            await select.getElement().click();

            // should be focus on something else other than the last button on page
            await expect(await busyBtn.getElement().getId())
                .not.toEqual(await browser.switchTo().activeElement().getId());

            await browser.actions().sendKeys(Key.TAB).perform();

            // should be focus on that the last button on page,
            // since the focusable elements were skipped during our tab navigation
            expect(await browser.switchTo().activeElement().getId())
                .toEqual(await busyBtn.getElement().getId());
        });

        it("should allow tab navigation when component is NOT busy", async () => {
            // we'll be allowed to use tab navigation after busy=false
            await busyBtn.click();

            await select.getElement().click();
            await browser.actions().sendKeys(Key.TAB).perform();

            expect(await browser.switchTo().activeElement().getAttribute("id"))
                .toEqual("focusable-button-inside-busy-component");
        });
    });
});
