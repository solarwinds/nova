import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser } from "protractor";

import { ZoomBooster } from "./boosters/zoom.booster";
import { TimeFrameBarTestPage } from "./time-frame-bar-test.po";
const { StitchMode } = require("@applitools/eyes-protractor");
describe("Visual tests: Charts - Thresholds on Line Chart with Summary Section", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    const page = new TimeFrameBarTestPage();

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setStitchMode(StitchMode.Scroll);
        await Helpers.prepareBrowser("time-frame-bar/test");
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);
        await page.removeDelay();
    });

    afterAll(async () => {
        eyes.setStitchMode(StitchMode.CSS);
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Charts - TimeFrameBar With Real Life Chart");
        await eyes.checkWindow("Default");

        await ZoomBooster.zoom(
            page.chart,
            { x: 50, y: 50 },
            { x: 200, y: 50 }
        );
        await eyes.checkWindow("After zoom");
        await eyes.close();
    }, 100000);

});
