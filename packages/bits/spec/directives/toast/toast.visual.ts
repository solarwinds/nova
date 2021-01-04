
import { browser, by, element, ElementFinder } from "protractor";

import { Animations, Helpers } from "../../helpers";

describe("Visual tests: Toast", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let buttonAllPositions: ElementFinder;
    let buttonAdjustSize: ElementFinder;
    let buttonNoHeader: ElementFinder;
    let buttonFW: ElementFinder;
    let buttonClearAllToasts: ElementFinder;
    let buttonCallStickyToast: ElementFinder;
    let buttonToastsWithProgressBar: ElementFinder;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("toast/toast-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        buttonAllPositions = element(by.id("nui-toast-button-all-positions"));
        buttonFW = element(by.id("nui-toast-position-fw"));
        buttonClearAllToasts = element(by.id("nui-toast-clear-all-toasts"));
        buttonCallStickyToast = element(by.id("nui-toast-sticky"));
        buttonAdjustSize = element(by.id("nui-toast-adjust-size"));
        buttonNoHeader = element(by.id("nui-toast-no-header"));
        buttonToastsWithProgressBar = element(by.id("nui-toast-button-all-positions-progress-bar"));
    });

    afterAll(async () => {
        // Remove type conversion once NUI-4870 is done
        await (eyes as any).abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Toast");

        await buttonAllPositions.click();
        await eyes.checkWindow("Check all positions except of full width");
        await buttonClearAllToasts.click();

        Helpers.switchDarkTheme("on");
        await buttonAllPositions.click();
        await eyes.checkWindow("Dark theme");
        await buttonClearAllToasts.click();
        Helpers.switchDarkTheme("off");

        await buttonFW.click();
        await eyes.checkWindow("Check full width positions");
        await buttonClearAllToasts.click();

        await buttonAdjustSize.click();
        await eyes.checkWindow("Check toast messages ADJUST their sizes when triggered one after another");
        await buttonClearAllToasts.click();

        await buttonNoHeader.click();
        await eyes.checkWindow("Checking the markup uis correct if no header is selected");
        await buttonClearAllToasts.click();

        await buttonCallStickyToast.click();
        await eyes.checkWindow("Check sticky toast");
        await buttonClearAllToasts.click();

        await buttonToastsWithProgressBar.click();
        await eyes.checkWindow("Check progress by in scope of toast");
        await buttonClearAllToasts.click();

        await eyes.close();
    }, 100000);
});
