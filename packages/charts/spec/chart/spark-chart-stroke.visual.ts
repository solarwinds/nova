import { Atom } from "@nova-ui/bits/sdk/atoms";
import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";

import { ChartAtom } from "./atoms/chart.atom";
const { StitchMode } = require("@applitools/eyes-protractor");
describe("Visual tests: Charts - Spark Chart", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setStitchMode(StitchMode.Scroll);
        await Helpers.prepareBrowser("chart-types/spark/stroke-test");
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);
    });

    afterAll(async () => {
        eyes.setStitchMode(StitchMode.CSS);
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Charts - Spark Chart Stroke");
        await eyes.checkWindow("Default");

        await eyes.checkWindow("After hover");

        await eyes.close();
    }, 100000);
});
