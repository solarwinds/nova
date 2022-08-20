import { browser, by, element } from "protractor";

import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

import { SpinnerAtom } from "./spinner.atom";

const name: string = "Spinner";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera, spinnerLargeWithCancel: SpinnerAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("spinner/spinner-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        spinnerLargeWithCancel = new SpinnerAtom(
            element(by.id("nui-spinner-large-cancel"))
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);
        await Helpers.switchDarkTheme("off");

        await spinnerLargeWithCancel.waitForDisplayed();
        await spinnerLargeWithCancel.cancel();
        await camera.say.cheese("Spinners with cancel buttons are cancelled");

        await camera.turn.off();
    }, 100000);
});
