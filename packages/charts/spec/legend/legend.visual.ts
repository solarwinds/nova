import { Atom } from "@solarwinds/nova-bits/sdk/atoms";
import { Animations, Helpers } from "@solarwinds/nova-bits/sdk/atoms/helpers";
import { browser, by, element } from "protractor";

import { LegendAtom } from "./legend.atom";
const { StitchMode } = require("@applitools/eyes-protractor");
describe("Visual tests: Legend", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let seriesRenderStatesLegend: LegendAtom;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        eyes.setStitchMode(StitchMode.Scroll);
        await Helpers.prepareBrowser("advanced-usage/legend/visual-test");
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        seriesRenderStatesLegend = Atom.findIn(LegendAtom, element(by.className("legend-series-render-states")));
    });

    afterAll(async () => {
        eyes.setStitchMode(StitchMode.CSS);
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Legend");
        await eyes.checkWindow("Default");

        const unselectedLegendSeries = seriesRenderStatesLegend.getSeriesByIndex(0);
        await seriesRenderStatesLegend.hover(unselectedLegendSeries.getElement());
        await eyes.checkWindow("Check unselected/hidden series on hover");

        const selectedLegendSeries = seriesRenderStatesLegend.getSeriesByIndex(3);
        await seriesRenderStatesLegend.hover(selectedLegendSeries.getElement());
        await eyes.checkWindow("Check selected series on hover");

        await seriesRenderStatesLegend.hover(selectedLegendSeries.richTile.getElement());
        await eyes.checkWindow("Check selected series on tile hover");

        await eyes.close();
    }, 100000);
});
