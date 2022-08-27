import { browser, by, element, ElementFinder } from "protractor";

import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Toast";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let buttonAllPositions: ElementFinder;
    let buttonAdjustSize: ElementFinder;
    let buttonNoHeader: ElementFinder;
    let buttonFW: ElementFinder;
    let buttonClearAllToasts: ElementFinder;
    let buttonCallStickyToast: ElementFinder;
    let buttonToastsWithProgressBar: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("toast/toast-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        buttonAllPositions = element(by.id("nui-toast-button-all-positions"));
        buttonFW = element(by.id("nui-toast-position-fw"));
        buttonClearAllToasts = element(by.id("nui-toast-clear-all-toasts"));
        buttonCallStickyToast = element(by.id("nui-toast-sticky"));
        buttonAdjustSize = element(by.id("nui-toast-adjust-size"));
        buttonNoHeader = element(by.id("nui-toast-no-header"));
        buttonToastsWithProgressBar = element(
            by.id("nui-toast-button-all-positions-progress-bar")
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await buttonAllPositions.click();
        await camera.say.cheese("Check all positions except of full width");
        await buttonClearAllToasts.click();

        Helpers.switchDarkTheme("on");
        await buttonAllPositions.click();
        await camera.say.cheese("Dark theme");
        await buttonClearAllToasts.click();
        Helpers.switchDarkTheme("off");

        await buttonFW.click();
        await camera.say.cheese("Check full width positions");
        await buttonClearAllToasts.click();

        await buttonAdjustSize.click();
        await camera.say.cheese(
            "Check toast messages ADJUST their sizes when triggered one after another"
        );
        await buttonClearAllToasts.click();

        await buttonNoHeader.click();
        await camera.say.cheese(
            "Checking the markup uis correct if no header is selected"
        );
        await buttonClearAllToasts.click();

        await buttonCallStickyToast.click();
        await camera.say.cheese("Check sticky toast");
        await buttonClearAllToasts.click();

        await buttonToastsWithProgressBar.click();
        await camera.say.cheese("Check progress by in scope of toast");
        await buttonClearAllToasts.click();

        await camera.turn.off();
    }, 100000);
});
