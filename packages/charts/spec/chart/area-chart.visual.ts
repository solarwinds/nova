import { Atom } from "@solarwinds/nova-bits/sdk/atoms";
import { Helpers } from "@solarwinds/nova-bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";

import { LegendAtom } from "../legend/legend.atom";
const { StitchMode } = require("@applitools/eyes-protractor");

describe("Visual Tests: Charts - Area Chart", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let legend: LegendAtom;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setStitchMode(StitchMode.CSS);
        await Helpers.prepareBrowser("chart-types/area/test");
        legend = Atom.findIn(LegendAtom, element(by.tagName("area-chart-bi-directional-example")));
    });

    afterAll(async () => {
        eyes.setStitchMode(StitchMode.Scroll);
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Charts - Area Chart");
        await eyes.checkWindow("Default look");

        await legend.getSeriesByIndex(1).hover();
        await eyes.checkWindow("Legend series hovered");

        await eyes.close();
    }, 100000);
});
