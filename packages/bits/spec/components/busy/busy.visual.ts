import { browser, by, element, ElementFinder } from "protractor";

import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Busy";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let switchBusyState: ElementFinder;

    beforeAll(async () => {
        await Helpers.prepareBrowser("busy/busy-visual-test");
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        camera = new Camera().loadFilm(browser, name);
        switchBusyState = element(by.id("nui-busy-test-button"));
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await switchBusyState.click();
        await camera.say.cheese(`States of Busy component`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
