import { browser, by, element, ElementArrayFinder, ElementFinder } from "protractor";

import { Helpers } from "../../helpers";

import { PopoverAtom } from "./popover.atom";

describe("Visual tests: Popover", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    const buttonPreventClosing: ElementFinder = element(by.id("nui-demo-button-prevent-onclick"));
    const placementCheckButtons: ElementArrayFinder = element.all(by.css(".placement-check-btn"));
    const popoverPreventClosing: PopoverAtom = new PopoverAtom(element(by.id("nui-demo-popover-prevent-closing")));
    const popoverBasic: PopoverAtom = new PopoverAtom(element(by.id("nui-demo-popover-basic")));
    const popoverNoRestrictions: PopoverAtom = new PopoverAtom(element(by.id("nui-demo-popover-no-limits")));
    const popoverNoPadding: PopoverAtom = new PopoverAtom(element(by.id("nui-demo-popover-no-padding")));
    const popoverBasicMultiline: PopoverAtom = new PopoverAtom(element(by.id("nui-demo-popover-limited-and-multiline")));
    const popoverModal: PopoverAtom = new PopoverAtom(element(by.id("nui-demo-popover-modal")));

    beforeEach(async (done) => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("popover/popover-visual-test");
        done();
    });

    afterAll(async (done) => {
        await eyes.abortIfNotClosed();
        done();
    }, 1000);

    it("Default look", async (done) => {
        await eyes.open(browser, "NUI", "Popover");

        await popoverPreventClosing.togglePopover();
        await placementCheckButtons.each(async btn => await btn?.click());
        await eyes.checkWindow("Popover placement and preventClose");

        await Helpers.switchDarkTheme("on");
        await eyes.checkWindow("Dark theme");
        await Helpers.switchDarkTheme("off");
        await placementCheckButtons.each(async btn => await btn?.click());
        await popoverPreventClosing.togglePopover();

        await popoverBasic.openByHover();
        await eyes.checkWindow("Basic popover");
        await browser.actions().mouseMove(buttonPreventClosing).perform();
        await popoverBasic.waitForClosed();

        await popoverNoPadding.openByHover();
        await eyes.checkWindow("Popover with title and custom (no) padding");
        await browser.actions().mouseMove(buttonPreventClosing).perform();
        await popoverNoPadding.waitForClosed();

        await popoverNoRestrictions.openByHover();
        await eyes.checkWindow("Popover with no width restrictions");
        await browser.actions().mouseMove(buttonPreventClosing).perform();
        await popoverNoRestrictions.waitForClosed();

        await popoverBasicMultiline.openByHover();
        await eyes.checkWindow("Basic multiline popover");
        await browser.actions().mouseMove(buttonPreventClosing).perform();
        await popoverBasicMultiline.waitForClosed();

        await popoverModal.open();
        await eyes.checkWindow("Modal popover");

        await eyes.close();
        done();
    }, 300000);
});
