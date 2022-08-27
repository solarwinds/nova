import { browser } from "protractor";

import { Camera } from "@nova-ui/bits/sdk/atoms";
import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { ZoomBooster } from "./boosters/zoom.booster";
import { TimeFrameBarTestPage } from "./time-frame-bar-test.po";

const name: string = "TimeFrame Bar";

describe(`Visual tests: Charts - ${name}`, () => {
    let camera: Camera;
    const page = new TimeFrameBarTestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("time-frame-bar/test");
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );
        await page.removeDelay();

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Default look`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`${name} - Default`);

        await ZoomBooster.zoom(page.chart, { x: 50, y: 50 }, { x: 200, y: 50 });
        await camera.say.cheese(`${name} - After zoom`);

        await camera.turn.off();
    }, 100000);
});
